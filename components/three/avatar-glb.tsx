"use client"

import { useEffect, useMemo, useRef } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { useAnimations, useGLTF } from "@react-three/drei"
import { Euler, MathUtils, Quaternion, Vector3, type Bone, type Group, type Mesh, type Object3D } from "three"

export const AVATAR_URL = "/avatar/avatar.glb"

/** Seconds a wave lasts, start to settled. */
const WAVE_TIME = 2.4

/* Where the arm should point while waving, as directions in world space.
   The figure faces +Z, so its right side is -X. Aiming a bone rather than
   setting a fixed rotation keeps this correct whatever rest pose and bone
   orientation the export happens to use. */
const AIM_UPPER = new Vector3(-0.62, 0.78, 0.1)
const AIM_FORE = new Vector3(-0.2, 0.95, 0.24)

/* How far the head may turn, in radians. A head that can swing further than
   this stops reading as a person looking at you. The neck takes a share of
   the same movement so the turn comes from the whole column. */
const MAX_YAW = 0.38 // ~22°
const MAX_PITCH = 0.2 // ~11°
const NECK_SHARE = 0.4

/** Blendshapes worth driving. The export carries 72; these are the useful ones. */
const BLINK = ["eyeBlinkLeft", "eyeBlinkRight"]
const SMILE = ["mouthSmileLeft", "mouthSmileRight"]

type MorphMesh = Mesh & {
  morphTargetDictionary?: Record<string, number>
  morphTargetInfluences?: number[]
}

/**
 * Chaiitanyaa's Avaturn avatar.
 *
 * The export ships a 54-bone skeleton and an 8-second idle, so the idle plays
 * on the mixer and the wave is layered on top: after the mixer has written its
 * pose each frame, the right arm's bones are slerped toward a raised pose by
 * an eased `lift`, and the forearm oscillates. Because it is the real skeleton
 * the whole arm foreshortens correctly — the thing a flat cut-out could never
 * do — and the fingers come along for free.
 *
 * Blinking and the smile use the model's own ARKit blendshapes.
 */
export function AvatarGLB({
  waveNonce,
  still = false,
}: {
  waveNonce: number
  still?: boolean
}) {
  const group = useRef<Group>(null)
  const { scene, animations } = useGLTF(AVATAR_URL)
  const { actions } = useAnimations(animations, group)

  // One avatar on the page, so the loaded scene can be used directly.
  const bones = useMemo(() => {
    const found: Record<string, Object3D> = {}
    const morphs: MorphMesh[] = []
    scene.traverse((o) => {
      if ((o as Bone).isBone) found[o.name] = o
      const m = o as MorphMesh
      if (m.isMesh && m.morphTargetDictionary && m.morphTargetInfluences) morphs.push(m)
      // No shadow casting: the only shadow on this stage is the baked contact
      // shadow underneath, and a shadow-map pass per frame is not worth it.
      if (m.isMesh) m.frustumCulled = false // the raised arm must not clip the bounds
    })
    // A bone's own direction is the offset of the child it points at.
    const axis = (bone?: Object3D, child?: Object3D) =>
      bone && child ? child.position.clone().normalize() : new Vector3(0, 1, 0)

    return {
      ...found,
      morphs,
      upperAxis: axis(found.RightArm, found.RightForeArm),
      foreAxis: axis(found.RightForeArm, found.RightHand),
    } as Record<string, Object3D> & {
      morphs: MorphMesh[]
      upperAxis: Vector3
      foreAxis: Vector3
    }
  }, [scene])

  // Start the idle. It poses the arms down out of the export's wide rest pose.
  useEffect(() => {
    const idle = Object.values(actions)[0]
    if (!idle) return
    idle.reset().fadeIn(0.5).play()
    return () => {
      idle.fadeOut(0.3)
    }
  }, [actions])

  const waveStart = useRef(0)
  const lastNonce = useRef(-1)
  const blinkAt = useRef(1.5)

  /* Look direction is smoothed as a pair of numbers and only then turned into
     a rotation. Damping the rotation itself — reading the bone back each frame
     and offsetting from that — feeds the bone's own output into its input, so
     a held cursor winds the head round and round instead of settling. */
  const look = useRef({ x: 0, y: 0 })

  /* The pointer, measured against the canvas but listened for on the window.
     R3F's own pointer only updates while the cursor is over the canvas, so it
     freezes at its last value the moment the reader moves away and the head
     stays locked staring in that direction. Tracking the whole page lets the
     figure follow the reader, and lets the values run past ±1 so the falloff
     below can tell how far away the cursor actually is. */
  const pointer = useRef({ x: 0, y: 0 })
  const gl = useThree((s) => s.gl)
  useEffect(() => {
    const el = gl.domElement
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      if (!r.width || !r.height) return
      pointer.current.x = ((e.clientX - r.left) / r.width) * 2 - 1
      pointer.current.y = -((e.clientY - r.top) / r.height) * 2 + 1
    }
    window.addEventListener("pointermove", onMove, { passive: true })
    return () => window.removeEventListener("pointermove", onMove)
  }, [gl])
  const lookQ = useMemo(() => new Quaternion(), [])
  const lookEuler = useMemo(() => new Euler(), [])

  /* The pose the look is measured from, captured once from the loaded rig.
     It must NOT be re-read from the bone each frame: whether the mixer has
     written its pose by then depends on callback order, and when it hasn't,
     the bone still holds the previous frame's result — so the look rotation
     compounds on itself and the head tumbles. Anchoring to the rest pose
     costs the idle's small head movement and is stable by construction. */
  const headBase = useMemo(
    () => (bones.Head as Bone | undefined)?.quaternion.clone() ?? new Quaternion(),
    [bones],
  )
  const neckBase = useMemo(
    () => (bones.Neck as Bone | undefined)?.quaternion.clone() ?? new Quaternion(),
    [bones],
  )
  const parentQ = useMemo(() => new Quaternion(), [])
  const aimQ = useMemo(() => new Quaternion(), [])
  const aimVec = useMemo(() => new Vector3(), [])

  /**
   * Rotate `bone` so the direction it points along (`axis`, in bone space)
   * lines up with `target` in world space, blended in by `amount`. `sway`
   * nudges the target sideways so the limb can swing without re-deriving it.
   */
  const aim = (
    bone: Object3D,
    axis: Vector3,
    target: Vector3,
    sway: number,
    amount: number,
  ) => {
    const parent = bone.parent
    if (!parent) return
    parent.getWorldQuaternion(parentQ)
    const dir = aimVec.copy(target)
    dir.x += sway
    dir.normalize().applyQuaternion(parentQ.invert())
    aimQ.setFromUnitVectors(axis, dir.normalize())
    bone.quaternion.slerp(aimQ, amount)
  }

  const setMorph = (name: string, value: number) => {
    for (const m of bones.morphs) {
      const i = m.morphTargetDictionary?.[name]
      if (i !== undefined && m.morphTargetInfluences) m.morphTargetInfluences[i] = value
    }
  }

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    if (lastNonce.current !== waveNonce) {
      lastNonce.current = waveNonce
      waveStart.current = t
    }

    /* The pointer is normalised to the canvas, so it runs well past ±1 once the
       cursor leaves it. Clamp it before it becomes an angle, and let the head
       relax back to neutral as the cursor gets further away — otherwise it sits
       pinned at full turn whenever the reader is elsewhere on the page. */
    const reach = Math.max(Math.abs(pointer.current.x), Math.abs(pointer.current.y))
    const attention = 1 - MathUtils.clamp((reach - 1.5) / 3, 0, 1)
    const px = still ? 0 : MathUtils.clamp(pointer.current.x, -1, 1) * attention
    const py = still ? 0 : MathUtils.clamp(pointer.current.y, -1, 1) * attention
    const ease = 1 - Math.exp(-5 * delta)
    look.current.x += (px - look.current.x) * ease
    look.current.y += (py - look.current.y) * ease

    // ── Head and neck turn toward the pointer ──
    const head = bones.Head as Bone | undefined
    const neck = bones.Neck as Bone | undefined
    if (head) {
      lookEuler.set(-look.current.y * MAX_PITCH, look.current.x * MAX_YAW, 0)
      head.quaternion.copy(headBase).multiply(lookQ.setFromEuler(lookEuler))
    }
    if (neck) {
      lookEuler.set(
        -look.current.y * MAX_PITCH * NECK_SHARE,
        look.current.x * MAX_YAW * NECK_SHARE,
        0,
      )
      neck.quaternion.copy(neckBase).multiply(lookQ.setFromEuler(lookEuler))
    }

    // ── Blink, on the model's own blendshapes ──
    if (!still) {
      const since = t - blinkAt.current
      let closed = 0
      if (since > 0 && since < 0.15) closed = 1 - Math.abs(since - 0.075) / 0.075
      else if (since >= 0.15) blinkAt.current = t + 2.2 + Math.random() * 3.6
      for (const n of BLINK) setMorph(n, closed)
    }

    // ── The wave ──
    const e = t - waveStart.current
    const active = !still && e >= 0 && e < WAVE_TIME
    const rise = active ? Math.min(1, e / 0.45) : 0
    const fall = active && e > WAVE_TIME - 0.6 ? (WAVE_TIME - e) / 0.6 : 1
    const lift = MathUtils.clamp(rise * fall, 0, 1)

    const arm = bones.RightArm as Bone | undefined
    const fore = bones.RightForeArm as Bone | undefined
    const hand = bones.RightHand as Bone | undefined

    if (lift > 0.001 && arm && fore) {
      // The hand sweeps side to side; the upper arm follows a little.
      const swing = Math.sin((e - 0.25) * 9.5)
      aim(arm, bones.upperAxis, AIM_UPPER, swing * 0.07, lift)
      aim(fore, bones.foreAxis, AIM_FORE, swing * 0.3, lift)
      if (hand) hand.rotateZ(swing * 0.18 * lift)
    }

    // Smile while waving.
    for (const n of SMILE) setMorph(n, lift * 0.55)
  })

  return (
    <group ref={group} position={[0, -1.42, 0]}>
      <primitive object={scene} />
    </group>
  )
}

useGLTF.preload(AVATAR_URL)
