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

/** 危险操作确认弹窗：红色辉光 + 遮罩（点击遮罩/Esc 取消） */
export function AlertDialog({
  open, onOpenChange, title, description, confirmText = "确认", cancelText = "取消", onConfirm, className,
}: AlertDialogProps) {
  React.useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onOpenChange(false) }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open, onOpenChange])
  if (!open) return null
  return (
    <div data-slot="alert-dialog" className="fixed inset-0 z-[120] grid place-items-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" onClick={() => onOpenChange(false)} />
      <div
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
