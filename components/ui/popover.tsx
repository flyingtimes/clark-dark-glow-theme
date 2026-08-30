"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type PopoverProps = {
  trigger: React.ReactNode
  children: React.ReactNode
  align?: "start" | "center" | "end"
  width?: number
  className?: string
}

/** 气泡弹出层：点击触发/外点关闭，带向上小箭头 */
function Popover({ trigger, children, align = "center", width = 280, className }: PopoverProps) {
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false) }
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false) }
    document.addEventListener("mousedown", onDown)
    document.addEventListener("keydown", onKey)
    return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey) }
  }, [open])

  const alignCls = align === "center" ? "left-1/2 -translate-x-1/2" : align === "end" ? "right-0" : "left-0"
  return (
    <div ref={ref} data-slot="popover" className={cn("relative inline-block", className)}>
      <span onClick={() => setOpen(!open)} className="inline-flex cursor-pointer">{trigger}</span>
      {open && (
        <>
          <span aria-hidden className="absolute left-1/2 top-full z-[88] -translate-x-1/2 border-8 border-transparent border-b-transparent" />
          <div
            role="dialog"
            style={{ width }}
            className={cn(
              "absolute top-[calc(100%+10px)] z-[90] rounded-xl border border-border bg-card p-4 text-[12px] leading-relaxed",
              "shadow-[0_0_40px_-14px_var(--accent-amber)]",
              alignCls
            )}
          >
            {children}
          </div>
        </>
      )}
    </div>
  )
}

export { Popover }
