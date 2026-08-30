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

const MAX_VISIBLE = 3

/** 单条通知：hover 暂停倒计时、✕ 手动关闭 */
function ToastCard({ t, onClose }: { t: ToastItem; onClose: () => void }) {
  const timer = React.useRef<number | undefined>(undefined)
  const start = () => { timer.current = window.setTimeout(onClose, 3500) }
  React.useEffect(() => { start(); return () => window.clearTimeout(timer.current) }, [])
  const pause = () => window.clearTimeout(timer.current)
  const resume = () => start()

  const toneCls: Record<string, string> = {
    amber: "border-l-accent-amber shadow-[0_0_30px_-12px_var(--accent-amber)]",
    teal: "border-l-accent-teal shadow-[0_0_30px_-12px_var(--accent-teal)]",
    red: "border-l-accent-red shadow-[0_0_30px_-12px_var(--accent-red)]",
    green: "border-l-accent-green shadow-[0_0_30px_-12px_var(--accent-green)]",
  }
  return (
    <div
      onMouseEnter={pause}
      onMouseLeave={resume}
      className={cn(
        "pointer-events-auto relative rounded-lg border border-border border-l-2 bg-card p-3.5 pr-8",
        toneCls[t.tone ?? "amber"]
      )}
    >
      <div className="font-mono text-[12px] font-bold">{t.title}</div>
      {t.description && <div className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{t.description}</div>}
      <button
        type="button"
        aria-label="关闭通知"
        onClick={onClose}
        className="absolute right-2 top-2 cursor-pointer rounded px-1 font-mono text-[11px] text-muted-foreground transition-colors hover:text-foreground"
      >
        ✕
      </button>
    </div>
  )
}

/** 挂载一次的通知栈：右下角堆叠，同屏最多 3 条（旧的挤出），3.5s 自动消失，hover 暂停 */
function Toaster({ position = "bottom-right" }: ToasterProps) {
  const [items, setItems] = React.useState<ToastItem[]>([])

  React.useEffect(() => {
    const listener: Listener = (t) => {
      setItems((prev) => [...prev, t].slice(-MAX_VISIBLE))
    }
    listeners.add(listener)
    return () => { listeners.delete(listener) }
  }, [])

  const close = (id: number) => setItems((prev) => prev.filter((x) => x.id !== id))
  const posCls = position === "top-right" ? "top-6 right-6" : "bottom-6 right-6"

  return (
    <div
      data-slot="toaster"
      aria-live="polite"
      className={cn("pointer-events-none fixed z-[140] flex w-80 flex-col gap-2.5", posCls)}
    >
      {items.map((t) => (
        <ToastCard key={t.id} t={t} onClose={() => close(t.id)} />
      ))}
    </div>
  )
}

type ToasterProps = { position?: "bottom-right" | "top-right" }

export { toast, Toaster }
