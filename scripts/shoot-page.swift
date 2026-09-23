import Cocoa
import WebKit

// Screenshots a live page — how public/projects/procedural-builder.png was made.
//
// Usage: swift scripts/shoot-page.swift <url> <out.png> [w] [h] [seconds] [js]
// The trailing JS runs partway through the wait, to drive a WebGL build into
// an interesting state first (the Unity city needs a "C" keypress).
let args = CommandLine.arguments
let url = URL(string: args[1])!
let out = URL(fileURLWithPath: args[2])
let w = args.count > 3 ? Double(args[3])! : 1600
let h = args.count > 4 ? Double(args[4])! : 1000
let wait = args.count > 5 ? Double(args[5])! : 8
// Optional JS run partway through the wait — e.g. to drive a WebGL build
// into an interesting state before the shutter.
let script: String? = args.count > 6 ? args[6] : nil

let app = NSApplication.shared
app.setActivationPolicy(.accessory)

let cfg = WKWebViewConfiguration()
cfg.preferences.setValue(true, forKey: "developerExtrasEnabled")
let web = WKWebView(frame: NSRect(x: 0, y: 0, width: w, height: h), configuration: cfg)
// A desktop UA so sites don't serve a mobile layout to an unknown client.
web.customUserAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15"

// Offscreen window: WebKit needs a hosting window to composite WebGL.
let win = NSWindow(contentRect: web.frame, styleMask: [.borderless], backing: .buffered, defer: false)
win.contentView = web
win.orderBack(nil)

web.load(URLRequest(url: url))

if let script {
  DispatchQueue.main.asyncAfter(deadline: .now() + wait * 0.45) {
    web.evaluateJavaScript(script) { _, err in
      if let err { FileHandle.standardError.write("js: \(err.localizedDescription)\n".data(using: .utf8)!) }
    }
  }
}

DispatchQueue.main.asyncAfter(deadline: .now() + wait) {
  let config = WKSnapshotConfiguration()
  config.rect = CGRect(x: 0, y: 0, width: w, height: h)
  web.takeSnapshot(with: config) { image, error in
    guard let image, let tiff = image.tiffRepresentation,
          let rep = NSBitmapImageRep(data: tiff),
          let png = rep.representation(using: .png, properties: [:]) else {
      FileHandle.standardError.write("snapshot failed: \(error?.localizedDescription ?? "unknown")\n".data(using: .utf8)!)
      exit(1)
    }
    try? png.write(to: out)
    print("wrote \(out.path) — \(png.count / 1024) KB, \(Int(w))x\(Int(h))")
    exit(0)
  }
}
app.run()
