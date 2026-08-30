"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useFocusTrap } from "@/hooks/use-focus-trap"

type DrawerProps = {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  title?: React.ReactNode
  children?: React.ReactNode
  className?: string
}

/** 底部抽屉：向上滑入 + 焦点陷阱/还原（useFocusTrap） */
export function Drawer({
  open: controlled, defaultOpen = false, onOpenChange, title, children, className,
}: DrawerProps) {
  const [internal, setInternal] = React.useState(defaultOpen)
  const open = controlled ?? internal
  const change = (o: boolean) => { setInternal(o); onOpenChange?.(o) }
  const panelRef = useFocusTrap<HTMLDivElement>(open, () => change(false))

  if (!open) return null
  return (
    <div data-slot="drawer" className="fixed inset-0 z-[120]">
      <style>{`@keyframes drawerUp{from{transform:translateY(100%)}to{transform:translateY(0)}}`}</style>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" onClick={() => change(false)} />
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
            onClick={() => change(false)}
            className="cursor-pointer rounded-md border border-border px-4 py-1.5 font-mono text-[12px] transition-colors hover:border-accent-amber/50 hover:text-accent-amber"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  )
}
