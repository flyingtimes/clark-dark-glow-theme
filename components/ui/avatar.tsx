import * as React from "react"
import { cn } from "@/lib/utils"

type AvatarProps = React.ComponentProps<"span"> & {
  src?: string
  alt?: string
  /** 无图时的文字回退（通常 1–2 字） */
  fallback?: React.ReactNode
  /** 主色（CSS 颜色 / 主题 token），描边与底色自动衍生 */
  tone?: string
  size?: number
}

function Avatar({ src, alt, fallback, tone = "var(--accent-amber)", size = 40, className, ...props }: AvatarProps) {
  return (
    <span
      data-slot="avatar"
      style={{
        width: size, height: size,
        borderColor: `color-mix(in oklab, ${tone} 55%, transparent)`,
        background: `color-mix(in oklab, ${tone} 14%, transparent)`,
      }}
      className={cn(
        "relative inline-grid shrink-0 place-items-center overflow-hidden rounded-full border",
        "font-mono font-bold", className
      )}
      {...props}
    >
      <span style={{ color: tone, fontSize: size * 0.36 }}>{fallback}</span>
      {src && <img src={src} alt={alt ?? ""} className="absolute inset-0 h-full w-full object-cover" />}
    </span>
  )
}

export { Avatar }
