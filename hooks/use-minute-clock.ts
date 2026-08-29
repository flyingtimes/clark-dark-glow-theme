"use client"

import { useEffect, useRef, useState } from "react"

type Options = {
  /** 转一整圈（60 分钟）的真实时长；视频标注 “ONE REVOLUTION = ONE HOUR · 7.5” → 默认 7500ms */
  periodMs?: number
  paused?: boolean
}

/**
 * 连续分钟时钟：rAF 驱动，返回**小数分钟**（指针平滑扫动、刻度逐段点亮）。
 * set() 供进度条 scrub：从该分钟起继续走。
 */
export function useMinuteClock({ periodMs = 7500, paused = false }: Options = {}) {
  const [minute, setMinute] = useState(0)
  const offsetRef = useRef(0)
  const startRef = useRef<number | null>(null)

  useEffect(() => {
    if (paused) return
    let raf = 0
    const tick = (now: number) => {
      if (startRef.current == null) startRef.current = now
      const m = (((offsetRef.current + ((now - startRef.current) / periodMs) * 60) % 60) + 60) % 60
      offsetRef.current = m
      setMinute(m)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      startRef.current = null
    }
  }, [periodMs, paused])

  const set = (m: number) => {
    const v = (((m % 60) + 60) % 60)
    offsetRef.current = v
    startRef.current = null
    setMinute(v)
  }

  return [minute, set] as const
}
