"use client"

import { useState, useEffect } from "react"

export function LiveClock() {
  const [time, setTime] = useState<string>("")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const update = () => {
      const now = new Date()
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      )
    }
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [])

  if (!mounted) return <span className="font-mono text-xs tracking-widest text-muted-foreground">--:--:--</span>

  return (
    <span className="font-mono text-xs tracking-widest text-muted-foreground tabular-nums">
      {time}
    </span>
  )
}
