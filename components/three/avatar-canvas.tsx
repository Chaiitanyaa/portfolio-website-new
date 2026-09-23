"use client"

import { Canvas } from "@react-three/fiber"
import { ContactShadows, PerformanceMonitor } from "@react-three/drei"
import { useState } from "react"
import { Suspense } from "react"
import { AvatarGLB } from "./avatar-glb"

/**
 * The hero avatar's WebGL stage.
 *
 * Keyed from the front-left with the two press inks as rim lights, so the 3D
 * figure belongs to the same palette as the rest of the sheet. The canvas is
 * transparent — the halftone disc behind it shows through.
 *
 * Loaded through next/dynamic with ssr:false, so none of three.js is in the
 * first payload and the page still renders without JavaScript.
 */
export default function AvatarCanvas({
  waveNonce,
  still = false,
}: {
  waveNonce: number
  still?: boolean
}) {
  // Drop resolution rather than frames if the device struggles.
  const [dpr, setDpr] = useState(1.6)

  return (
    <Canvas
      dpr={dpr}
      camera={{ position: [0, 0.08, 1.95], fov: 30 }}
      gl={{ antialias: true, alpha: true }}
      style={{ touchAction: "pan-y" }}
    >
      <PerformanceMonitor
        onDecline={() => setDpr(1)}
        onIncline={() => setDpr(1.6)}
      />

      <ambientLight intensity={0.38} />
      <hemisphereLight args={["#ffffff", "#bfbcb4", 0.35]} />
      <directionalLight
        position={[2.6, 3.6, 3.2]}
        intensity={1.7}
      />
      {/* The two brand colours, thrown from behind as rim light */}
      <directionalLight position={[-3.2, 1.4, -2.2]} intensity={0.85} color="#1FA396" />
      <directionalLight position={[3.4, 0.6, -2.6]} intensity={0.7} color="#D08A34" />

      <Suspense fallback={null}>
        <AvatarGLB waveNonce={waveNonce} still={still} />
      </Suspense>

      <ContactShadows
        position={[0, -0.62, 0]}
        opacity={0.32}
        scale={2.6}
        blur={2.8}
        far={1.6}
        resolution={384}
        frames={60}
        color="#2a2438"
      />
    </Canvas>
  )
}
