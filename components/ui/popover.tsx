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

/**
 * 气泡弹出层：点击触发/外点/Esc 关闭。
 * 打开时测量触发器与视口：水平空间不足自动换对齐；垂直空间不足自动翻转到上方。
 */
function Popover({ trigger, children, align = "center", width = 280, className }: PopoverProps) {
  const [open, setOpen] = React.useState(false)
  const [place, setPlace] = React.useState<{ above: boolean; align: "start" | "center" | "end" }>({ above: false, align })
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!open || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const needH = 320                                       // 估:面板典型高度
    const above = rect.bottom + needH > window.innerHeight && rect.top > needH
    let a: "start" | "center" | "end" = align
    if (a === "center") {
      const leftSpace = rect.left
      const rightSpace = window.innerWidth - rect.right
      if (rightSpace < width / 2 + 16 && leftSpace > rightSpace) a = "end"
      else if (leftSpace < width / 2 + 16 && rightSpace > leftSpace) a = "start"
    }
    setPlace({ above, align: a })
  }, [open, align, width])

  React.useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false) }
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false) }
    document.addEventListener("mousedown", onDown)
    document.addEventListener("keydown", onKey)
    return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey) }
  }, [open])

  const alignCls =
    place.align === "center" ? "left-1/2 -translate-x-1/2" : place.align === "end" ? "right-0" : "left-0"
  const posCls = place.above ? "bottom-[calc(100%+10px)]" : "top-[calc(100%+10px)]"
  const arrowCls = place.above
    ? "top-full -translate-y-full border-t-[var(--border)]"
    : "bottom-full border-b-[var(--border)]"

  return (
    <div ref={ref} data-slot="popover" className={cn("relative inline-block", className)}>
      <span onClick={() => setOpen(!open)} className="inline-flex cursor-pointer">{trigger}</span>
      {open && (
        <>
          <span
            aria-hidden
            className={cn("absolute left-1/2 z-[89] -translate-x-1/2 border-[8px] border-transparent", arrowCls)}
          />
          <div
            role="dialog"
            style={{ width }}
            className={cn(
              "absolute z-[90] rounded-xl border border-border bg-card p-4 text-[12px] leading-relaxed text-muted-foreground",
              "shadow-[0_0_40px_-14px_var(--accent-amber)]",
              posCls, alignCls
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
