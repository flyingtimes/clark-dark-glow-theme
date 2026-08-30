"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

function Carousel({ className, children }: { className?: string; children: React.ReactNode }) {
  const ref = React.useRef<HTMLDivElement>(null)
  const scroll = (dir: number) =>
    ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.8, behavior: "smooth" })
  return (
    <div data-slot="carousel" className={cn("relative", className)}>
      <div
        ref={ref}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto rounded-xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>
      <button
        type="button" aria-label="上一张" onClick={() => scroll(-1)}
        className="absolute left-2 top-1/2 z-10 grid size-9 -translate-y-1/2 cursor-pointer place-items-center rounded-full border border-accent-amber/40 bg-background/80 text-accent-amber shadow-[0_0_18px_-6px_var(--accent-amber)] transition-transform hover:scale-110"
      >‹</button>
      <button
        type="button" aria-label="下一张" onClick={() => scroll(1)}
        className="absolute right-2 top-1/2 z-10 grid size-9 -translate-y-1/2 cursor-pointer place-items-center rounded-full border border-accent-amber/40 bg-background/80 text-accent-amber shadow-[0_0_18px_-6px_var(--accent-amber)] transition-transform hover:scale-110"
      >›</button>
    </div>
  )
}

function CarouselItem({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="carousel-item" className={cn("min-w-[280px] snap-start", className)} {...props} />
}

export { Carousel, CarouselItem }
