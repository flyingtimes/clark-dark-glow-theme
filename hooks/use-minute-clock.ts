"use client"

import { useEffect, useState } from "react"

type Options = {
  /** 转完 60 分钟一圈的真实时长，默认 60s（每"分钟"1s） */
  periodMs?: number
  paused?: boolean
}

/**
 * 共享分钟时钟：页面里只调用一次，把返回的 minute 同时喂给 TheDial / MinuteList 等，
 * 所有联动 UI 天然同步（这就是视频里"指针扫到哪、清单亮到哪"的做法）。
 */
export function useMinuteClock({ periodMs = 60000, paused = false }: Options = {}) {
  const [minute, setMinute] = useState(0)
  useEffect(() => {
    if (paused) return
    const t = setInterval(() => setMinute((m) => (m + 1) % 60), periodMs / 60)
    return () => clearInterval(t)
  }, [periodMs, paused])
  return [minute, setMinute] as const
}
