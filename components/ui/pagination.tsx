"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type PaginationProps = {
  page: number
  total: number
  onChange?: (page: number) => void
  className?: string
}

function pageList(page: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const set = new Set<number>([1, 2, page - 1, page, page + 1, total - 1, total])
  const arr = [...set].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b)
  const out: (number | "…")[] = []
  arr.forEach((p, i) => {
    if (i && p - arr[i - 1] > 1) out.push("…")
    out.push(p)
  })
  return out
}

function Pagination({ page, total, onChange, className }: PaginationProps) {
  const go = (p: number) => onChange?.(Math.min(total, Math.max(1, p)))
  const itemCls = (active: boolean) =>
    cn(
      "grid h-8 min-w-8 cursor-pointer place-items-center rounded-md border px-2 font-mono text-[12px] transition-all duration-150",
      active
        ? "border-accent-amber/60 bg-accent-amber/12 text-accent-amber shadow-[0_0_14px_-6px_var(--accent-amber)]"
        : "border-border text-muted-foreground hover:border-accent-amber/40 hover:text-foreground"
    )
  return (
    <nav data-slot="pagination" className={cn("flex items-center gap-1.5", className)} aria-label="分页">
      <button type="button" className={itemCls(false)} disabled={page <= 1} style={{ opacity: page <= 1 ? 0.5 : 1 }}
        onClick={() => go(page - 1)} aria-label="上一页">‹</button>
      {pageList(page, total).map((p, i) =>
        p === "…" ? (
          <span key={`e${i}`} className="px-1 font-mono text-[12px] text-muted-foreground">…</span>
        ) : (
          <button key={p} type="button" className={itemCls(p === page)} onClick={() => go(p)}>{p}</button>
        )
      )}
      <button type="button" className={itemCls(false)} disabled={page >= total} style={{ opacity: page >= total ? 0.5 : 1 }}
        onClick={() => go(page + 1)} aria-label="下一页">›</button>
    </nav>
  )
}

export { Pagination }
