import AVFoundation
import AppKit

// Turns a long demo recording into the short silent loop a project card uses.
//
//   swift scripts/clip-demo.swift frames <in.mp4> /tmp/look "10,40,80"
//       — grab stills at those seconds, to find the segment worth showing
//
//   swift scripts/clip-demo.swift clip <in.mp4> public/projects/<slug>.mp4 84 14 2.4
//       — 14s from 84s, video only, 960x540, capped at 2.4MB
//
// Then take the poster from the same moment:
//   swift scripts/clip-demo.swift frames <in.mp4> /tmp/p "84"
//   sips -s format jpeg -s formatOptions 68 -Z 960 /tmp/p-84s.png \
//        --out public/projects/<slug>.jpg
let a = CommandLine.arguments
let mode = a[1]
let asset = AVURLAsset(url: URL(fileURLWithPath: a[2]))

if mode == "frames" {
  let prefix = a[3]
  let times = a[4].split(separator: ",").map { Double($0)! }
  let gen = AVAssetImageGenerator(asset: asset)
  gen.appliesPreferredTrackTransform = true
  gen.requestedTimeToleranceBefore = .zero
  gen.requestedTimeToleranceAfter = .zero
  gen.maximumSize = CGSize(width: 900, height: 900)
  for t in times {
    do {
      let cg = try gen.copyCGImage(at: CMTime(seconds: t, preferredTimescale: 600), actualTime: nil)
      let rep = NSBitmapImageRep(cgImage: cg)
      let png = rep.representation(using: .png, properties: [:])!
      let url = URL(fileURLWithPath: "\(prefix)-\(Int(t))s.png")
      try png.write(to: url)
      print("frame \(Int(t))s -> \(url.lastPathComponent)")
    } catch { print("frame \(t)s failed: \(error.localizedDescription)") }
  }
  exit(0)
}

// ── clip ──────────────────────────────────────────────────────────────────
let out = URL(fileURLWithPath: a[3])
let start = Double(a[4])!, dur = Double(a[5])!, maxMB = Double(a[6])!
try? FileManager.default.removeItem(at: out)

let sem = DispatchSemaphore(value: 0)
Task {
  // Video only: a silent loop needs no audio track, and dropping it saves
  // both bytes and the browser's autoplay restrictions.
  let comp = AVMutableComposition()
  guard let src = try? await asset.loadTracks(withMediaType: .video).first,
        let track = comp.addMutableTrack(withMediaType: .video, preferredTrackID: kCMPersistentTrackID_Invalid)
  else { print("no video track"); exit(1) }
  let range = CMTimeRange(start: CMTime(seconds: start, preferredTimescale: 600),
                          duration: CMTime(seconds: dur, preferredTimescale: 600))
  try? track.insertTimeRange(range, of: src, at: .zero)
  track.preferredTransform = (try? await src.load(.preferredTransform)) ?? .identity

  guard let ex = AVAssetExportSession(asset: comp, presetName: AVAssetExportPreset960x540) else {
    print("no export session"); exit(1)
  }
  ex.outputURL = out
  ex.outputFileType = .mp4
  ex.shouldOptimizeForNetworkUse = true          // moov atom first, so it streams
  ex.fileLengthLimit = Int64(maxMB * 1_000_000)  // hard ceiling on the result
  await ex.export()
  if ex.status == .completed {
    let kb = (try? FileManager.default.attributesOfItem(atPath: out.path)[.size] as? Int) ?? 0
    print("wrote \(out.lastPathComponent) — \((kb ?? 0)/1024) KB, \(dur)s from \(start)s")
  } else {
    print("export failed: \(ex.error?.localizedDescription ?? "unknown")")
    exit(1)
  }
  sem.signal()
}
sem.wait()
