"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useDisclose } from "@/hooks/use-disclose"

export type DropdownItem =
  | { label: string; onSelect?: () => void; danger?: boolean; shortcut?: string }
  | "separator"

/** 下拉菜单：useDisclose 底座（外点/Esc 关闭）+ 120ms 弹入动画 */
export function DropdownMenu({
  trigger, items, align = "start", className,
}: { trigger: React.ReactNode; items: DropdownItem[]; align?: "start" | "end"; className?: string }) {
  const { ref, open, setOpen } = useDisclose()

  return (
    <div ref={ref} data-slot="dropdown-menu" data-state={open ? "open" : "closed"} className={cn("relative inline-block", className)}>
      <span onClick={() => setOpen(!open)} className="inline-flex cursor-pointer">{trigger}</span>
      {open && (
        <style>{`@keyframes clarkPop{from{opacity:0;scale:.97}to{opacity:1;scale:1}}@media(prefers-reduced-motion:reduce){[data-clark-pop]{animation:none!important}}`}</style>
      )}
      {open && (
        <div
          role="menu"
          data-clark-pop
          style={{ animation: "clarkPop .12s ease-out", [align === "end" ? "right" : "left"]: 0 }}
          className="absolute top-[calc(100%+6px)] z-[90] min-w-[184px] rounded-lg border border-border bg-card p-1 shadow-[0_0_36px_-12px_var(--accent-amber)]"
        >
          {items.map((it, i) =>
            it === "separator" ? (
              <div key={i} className="my-1 h-px bg-border" />
            ) : (
              <button
                key={i}
                type="button"
                role="menuitem"
                onClick={() => { it.onSelect?.(); setOpen(false) }}
                className={cn(
                  "flex w-full cursor-pointer items-center justify-between rounded-md px-3 py-1.5 text-left font-mono text-[12px] transition-colors",
                  it.danger
                    ? "text-accent-red hover:bg-accent-red/10"
                    : "text-muted-foreground hover:bg-accent-amber/10 hover:text-accent-amber"
                )}
              >
                <span>{it.label}</span>
                {it.shortcut && <span className="text-[10px] text-muted-foreground">{it.shortcut}</span>}
              </button>
            )
          )}
        </div>
      )}
    </div>
  )
}
