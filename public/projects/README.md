# Project screenshots

Drop a screenshot here, then point the matching entry in `lib/projects.ts` at it:

```ts
image: "/projects/social-spark.png",
```

Expected filenames (any of `.png` / `.jpg` / `.webp`):

| File | Project |
| --- | --- |
| `social-spark.*` | Social Spark |
| `swifttrade.*` | SwiftTrade |
| `procedural-builder.*` | Procedural Builder |
| `scenecraft.*` | SceneCraft |
| `rhythmblocks.*` | RhythmBlocks |

## What works best

- **Aspect ratio** roughly **16:10** — the card crops to that, centred.
- **Size** around 1600×1000. Bigger is fine; `next.config.mjs` has
  `images.unoptimized`, so compress before committing.
- **Colour does not matter.** Every screenshot is desaturated and reprinted
  through the pink/blue duotone plate, so a green dashboard and a blue one come
  out the same.
- **Contrast does matter.** Shadows take the blue plate and highlights take the
  pink one, so a shot with a clear light/dark split separates well. A uniformly
  mid-grey screenshot will come out flat.

Leave `image` commented out and the card prints an "unpulled plate" placeholder
instead — it never renders as a broken frame.
