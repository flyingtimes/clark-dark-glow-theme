"use client"

import * as React from "react"

type UseDiscloseOptions = {
  defaultOpen?: boolean
  /** 受控值（传入后内部状态失效） */
  open?: boolean
  onOpenChange?: (open: boolean) => void
  /** 点击外部是否关闭（默认 true） */
  closeOnOutside?: boolean
  /** Esc 是否关闭（默认 true） */
  closeOnEscape?: boolean
}

/**
 * 开合状态底座：下拉/气泡/菜单类组件的统一实现。
 * 返回的 ref 挂到组件根节点上，外点检测以此为准。
 * 支持 受控(open) / 非受控(defaultOpen) 两种用法。
 */
export function useDisclose(opts: UseDiscloseOptions = {}) {
  const { defaultOpen = false, open: controlled, onOpenChange, closeOnOutside = true, closeOnEscape = true } = opts
  const [internal, setInternal] = React.useState(defaultOpen)
  const ref = React.useRef<HTMLDivElement>(null)
  const open = controlled ?? internal

  const setOpen = React.useCallback(
    (v: boolean) => {
      if (controlled === undefined) setInternal(v)
      onOpenChange?.(v)
    },
    [controlled, onOpenChange]
  )
  const toggle = React.useCallback(() => setOpen(!open), [open, setOpen])

  React.useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent | TouchEvent) => {
      if (closeOnOutside && ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (closeOnEscape && e.key === "Escape") setOpen(false)
    }
    document.addEventListener("mousedown", onDown)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onDown)
      document.removeEventListener("keydown", onKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, closeOnOutside, closeOnEscape])

  return { ref, open, setOpen, toggle }
}
