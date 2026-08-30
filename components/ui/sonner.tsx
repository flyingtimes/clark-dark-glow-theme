"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type ToastItem = {
  id: number
  title: React.ReactNode
  description?: React.ReactNode
  tone?: "amber" | "teal" | "red" | "green"
}
type Listener = (t: ToastItem) => void

const listeners = new Set<Listener>()
let seq = 0

/** 全局命令式调用：toast("已保存") / toast("出错了", { tone: "red" }) */
export function toast(title: React.ReactNode, opts?: { description?: React.ReactNode; tone?: ToastItem["tone"] }) {
  const item: ToastItem = { id: ++seq, title, description: opts?.description, tone: opts?.tone }
  listeners.forEach((l) => l(item))
}

type ToasterProps = { position?: "bottom-right" | "top-right" }

/** 挂载一次的通知栈：右下角堆叠，3.5s 自动消失 */
function Toaster({ position = "bottom-right" }: ToasterProps) {
  const [items, setItems] = React.useState<ToastItem[]>([])

  React.useEffect(() => {
    const listener: Listener = (t) => {
      setItems((prev) => [...prev, t])
      setTimeout(() => setItems((prev) => prev.filter((x) => x.id !== t.id)), 3500)
    }
    listeners.add(listener)
    return () => { listeners.delete(listener) }
  }, [])

  const toneCls: Record<string, string> = {
    amber: "border-l-accent-amber shadow-[0_0_30px_-12px_var(--accent-amber)]",
    teal: "border-l-accent-teal shadow-[0_0_30px_-12px_var(--accent-teal)]",
    red: "border-l-accent-red shadow-[0_0_30px_-12px_var(--accent-red)]",
    green: "border-l-accent-green shadow-[0_0_30px_-12px_var(--accent-green)]",
  }
  const posCls = position === "top-right" ? "top-6 right-6" : "bottom-6 right-6"

  return (
    <div
      data-slot="toaster"
      aria-live="polite"
      className={cn("pointer-events-none fixed z-[140] flex w-80 flex-col gap-2.5", posCls)}
    >
      {items.map((t) => (
        <div
          key={t.id}
          className={cn(
            "pointer-events-auto rounded-lg border border-border border-l-2 bg-card p-3.5",
            toneCls[t.tone ?? "amber"]
          )}
        >
          <div className="font-mono text-[12px] font-bold">{t.title}</div>
          {t.description && <div className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{t.description}</div>}
        </div>
      ))}
    </div>
  )
}

export { toast, Toaster }
