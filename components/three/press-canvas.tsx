"use client"

import { Canvas } from "@react-three/fiber"
import { useTheme } from "next-themes"
import { PressScene } from "./press-scene"

/**
 * The stage the press room is rendered on. Kept deliberately cheap: no
 * antialiasing (the dots are round and the sheets are soft-edged, so it barely
 * shows) and a capped pixel ratio, because this runs behind every section for
 * the whole visit.
 *
 * `key` on the scene remounts it when the press changes stock, which is what
 * re-reads the ink colours out of CSS.
 */
export default function PressCanvas({
  dots,
  sheets,
}: {
  dots: number
  sheets: number
}) {
  const { resolvedTheme } = useTheme()

  return (
    <Canvas
      camera={{ position: [0, 0, 9], fov: 42 }}
      gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
      dpr={[1, 1.6]}
      style={{ pointerEvents: "none" }}
    >
      <PressScene key={resolvedTheme ?? "light"} dots={dots} sheets={sheets} />
    </Canvas>
  )
}
