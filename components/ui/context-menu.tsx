"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export type ContextMenuItem = { label: string; onSelect?: () => void; danger?: boolean } | "separator"

/** 自定义右键菜单：在目标区域右键弹出，点击任意处关闭 */
export function ContextMenu({
  items, children, className,
}: { items: ContextMenuItem[]; children: React.ReactNode; className?: string }) {
  const [pos, setPos] = React.useState<{ x: number; y: number } | null>(null)
  const close = () => setPos(null)
  return (
    <div
      data-slot="context-menu"
      className={cn("inline-block", className)}
      onContextMenu={(e) => { e.preventDefault(); setPos({ x: e.clientX, y: e.clientY }) }}
    >
      {children}
      {pos && (
        <>
          <div className="fixed inset-0 z-[95]" onClick={close} onContextMenu={(e) => { e.preventDefault(); close() }} />
          <div
            style={{ left: pos.x, top: pos.y }}
            className="fixed z-[100] min-w-[176px] rounded-lg border border-border bg-card p-1 shadow-[0_0_36px_-12px_var(--accent-amber)]"
          >
            {items.map((it, i) =>
              it === "separator" ? (
                <div key={i} className="my-1 h-px bg-border" />
              ) : (
                <button
                  key={i}
                  type="button"
                  onClick={() => { it.onSelect?.(); close() }}
                  className={cn(
                    "w-full cursor-pointer rounded-md px-3 py-1.5 text-left font-mono text-[12px] transition-colors",
                    it.danger
                      ? "text-accent-red hover:bg-accent-red/10"
                      : "text-muted-foreground hover:bg-accent-amber/10 hover:text-accent-amber"
                  )}
                >
                  {it.label}
                </button>
              )
            )}
          </div>
        </>
      )}
    </div>
  )
}
