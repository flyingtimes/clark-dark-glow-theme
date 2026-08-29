import * as React from "react"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"

type GlowCardProps = React.ComponentProps<typeof Card> & {
  /** 辉光颜色：任意 CSS 颜色，推荐传主题 token，如 "var(--accent-teal)" */
  glow?: string
  /** 辉光强度 0–1.5，等比放大扩散半径，默认 1 */
  intensity?: number
  /** hover 时增强辉光，默认开启 */
  glowOnHover?: boolean
  /** 描边也染上辉光色（默认是 白→边框色 的中性渐变描边） */
  tintBorder?: boolean
}

/**
 * GlowCard — 外层 1px 渐变描边 + box-shadow 环境辉光，内层是标准 shadcn Card。
 * 依赖：npx shadcn@latest add card（以及 lib/utils 的 cn）。
 * 主题 token：--radius / --card / --border / --accent-*（见 globals.css）。
 *
 * 用法：
 *   <GlowCard glow="var(--accent-teal)" intensity={1.2}>
 *     <CardHeader>…</CardHeader>
 *     <CardContent>…</CardContent>
 *   </GlowCard>
 */
export function GlowCard({
  glow = "var(--accent-amber, oklch(0.8 0.15 75))",
  intensity = 1,
  glowOnHover = true,
  tintBorder = false,
  className,
  children,
  ...props
}: GlowCardProps) {
  return (
    <div
      className={cn(
        "group/glow relative rounded-xl p-px",
        "shadow-[0_0_calc(48px*var(--gi,1))_-14px_color-mix(in_oklab,var(--glow)_75%,transparent)]",
        glowOnHover &&
          "transition-shadow duration-300 hover:shadow-[0_0_calc(64px*var(--gi,1))_-12px_var(--glow)]",
        tintBorder
          ? "[background-image:linear-gradient(to_bottom,color-mix(in_oklab,var(--glow)_50%,transparent),transparent_75%)]"
          : "bg-gradient-to-b from-white/10 via-border to-transparent",
        className
      )}
      style={
        {
          "--glow": glow,
          "--gi": intensity,
        } as React.CSSProperties
      }
      {...props}
    >
      <Card className="relative overflow-hidden rounded-[calc(var(--radius)-1px)] border-0 bg-card">
        {/* 顶缘高光线，模拟玻璃卡上沿反光 */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
        />
        {children}
      </Card>
    </div>
  )
}
