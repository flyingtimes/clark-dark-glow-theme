"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type ResizableProps = {
  left: React.ReactNode
  right: React.ReactNode
  /** 初始左侧宽度百分比，默认 50 */
  initial?: number
  className?: string
}

/** 双栏拖拽分割：按住手柄水平拖动调整比例 */
function Resizable({ left, right, initial = 50, className }: ResizableProps) {
  const [w, setW] = React.useState(initial)
  const boxRef = React.useRef<HTMLDivElement>(null)
  const dragging = React.useRef(false)

  React.useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!dragging.current || !boxRef.current) return
      const rect = boxRef.current.getBoundingClientRect()
      const pct = ((e.clientX - rect.left) / rect.width) * 100
      setW(Math.max(15, Math.min(85, pct)))
    }
    const onUp = () => { dragging.current = false }
    window.addEventListener("pointermove", onMove)
    window.addEventListener("pointerup", onUp)
    return () => { window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerup", onUp) }
  }, [])

  return (
    <div ref={boxRef} data-slot="resizable" className={cn("flex h-full min-h-[200px] w-full overflow-hidden rounded-xl border border-border", className)}>
      <div style={{ width: `${w}%` }} className="overflow-hidden bg-card">{left}</div>
      <div
        role="separator"
        aria-orientation="vertical"
        onPointerDown={(e) => { e.preventDefault(); dragging.current = true }}
        className="w-1.5 shrink-0 cursor-col-resize bg-border transition-colors hover:bg-accent-amber/60"
      />
      <div className="min-w-0 flex-1 overflow-hidden bg-card">{right}</div>
    </div>
  )
}

export { Resizable }
