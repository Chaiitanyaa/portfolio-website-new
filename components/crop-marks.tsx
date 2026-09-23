"use client"

/** Crop marks in the viewport corners — the sheet runs past the trim. */
export function CropMarks() {
  return (
    <div className="crop-marks hidden md:block" aria-hidden>
      <span />
      <span />
      <span />
      <span />
    </div>
  )
}
