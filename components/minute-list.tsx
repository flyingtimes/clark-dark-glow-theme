import { cn } from "@/lib/utils"

export type MinuteItem = {
  label: string
  /** 达到该分钟时点亮 */
  at: number
}

type MinuteListProps = {
  items: MinuteItem[]
  minute: number
  className?: string
}

/** 时序点亮清单：与 TheDial 共用同一个 minute state（单一数据源） */
export function MinuteList({ items, minute, className }: MinuteListProps) {
  return (
    <ul className={cn("flex flex-col gap-2", className)}>
      {items.map((it) => {
        const lit = minute >= it.at
        return (
          <li
            key={it.label}
            className={cn(
              "rounded-lg border px-3 py-2 text-sm transition-all duration-500",
              lit
                ? "border-accent-amber/60 bg-accent-amber/10 text-foreground shadow-[0_0_24px_-10px_var(--accent-amber)]"
                : "border-border text-muted-foreground"
            )}
          >
            {it.label}
          </li>
        )
      })}
    </ul>
  )
}
