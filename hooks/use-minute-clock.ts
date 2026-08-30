"use client"

import { useEffect, useRef, useState } from "react"

type Options = {
  /** 转一整圈（60 分钟）的真实时长；默认 60s，可选 30s / 10s */
  periodMs?: number
  paused?: boolean
}

/**
 * 连续分钟时钟：rAF 驱动，返回**小数分钟**（指针平滑匀速扫动、刻度逐段点亮）。
 * set() 供进度条 scrub：从该分钟起继续走。
 */
export function useMinuteClock({ periodMs = 60000, paused = false }: Options = {}) {
  const [minute, setMinute] = useState(0)
  const offsetRef = useRef(0)
  const startRef = useRef<number | null>(null)
  const lastMRef = useRef(0)

  useEffect(() => {
    if (paused) return
    let raf = 0
    const tick = (now: number) => {
      if (startRef.current == null) startRef.current = now
      // offset 只作基准（scrub/暂停时重锚），绝不能每帧回写，否则会二次方加速
      const m = (((offsetRef.current + ((now - startRef.current) / periodMs) * 60) % 60) + 60) % 60
      lastMRef.current = m
      setMinute(m)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      startRef.current = null
      offsetRef.current = lastMRef.current
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
