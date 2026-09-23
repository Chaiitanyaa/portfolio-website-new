import Foundation
import Vision
import CoreImage
import ImageIO
import UniformTypeIdentifiers

// Cuts a memoji out of its background and splits the waving hand into its own
// layer so the site can animate it.
//
// Usage:  swift scripts/lift-memoji.swift <memoji.jpg|png> public/memoji [--review]
//
// Writes memoji.png (full cut-out), memoji-body.png and memoji-hand.png, all
// on the same canvas so they stack exactly, and prints the wrist pivot to use
// as the hand's transform-origin in components/memoji.tsx. --review also writes
// contact sheets on light and dark stock for checking the edges.
let args = CommandLine.arguments
let inURL = URL(fileURLWithPath: args[1])
let outDir = URL(fileURLWithPath: args[2])

guard let src = CGImageSourceCreateWithURL(inURL as CFURL, nil),
      let image = CGImageSourceCreateImageAtIndex(src, 0, nil) else { fatalError("cannot read image") }
let W = image.width, H = image.height

// ── 1. Original pixels, straight RGBA, row 0 = top ────────────────────────
var rgba = [UInt8](repeating: 0, count: W * H * 4)
let cs = CGColorSpace(name: CGColorSpace.sRGB)!
rgba.withUnsafeMutableBytes { buf in
  let ctx = CGContext(data: buf.baseAddress, width: W, height: H, bitsPerComponent: 8,
                      bytesPerRow: W * 4, space: cs,
                      bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
  ctx.draw(image, in: CGRect(x: 0, y: 0, width: W, height: H))
}

// ── 2. Subject mask from Vision (same engine as "Lift Subject") ──────────
let request = VNGenerateForegroundInstanceMaskRequest()
let handler = VNImageRequestHandler(cgImage: image, options: [:])
try handler.perform([request])
guard let obs = request.results?.first else { fatalError("no foreground found") }
let maskBuf = try obs.generateScaledMaskForImage(forInstances: obs.allInstances, from: handler)
CVPixelBufferLockBaseAddress(maskBuf, .readOnly)
let mW = CVPixelBufferGetWidth(maskBuf), mH = CVPixelBufferGetHeight(maskBuf)
let mRow = CVPixelBufferGetBytesPerRow(maskBuf)
let mBase = CVPixelBufferGetBaseAddress(maskBuf)!
precondition(mW == W && mH == H, "mask \(mW)x\(mH) != image \(W)x\(H)")
var alpha = [Float](repeating: 0, count: W * H)
for y in 0..<H {
  let row = mBase.advanced(by: y * mRow).assumingMemoryBound(to: Float32.self)
  for x in 0..<W { alpha[y * W + x] = max(0, min(1, row[x])) }
}
CVPixelBufferUnlockBaseAddress(maskBuf, .readOnly)

// ── 3. Decontaminate edges: edge pixels were antialiased against white, ──
//      so pull the white back out, or they'd glow on the dark theme.
var out = [UInt8](repeating: 0, count: W * H * 4)
for i in 0..<(W * H) {
  let a = alpha[i]
  if a < 0.02 { continue }
  for c in 0..<3 {
    let C = Float(rgba[i * 4 + c]) / 255
    let F = a > 0.98 ? C : (C - (1 - a)) / a
    out[i * 4 + c] = UInt8(max(0, min(1, F)) * 255)
  }
  out[i * 4 + 3] = UInt8(a * 255)
}

// ── 4. Find the sleeve cuff (the dark band under the raised hand) ────────
var cx0 = W, cx1 = 0, cy0 = H, cy1 = 0
for y in 150..<270 { for x in 290..<W {
  let i = y * W + x
  if alpha[i] > 0.5 && rgba[i*4] < 70 && rgba[i*4+1] < 70 && rgba[i*4+2] < 70 {
    cx0 = min(cx0, x); cx1 = max(cx1, x); cy0 = min(cy0, y); cy1 = max(cy1, y)
  }
}}
print("cuff bbox x:\(cx0)-\(cx1) y:\(cy0)-\(cy1)")

// Hand layer: everything right of the head and above the cuff's bottom edge.
// Body layer: the rest, but it KEEPS the cuff so a slight rotation of the
// hand never opens a gap at the wrist.
let splitX = 290
var hand = [UInt8](repeating: 0, count: W * H * 4)
var body = out
var hx0 = W, hx1 = 0, hy0 = H, hy1 = 0
for y in 0..<H { for x in 0..<W {
  let i = y * W + x
  guard out[i*4+3] > 0, x >= splitX else { continue }
  if y <= cy1 {
    for c in 0..<4 { hand[i*4+c] = out[i*4+c] }
    hx0 = min(hx0, x); hx1 = max(hx1, x); hy0 = min(hy0, y); hy1 = max(hy1, y)
    if y < cy0 { for c in 0..<4 { body[i*4+c] = 0 } }
  }
}}
print("hand bbox x:\(hx0)-\(hx1) y:\(hy0)-\(hy1)")
let pivotX = Double(cx0 + cx1) / 2, pivotY = Double(cy0 + cy1) / 2
print(String(format: "pivot px (%.0f, %.0f)  => transform-origin %.2f%% %.2f%%", pivotX, pivotY, pivotX / Double(W) * 100, pivotY / Double(H) * 100))

// ── 5. Write PNGs ─────────────────────────────────────────────────────────
func write(_ px: [UInt8], _ name: String) {
  let data = Data(px) as CFData
  let provider = CGDataProvider(data: data)!
  let img = CGImage(width: W, height: H, bitsPerComponent: 8, bitsPerPixel: 32, bytesPerRow: W * 4,
                    space: cs, bitmapInfo: CGBitmapInfo(rawValue: CGImageAlphaInfo.last.rawValue),
                    provider: provider, decode: nil, shouldInterpolate: true, intent: .defaultIntent)!
  let url = outDir.appendingPathComponent(name)
  let dest = CGImageDestinationCreateWithURL(url as CFURL, UTType.png.identifier as CFString, 1, nil)!
  CGImageDestinationAddImage(dest, img, nil)
  CGImageDestinationFinalize(dest)
  print("wrote \(name)")
}
write(out, "memoji.png")
write(body, "memoji-body.png")
write(hand, "memoji-hand.png")

guard args.count > 3, args[3] == "--review" else { exit(0) }

// Review sheet: full cut-out on light stock, dark stock, and the hand layer tinted.
func composite(bg: (UInt8, UInt8, UInt8), layers: [[UInt8]], tint: Bool = false) -> [UInt8] {
  var c = [UInt8](repeating: 255, count: W * H * 4)
  for i in 0..<(W*H) { c[i*4] = bg.0; c[i*4+1] = bg.1; c[i*4+2] = bg.2 }
  for (li, L) in layers.enumerated() { for i in 0..<(W*H) {
    let a = Float(L[i*4+3]) / 255; if a == 0 { continue }
    for ch in 0..<3 {
      var f = Float(L[i*4+ch])
      if tint && li == 1 { f = ch == 0 ? min(255, f * 0.6 + 100) : f * 0.6 }
      c[i*4+ch] = UInt8(f * a + Float(c[i*4+ch]) * (1 - a))
    }
  }}
  return c
}
write(composite(bg: (231,232,227), layers: [out]), "_review-light.png")
write(composite(bg: (18,20,26), layers: [out]), "_review-dark.png")
write(composite(bg: (231,232,227), layers: [body, hand], tint: true), "_review-split.png")
