import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md font-mono text-[12px] uppercase tracking-wider " +
    "transition-all duration-200 outline-none disabled:pointer-events-none disabled:opacity-50 " +
    "focus-visible:ring-2 focus-visible:ring-accent-amber/50 [&_svg]:size-3.5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "border border-accent-amber/50 bg-accent-amber/12 text-accent-amber shadow-[0_0_18px_-8px_var(--accent-amber)] hover:bg-accent-amber/20 hover:shadow-[0_0_28px_-8px_var(--accent-amber)]",
        outline:
          "border border-border text-foreground hover:border-accent-amber/50 hover:text-accent-amber hover:shadow-[0_0_20px_-8px_var(--accent-amber)]",
        ghost: "text-muted-foreground hover:bg-accent-amber/8 hover:text-accent-amber",
        danger:
          "border border-accent-red/50 bg-accent-red/10 text-accent-red shadow-[0_0_18px_-8px_var(--accent-red)] hover:bg-accent-red/20",
      },
      size: {
        sm: "h-7 px-2.5",
        default: "h-9 px-4",
        lg: "h-11 px-6 text-[13px]",
        icon: "size-9",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
)

function Button({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants>) {
  return (
    <button
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { Button, buttonVariants }
