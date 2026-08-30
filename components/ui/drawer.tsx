"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type DrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: React.ReactNode
  children?: React.ReactNode
  className?: string
}

/** 底部抽屉：向上滑入 + Tab 焦点陷阱 + 关闭后焦点还原 */
export function Drawer({ open, onOpenChange, title, children, className }: DrawerProps) {
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
  return (
    <div data-slot="drawer" className="fixed inset-0 z-[120]">
      <style>{`@keyframes drawerUp{from{transform:translateY(100%)}to{transform:translateY(0)}}`}</style>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" onClick={() => onOpenChange(false)} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        style={{ animation: "drawerUp .35s cubic-bezier(.32,.72,0,1)" }}
        className={cn(
          "absolute inset-x-0 bottom-0 mx-auto max-h-[80vh] w-full max-w-2xl overflow-y-auto",
          "rounded-t-2xl border-t border-accent-amber/40 bg-card p-6 shadow-[0_-16px_60px_-18px_var(--accent-amber)]",
          className
        )}
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border" />
        {title && <h3 className="text-[15px] font-bold">{title}</h3>}
        <div className="mt-3 text-[12px] leading-relaxed text-muted-foreground">{children}</div>
        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="cursor-pointer rounded-md border border-border px-4 py-1.5 font-mono text-[12px] transition-colors hover:border-accent-amber/50 hover:text-accent-amber"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  )
}
