"use client"

import { useState, useEffect } from "react"

/** Local time where Chaiitanyaa is. */
export function LiveClock({ className = "" }: { className?: string }) {
  const [time, setTime] = useState<string>("")

  useEffect(() => {
    const update = () => {
      setTime(
        new Date().toLocaleTimeString("en-CA", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
          timeZone: "America/Vancouver",
        }),
      )
    }
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <span
      className={`font-mono text-xs tabular-nums tracking-widest text-muted-foreground ${className}`}
    >
      {/* Placeholder keeps the bar from reflowing on hydration. */}
      {time || "--:--:--"}
    </span>
  )
}
