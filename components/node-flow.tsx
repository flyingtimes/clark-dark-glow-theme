import * as React from "react"
import { cn } from "@/lib/utils"

export type FlowPulse = {
  /** 光点沿其流动的 SVG path */
  path: string
  /** 一圈时长（秒） */
  dur?: number
  /** 起始延迟（秒），用于错峰多光点 */
  delay?: number
  /** 光点半径 */
  r?: number
}

export type FlowNode = { x: number; y: number; r?: number; opacity?: number }

export type NodeFlowProps = React.ComponentProps<"svg"> & {
  /** 静态描边集合（管网） */
  edges: string[]
  /** 沿路径流动的光点 */
  pulses?: FlowPulse[]
  /** 端点/分叉节点圆点 */
  nodes?: FlowNode[]
  /** 颜色由父级 color/currentColor 控制，如 className="text-accent-teal" */
}

/** 零依赖：流动效果用 SVG 原生 <animateMotion> 实现 */
export function NodeFlow({ edges, pulses = [], nodes = [], viewBox = "0 0 260 84", className, ...props }: NodeFlowProps) {
  return (
    <svg viewBox={viewBox} className={cn("h-[88px] w-full [filter:drop-shadow(0_0_0_transparent)]", className)} {...props}>
      {edges.map((d, i) => (
        <path key={`e${i}`} d={d} fill="none" stroke="currentColor" strokeOpacity={0.26} strokeWidth={1.5} />
      ))}
      {nodes.map((n, i) => (
        <circle key={`n${i}`} cx={n.x} cy={n.y} r={n.r ?? 3.5} fill="currentColor" opacity={n.opacity ?? 0.55} />
      ))}
      {pulses.map((p, i) => (
        <circle
          key={`p${i}`}
          r={p.r ?? 2.6}
          fill="currentColor"
          className="[filter:drop-shadow(0_0_4px_currentColor)]"
        >
          <animateMotion dur={`${p.dur ?? 2.4}s`} begin={`${p.delay ?? 0}s`} repeatCount="indefinite" path={p.path} />
        </circle>
      ))}
    </svg>
  )
}
