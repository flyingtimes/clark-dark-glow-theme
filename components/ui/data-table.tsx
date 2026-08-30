"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type Column<T> = { key: keyof T & string; label: string; align?: "left" | "right" }
type DataTableProps<T extends Record<string, any>> = {
  columns: Column<T>[]
  rows: T[]
  className?: string
}

/** 可排序数据表：点击表头切换升/降序，数字按数值比较 */
function DataTable<T extends Record<string, any>>({ columns, rows, className }: DataTableProps<T>) {
  const [sort, setSort] = React.useState<{ key: string; dir: 1 | -1 } | null>(null)
  const sorted = React.useMemo(() => {
    if (!sort) return rows
    return [...rows].sort((a, b) => {
      const x = a[sort.key], y = b[sort.key]
      const c = typeof x === "number" && typeof y === "number" ? x - y : String(x).localeCompare(String(y))
      return c * sort.dir
    })
  }, [rows, sort])
  const toggle = (key: string) =>
    setSort((s) => (s?.key === key ? { key, dir: s.dir === 1 ? -1 : 1 } : { key, dir: 1 }))

  return (
    <div data-slot="data-table" className={cn("w-full overflow-x-auto rounded-lg border border-border bg-card", className)}>
      <table className="w-full font-mono text-[12px]">
        <thead>
          <tr className="border-b border-border">
            {columns.map((c) => (
              <th key={c.key} style={{ textAlign: c.align ?? "left" }}>
                <button
                  type="button"
                  onClick={() => toggle(c.key)}
                  className="flex w-full cursor-pointer items-center gap-1 px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground transition-colors hover:text-accent-amber"
                  style={{ justifyContent: c.align === "right" ? "flex-end" : "flex-start" }}
                >
                  {c.label}
                  <span className="text-[9px]">{sort?.key === c.key ? (sort.dir === 1 ? "▲" : "▼") : "↕"}</span>
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row, i) => (
            <tr key={i} className="border-b border-border/50 transition-colors last:border-0 hover:bg-accent-amber/5">
              {columns.map((c) => (
                <td key={c.key} style={{ textAlign: c.align ?? "left" }} className="px-3 py-2">{row[c.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export { DataTable }
