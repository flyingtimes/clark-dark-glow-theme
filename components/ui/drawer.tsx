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

/** 底部抽屉：向上滑入的移动端风格面板 */
export function Drawer({ open, onOpenChange, title, children, className }: DrawerProps) {
  React.useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onOpenChange(false) }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open, onOpenChange])
  if (!open) return null
  return (
    <div data-slot="drawer" className="fixed inset-0 z-[120]">
      <style>{`@keyframes drawerUp{from{transform:translateY(100%)}to{transform:translateY(0)}}`}</style>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" onClick={() => onOpenChange(false)} />
      <div
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
        <Button_Close onOpenChange={onOpenChange} />
      </div>
    </div>
  )
}

function Button_Close({ onOpenChange }: { onOpenChange: (o: boolean) => void }) {
  return (
    <div className="mt-5 flex justify-end">
      <button
        type="button"
        onClick={() => onOpenChange(false)}
        className="cursor-pointer rounded-md border border-border px-4 py-1.5 font-mono text-[12px] transition-colors hover:border-accent-amber/50 hover:text-accent-amber"
      >
        关闭
      </button>
    </div>
  )
}
