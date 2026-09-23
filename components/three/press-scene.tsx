"use client"

import { useEffect, useMemo, useRef } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import {
  Color,
  InstancedMesh,
  MathUtils,
  Matrix4,
  Quaternion,
  Vector3,
  type Group,
  type Mesh,
} from "three"

/**
 * The press room — the space the whole page is printed in.
 *
 * Two things live here: a field of dots in the two brand colours, and a
 * run of paper sheets drifting through. Scrolling travels down through the
 * space, so each section is somewhere different rather than the same backdrop
 * behind everything.
 *
 * Nothing in here is content. Every word on the site stays in the DOM above
 * this canvas, so the page still reads, ranks and works without WebGL.
 */

/** How far the field travels over a full page scroll, in world units. */
const TRAVEL = 34

function readInk(name: string, fallback: string) {
  if (typeof window === "undefined") return new Color(fallback)
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  if (!raw) return new Color(fallback)
  const [h, s, l] = raw.split(/\s+/)
  const color = new Color()
  try {
    color.setStyle(`hsl(${h}, ${s}, ${l})`)
  } catch {
    color.set(fallback)
  }
  return color
}

function Halftone({ count, inks }: { count: number; inks: Color[] }) {
  const mesh = useRef<InstancedMesh>(null)
  const dummy = useMemo(() => new Matrix4(), [])
  const pos = useMemo(() => new Vector3(), [])
  const quat = useMemo(() => new Quaternion(), [])
  const scale = useMemo(() => new Vector3(), [])

  // Fixed layout, generated once. Seeded by index so it never reshuffles.
  const dots = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const r = (n: number) => {
          const x = Math.sin(i * 12.9898 + n * 78.233) * 43758.5453
          return x - Math.floor(x)
        }
        return {
          x: (r(1) - 0.5) * 30,
          y: (r(2) - 0.5) * 46,
          z: -r(3) * 18 - 1,
          size: 0.016 + r(4) * 0.05,
          ink: Math.floor(r(5) * inks.length),
          phase: r(6) * Math.PI * 2,
          drift: 0.25 + r(7) * 0.6,
        }
      }),
    [count, inks.length],
  )

  useEffect(() => {
    const m = mesh.current
    if (!m) return
    dots.forEach((d, i) => m.setColorAt(i, inks[d.ink] ?? inks[0]))
    if (m.instanceColor) m.instanceColor.needsUpdate = true
  }, [dots, inks])

  useFrame((state) => {
    const m = mesh.current
    if (!m) return
    const t = state.clock.elapsedTime
    const scroll = (state as unknown as { pressScroll?: number }).pressScroll ?? 0
    dots.forEach((d, i) => {
      // Nearer dots travel further, which is what reads as depth.
      const depth = 1 + (d.z + 19) / 19
      const y = ((d.y + scroll * TRAVEL * depth * 0.5 + 23) % 46) - 23
      pos.set(d.x + Math.sin(t * d.drift + d.phase) * 0.35, y, d.z)
      scale.setScalar(d.size)
      m.setMatrixAt(i, dummy.compose(pos, quat, scale))
    })
    m.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]} frustumCulled={false}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial toneMapped={false} />
    </instancedMesh>
  )
}

function Sheet({
  seed,
  paper,
}: {
  seed: number
  paper: Color
}) {
  const ref = useRef<Mesh>(null)
  const r = (n: number) => {
    const x = Math.sin(seed * 45.164 + n * 91.7) * 37193.13
    return x - Math.floor(x)
  }
  const base = useMemo(
    () => ({
      x: (r(1) - 0.5) * 22,
      y: (r(2) - 0.5) * 42,
      z: -2 - r(3) * 13,
      spin: (r(4) - 0.5) * 0.25,
      tilt: r(5) * Math.PI,
      drift: 0.1 + r(6) * 0.25,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [seed],
  )

  useFrame((state) => {
    const m = ref.current
    if (!m) return
    const t = state.clock.elapsedTime
    const scroll = (state as unknown as { pressScroll?: number }).pressScroll ?? 0
    const depth = 1 + (base.z + 15) / 15
    m.position.set(
      base.x + Math.sin(t * base.drift) * 0.6,
      ((base.y + scroll * TRAVEL * depth * 0.5 + 21) % 42) - 21,
      base.z,
    )
    m.rotation.set(Math.sin(t * base.drift * 0.7) * 0.25, base.tilt + t * base.spin * 0.12, Math.cos(t * base.drift) * 0.12)
  })

  return (
    <mesh ref={ref} frustumCulled={false}>
      <planeGeometry args={[2.4, 3.2]} />
      <meshStandardMaterial
        color={paper}
        roughness={0.95}
        metalness={0}
        transparent
        opacity={0.42}
        side={2}
      />
    </mesh>
  )
}

export function PressScene({ dots = 520, sheets = 7 }: { dots?: number; sheets?: number }) {
  const group = useRef<Group>(null)
  const scroll = useRef(0)
  const pointer = useRef({ x: 0, y: 0 })
  const invalidate = useThree((s) => s.invalidate)

  // Re-read the inks whenever the press changes stock (light ⇄ night).
  const [inks, paper, sheetColor] = useMemo(() => {
    const primary = readInk("--accent", "#0d6e66")
    const secondary = readInk("--support", "#b26a16")
    const stock = readInk("--background", "#f1f2f3")
    const key = readInk("--foreground", "#15181b")
    // Paper on paper is invisible, so the sheets carry a little of the key
    // ink — which lightens them on black stock and darkens them on pale.
    return [
      [primary, secondary, primary.clone().lerp(secondary, 0.5)],
      stock,
      stock.clone().lerp(key, 0.16),
    ] as const
  }, [])

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      scroll.current = max > 0 ? window.scrollY / max : 0
      invalidate()
    }
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("pointermove", onMove, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("pointermove", onMove)
    }
  }, [invalidate])

  useFrame((state, delta) => {
    // Hand the scroll position to the children through frame state.
    ;(state as unknown as { pressScroll: number }).pressScroll = scroll.current
    const g = group.current
    if (!g) return
    // A little parallax so the space has volume when the reader moves.
    g.rotation.y = MathUtils.damp(g.rotation.y, pointer.current.x * 0.06, 2, delta)
    g.rotation.x = MathUtils.damp(g.rotation.x, -pointer.current.y * 0.04, 2, delta)
  })

  return (
    <>
      {/* Distant ink dissolves into the stock — this is what gives the field
          depth instead of a flat scatter of dots. It has to sit outside the
          group: `attach` targets the parent, and only the scene holds fog. */}
      <fog attach="fog" args={[`#${paper.getHexString()}`, 7, 24]} />
      <group ref={group}>
      <ambientLight intensity={0.75} />
      <directionalLight position={[4, 6, 6]} intensity={1.1} />
      <directionalLight position={[-6, -2, 2]} intensity={0.5} color={inks[0]} />

      <Halftone count={dots} inks={inks as unknown as Color[]} />
      {Array.from({ length: sheets }, (_, i) => (
        <Sheet key={i} seed={i + 1} paper={sheetColor} />
      ))}
      </group>
    </>
  )
}
