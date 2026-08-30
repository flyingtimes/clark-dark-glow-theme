"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export type MenuDef = { label: string; items: React.ReactNode[] }

/** 菜单栏：横向排列，同一时间只开一个菜单，开启状态下悬停即切换 */
export function Menubar({ menus, className }: { menus: MenuDef[]; className?: string }) {
  const [open, setOpen] = React.useState<number | null>(null)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (open === null) return
    const onDown = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(null) }
    document.addEventListener("mousedown", onDown)
    return () => document.removeEventListener("mousedown", onDown)
  }, [open])

  return (
    <div
      ref={ref}
      data-slot="menubar"
      className={cn("inline-flex items-center gap-1 rounded-lg border border-border bg-card p-1", className)}
    >
      {menus.map((m, i) => (
        <div key={m.label} className="relative" onMouseEnter={() => open !== null && setOpen(i)}>
          <button
            type="button"
            aria-expanded={open === i}
            onClick={() => setOpen(open === i ? null : i)}
            className={cn(
              "cursor-pointer rounded-md px-3 py-1.5 font-mono text-[12px] transition-colors",
              open === i ? "bg-accent-amber/12 text-accent-amber" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {m.label}
          </button>
          {open === i && (
            <div className="absolute left-0 top-[calc(100%+6px)] z-[90] min-w-[176px] rounded-lg border border-border bg-card p-1 shadow-[0_0_36px_-12px_var(--accent-amber)]">
              {m.items}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
