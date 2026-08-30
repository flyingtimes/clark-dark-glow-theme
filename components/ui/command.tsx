"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useFocusTrap } from "@/hooks/use-focus-trap"

export type CommandItem = { label: string; hint?: string; onSelect?: () => void }

type CommandProps = {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  items: CommandItem[]
  placeholder?: string
  onSelect?: (item: CommandItem) => void
  className?: string
}

/**
 * ⌘K 命令面板：输入过滤 + ↑↓ 选择（到顶/底轻推反馈）+ Enter 执行。
 * 受控（open+onOpenChange）或非受控（defaultOpen）皆可；焦点自动进输入框、关闭自动还原。
 */
export function Command({
  open: controlled, defaultOpen = false, onOpenChange, items,
  placeholder = "输入命令或搜索…", onSelect, className,
}: CommandProps) {
  const [internal, setInternal] = React.useState(defaultOpen)
  const open = controlled ?? internal
  const change = (o: boolean) => { setInternal(o); onOpenChange?.(o) }
  const panelRef = useFocusTrap<HTMLDivElement>(open, () => change(false))

  const [q, setQ] = React.useState("")
  const [idx, setIdx] = React.useState(0)
  const [nudge, setNudge] = React.useState<"top" | "bottom" | null>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const filtered = items.filter((it) => it.label.toLowerCase().includes(q.toLowerCase()))

  React.useEffect(() => {
    if (open) { setQ(""); setIdx(0); requestAnimationFrame(() => inputRef.current?.focus()) }
  }, [open])

  const move = (delta: number) => {
    setIdx((i) => {
      const next = i + delta
      if (next < 0) { setNudge("top"); setTimeout(() => setNudge(null), 180); return 0 }
      if (next > filtered.length - 1) { setNudge("bottom"); setTimeout(() => setNudge(null), 180); return filtered.length - 1 }
      return next
    })
  }

  if (!open) return null

  return (
    <div data-slot="command" className={cn("fixed inset-0 z-[130] flex items-start justify-center pt-[18vh]", className)}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" onClick={() => change(false)} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        className="relative w-[92vw] max-w-lg overflow-hidden rounded-xl border border-accent-amber/40 bg-card shadow-[0_0_60px_-18px_var(--accent-amber)]"
      >
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => { setQ(e.target.value); setIdx(0) }}
          onKeyDown={(e) => {
            if (e.key === "Escape") change(false)
            if (e.key === "ArrowDown") { e.preventDefault(); move(1) }
            if (e.key === "ArrowUp") { e.preventDefault(); move(-1) }
            if (e.key === "Enter" && filtered[idx]) { filtered[idx].onSelect?.(); onSelect?.(filtered[idx]); change(false) }
          }}
          placeholder={placeholder}
          className="h-12 w-full border-b border-border bg-transparent px-4 font-mono text-[13px] text-foreground outline-none placeholder:text-muted-foreground/60"
        />
        <style>{`@keyframes cmdkNudgeTop{30%{transform:translateY(4px)}}@keyframes cmdkNudgeBottom{30%{transform:translateY(-4px)}}`}</style>
        <div
          className={cn("max-h-72 overflow-y-auto p-1.5", nudge === "top" && "[animation:cmdkNudgeTop_.18s_ease]", nudge === "bottom" && "[animation:cmdkNudgeBottom_.18s_ease]")}
        >
          {filtered.length === 0 && <div className="px-3 py-6 text-center font-mono text-[12px] text-muted-foreground">无匹配结果</div>}
          {filtered.map((it, i) => (
            <button
              key={it.label}
              type="button"
              onMouseEnter={() => setIdx(i)}
              onClick={() => { it.onSelect?.(); onSelect?.(it); change(false) }}
              className={cn(
                "flex w-full cursor-pointer items-center justify-between rounded-md px-3 py-2 text-left font-mono text-[12px] transition-colors",
                i === idx ? "bg-accent-amber/12 text-accent-amber" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <span>{it.label}</span>
              {it.hint && <span className="text-[11px] text-muted-foreground">{it.hint}</span>}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 border-t border-border px-4 py-2 font-mono text-[11px] text-muted-foreground">
          <span>↑↓ 选择</span><span>⏎ 执行</span><span>esc 关闭</span>
        </div>
      </div>
    </div>
  )
}
