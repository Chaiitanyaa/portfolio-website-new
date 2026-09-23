import { ImageResponse } from "next/og"

export const alt = "Chaiitanyaa Chopraa — Software Developer"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

const PAPER = "#F1F2F3"
const PINK = "#0D6E66"
const BLUE = "#B26A16"
const KEY = "#15181B"
const MUTED = "#5A5E63"

/**
 * The share card, set as a proof sheet: clean name, surname in the pink ink,
 * the density strip and a one-line summary. Satori ships no italic or Didone,
 * so the surname carries the contrast through colour instead of style.
 */
export default function OpengraphImage() {
  const NAME_SIZE = 116

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: PAPER,
          padding: "64px 72px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 21,
            letterSpacing: "0.24em",
            color: MUTED,
          }}
        >
          <div style={{ display: "flex" }}>SOFTWARE DEVELOPER</div>
          <div style={{ display: "flex" }}>VICTORIA, BC · CANADA</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", padding: "18px 0 26px" }}>
          <div
            style={{
              display: "flex",
              fontSize: NAME_SIZE,
              lineHeight: 1,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: KEY,
            }}
          >
            Chaiitanyaa
          </div>
          <div
            style={{
              display: "flex",
              fontSize: NAME_SIZE,
              lineHeight: 1,
              fontWeight: 400,
              color: PINK,
              letterSpacing: "-0.035em",
            }}
          >
            Chopraa
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", height: 13, width: "100%" }}>
            {[PINK, "#2E8C82", "#63ADA4", "#C9CBC6", "#D9A768", "#C88A3A", BLUE].map((c) => (
              <div key={c} style={{ flex: 1, background: c }} />
            ))}
          </div>
          <div style={{ display: "flex", fontSize: 29, color: "#3D4146", marginTop: 26 }}>
            Full-stack systems in React, Node and Python — trading engines, AI
            platforms, procedural tooling.
          </div>
        </div>
      </div>
    ),
    size,
  )
}
