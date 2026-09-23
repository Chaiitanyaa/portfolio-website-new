/**
 * Strips the blendshapes the site never touches out of the Avaturn export.
 *
 * Avaturn ships the full 72-shape ARKit set. three.js loops over every morph
 * target in the vertex shader whether it is used or not, so carrying 72 when
 * the site drives 4 costs real frame time — and most of the file size.
 *
 * Usage: node scripts/trim-avatar.mjs <in.glb> <out.glb>
 * Then compress the result:
 *   npx @gltf-transform/cli optimize <out.glb> public/avatar/avatar.glb \
 *     --compress meshopt --texture-compress webp --texture-size 1024
 */
import { NodeIO } from "@gltf-transform/core"
import { ALL_EXTENSIONS } from "@gltf-transform/extensions"

// Keep what components/three/avatar-glb.tsx drives, plus a little headroom.
const KEEP = new Set([
  "eyeBlinkLeft",
  "eyeBlinkRight",
  "mouthSmileLeft",
  "mouthSmileRight",
  "jawOpen",
  "browInnerUp",
])

const [, , input, output] = process.argv
if (!input || !output) {
  console.error("usage: node scripts/trim-avatar.mjs <in.glb> <out.glb>")
  process.exit(1)
}

const io = new NodeIO().registerExtensions(ALL_EXTENSIONS)
const doc = await io.read(input)

let removed = 0
let kept = 0
for (const mesh of doc.getRoot().listMeshes()) {
  const names = mesh.getExtras()?.targetNames
  if (!Array.isArray(names)) continue

  const keepIndices = []
  names.forEach((name, i) => {
    if (KEEP.has(name)) keepIndices.push(i)
  })

  for (const prim of mesh.listPrimitives()) {
    const targets = prim.listTargets()
    targets.forEach((target, i) => {
      if (keepIndices.includes(i)) return
      prim.removeTarget(target)
      target.dispose()
      removed++
    })
  }

  mesh.setExtras({ ...mesh.getExtras(), targetNames: keepIndices.map((i) => names[i]) })
  const weights = mesh.getWeights?.() ?? []
  if (weights.length) mesh.setWeights(keepIndices.map((i) => weights[i] ?? 0))
  kept += keepIndices.length
}

await io.write(output, doc)
console.log(`removed ${removed} morph targets, kept ${kept} → ${output}`)
