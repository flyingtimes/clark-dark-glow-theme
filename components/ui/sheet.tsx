"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type SheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  side?: "right" | "left"
  title?: React.ReactNode
  children?: React.ReactNode
  className?: string
}

/** 侧滑面板：右侧/左侧滑入 + Tab 焦点陷阱 + 关闭后焦点还原 */
export function Sheet({ open, onOpenChange, side = "right", title, children, className }: SheetProps) {
  const panelRef = React.useRef<HTMLDivElement>(null)
  const prevFocus = React.useRef<HTMLElement | null>(null)

  React.useEffect(() => {
    if (!open) return
    prevFocus.current = document.activeElement as HTMLElement
    const focusables = () =>
      panelRef.current
        ? Array.from(panelRef.current.querySelectorAll<HTMLElement>('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])')).filter((n) => !n.hasAttribute("disabled"))
        : []
    focusables()[0]?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onOpenChange(false); return }
      if (e.key !== "Tab") return
      const list = focusables()
      const first = list[0], last = list[list.length - 1]
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
    }
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("keydown", onKey)
      prevFocus.current?.focus()
    }
  }, [open, onOpenChange])

  if (!open) return null
  const right = side === "right"
  return (
    <div data-slot="sheet" className="fixed inset-0 z-[120]">
      <style>{`@keyframes sheetIn{from{transform:translateX(${right ? "100%" : "-100%"})}to{transform:translateX(0)}}`}</style>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" onClick={() => onOpenChange(false)} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        style={{ animation: `sheetIn .35s cubic-bezier(.32,.72,0,1)`, [right ? "right" : "left"]: 0 }}
        className={cn(
          "absolute top-0 z-[121] h-full w-[92vw] max-w-md overflow-y-auto border-y bg-card p-6",
          right ? "border-l" : "border-r",
          right
            ? "border-l-accent-amber/40 shadow-[16px_0_60px_-18px_var(--accent-amber)]"
            : "border-r-accent-amber/40 shadow-[-16px_0_60px_-18px_var(--accent-amber)]",
          className
        )}
      >
        <div className="mb-4 flex items-center justify-between">
          {title && <h3 className="text-[15px] font-bold">{title}</h3>}
          <button
            type="button"
            aria-label="关闭"
            onClick={() => onOpenChange(false)}
            className="cursor-pointer rounded-md px-2 py-1 text-muted-foreground transition-colors hover:bg-accent-red/10 hover:text-accent-red"
          >
            ✕
          </button>
        </div>
        <div className="text-[12px] leading-relaxed text-muted-foreground">{children}</div>
      </div>
    </div>
  )
}
