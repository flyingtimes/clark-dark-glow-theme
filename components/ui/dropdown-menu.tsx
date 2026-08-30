"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export type DropdownItem =
  | { label: string; onSelect?: () => void; danger?: boolean; shortcut?: string }
  | "separator"

/** 下拉菜单：点击触发，点外部/Esc 关闭 */
export function DropdownMenu({
  trigger, items, align = "start", className,
}: { trigger: React.ReactNode; items: DropdownItem[]; align?: "start" | "end"; className?: string }) {
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

  return (
    <div ref={ref} data-slot="dropdown-menu" className={cn("relative inline-block", className)}>
      <span onClick={() => setOpen(!open)} className="inline-flex cursor-pointer">{trigger}</span>
      {open && (
        <div
          role="menu"
          style={align === "end" ? { right: 0 } : { left: 0 }}
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
