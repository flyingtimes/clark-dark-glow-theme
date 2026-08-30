"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type AlertDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: React.ReactNode
  description?: React.ReactNode
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  className?: string
}

/** 危险操作确认弹窗：红色辉光 + 遮罩 + Tab 焦点陷阱 + 关闭后焦点还原 */
export function AlertDialog({
  open, onOpenChange, title, description, confirmText = "确认", cancelText = "取消", onConfirm, className,
}: AlertDialogProps) {
  const panelRef = React.useRef<HTMLDivElement>(null)
  const prevFocus = React.useRef<HTMLElement | null>(null)

  React.useEffect(() => {
    if (!open) return
    prevFocus.current = document.activeElement as HTMLElement
    const focusables = () =>
      panelRef.current
        ? Array.from(panelRef.current.querySelectorAll<HTMLElement>('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])')).filter((n) => !n.hasAttribute("disabled"))
        : []
    focusables()[0]?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onOpenChange(false); return }
      if (e.key !== "Tab") return
      const list = focusables()
      const first = list[0], last = list[list.length - 1]
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
    }
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("keydown", onKey)
      prevFocus.current?.focus()
    }
  }, [open, onOpenChange])

  if (!open) return null
  return (
    <div data-slot="alert-dialog" className="fixed inset-0 z-[120] grid place-items-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" onClick={() => onOpenChange(false)} />
      <div
        ref={panelRef}
        role="alertdialog"
        aria-modal="true"
        className={cn(
          "relative w-[92vw] max-w-md rounded-xl border border-accent-red/40 bg-card p-6",
          "shadow-[0_0_60px_-18px_var(--accent-red)]", className
        )}
      >
        <div className="font-mono text-[11px] uppercase tracking-wider text-accent-red">confirm required</div>
        <h3 className="mt-2 text-[15px] font-bold">{title}</h3>
        {description && <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">{description}</p>}
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>{cancelText}</Button>
          <Button variant="danger" size="sm" onClick={() => { onConfirm?.(); onOpenChange(false) }}>{confirmText}</Button>
        </div>
      </div>
    </div>
  )
}
