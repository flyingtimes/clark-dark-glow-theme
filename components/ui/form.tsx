import * as React from "react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

/** 表单字段组合：标签 + 控件 + 描述 / 错误（error 优先展示） */
function FormField({
  label, htmlFor, description, error, children, className,
}: {
  label: React.ReactNode
  htmlFor?: string
  description?: React.ReactNode
  error?: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  return (
    <div data-slot="form-field" className={cn("space-y-1.5", className)}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error ? (
        <p data-slot="form-error" className="font-mono text-[11px] text-accent-red">{error}</p>
      ) : description ? (
        <p data-slot="form-description" className="text-[11px] leading-relaxed text-muted-foreground">{description}</p>
      ) : null}
    </div>
  )
}

export { FormField }
