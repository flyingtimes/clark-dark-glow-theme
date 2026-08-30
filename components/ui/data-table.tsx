"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type Column<T> = {
  key: keyof T & string
  label: string
  align?: "left" | "right"
  /** 提供后按该值排序（用于格式化显示的数值列），缺省用单元格原值 */
  sortValue?: (row: T) => number | string
}
type DataTableProps<T extends Record<string, any>> = {
  columns: Column<T>[]
  rows: T[]
  className?: string
}

/** 可排序数据表：点击表头切换升/降序；数字列按数值比较；aria-sort 标注当前排序列 */
function DataTable<T extends Record<string, any>>({ columns, rows, className }: DataTableProps<T>) {
  const [sort, setSort] = React.useState<{ key: string; dir: 1 | -1 } | null>(null)

  const sorted = React.useMemo(() => {
    if (!sort) return rows
    const col = columns.find((c) => c.key === sort.key)
    if (!col) return rows
    const get = (r: T) => (col.sortValue ? col.sortValue(r) : r[sort.key])
    return [...rows].sort((a, b) => {
      const x = get(a), y = get(b)
      const c = typeof x === "number" && typeof y === "number" ? x - y : String(x).localeCompare(String(y))
      return c * sort.dir
    })
  }, [rows, sort, columns])

  const toggle = (key: string) =>
    setSort((s) => (s?.key === key ? { key, dir: s.dir === 1 ? -1 : 1 } : { key, dir: 1 }))

  return (
    <div data-slot="data-table" className={cn("w-full overflow-x-auto rounded-lg border border-border bg-card", className)}>
      <table className="w-full font-mono text-[12px]">
        <thead>
          <tr className="border-b border-border">
            {columns.map((c) => {
              const sortedCol = sort?.key === c.key
              return (
                <th
                  key={c.key}
                  aria-sort={sortedCol ? (sort!.dir === 1 ? "ascending" : "descending") : undefined}
                  style={{ textAlign: c.align ?? "left" }}
                >
                  <button
                    type="button"
                    onClick={() => toggle(c.key)}
                    className="flex w-full cursor-pointer items-center gap-1 px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground transition-colors hover:text-accent-amber"
                    style={{ justifyContent: c.align === "right" ? "flex-end" : "flex-start" }}
                  >
                    {c.label}
                    {/* 仅当前排序列显示方向箭头 */}
                    {sortedCol && <span className="text-[9px] text-accent-amber">{sort!.dir === 1 ? "▲" : "▼"}</span>}
                  </button>
                </th>
              )
            })}
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
