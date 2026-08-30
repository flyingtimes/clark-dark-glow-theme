"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type CarouselProps = {
  className?: string
  children: React.ReactNode
  /** 底部可点指示点（默认开）：滑动手/点击均可定位 */
  dots?: boolean
}

/**
 * 轮播：悬浮箭头 + 可点指示点内建，开箱即用无需消费者写控制逻辑。
 * 用法：<Carousel><CarouselItem>…</CarouselItem></Carousel>
 */
function Carousel({ className, children, dots = true }: CarouselProps) {
  const trackRef = React.useRef<HTMLDivElement>(null)
  const [active, setActive] = React.useState(0)
  const count = React.Children.count(children)

  const slideStep = () => {
    const track = trackRef.current
    const first = track?.children[0] as HTMLElement | undefined
    return first ? first.offsetWidth + 16 /* gap */ : 0
  }
  const scrollToIndex = (i: number) => {
    const step = slideStep()
    trackRef.current?.scrollTo({
      left: Math.max(0, Math.min(i, count - 1)) * step,
      behavior: "smooth",
    })
  }
  const onScroll = () => {
    const step = slideStep()
    if (!step) return
    setActive(Math.min(count - 1, Math.round(trackRef.current!.scrollLeft / step)))
  }
  const scroll = (dir: number) => scrollToIndex(active + dir)

  return (
    <div data-slot="carousel" aria-roledescription="carousel" className={cn("relative", className)}>
      <div
        ref={trackRef}
        onScroll={onScroll}
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
      {dots && count > 1 && (
        <div className="mt-3 flex justify-center gap-1.5" role="tablist" aria-label="轮播位置">
          {Array.from({ length: count }, (_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`第 ${i + 1} 张`}
              aria-current={i === active}
              onClick={() => scrollToIndex(i)}
              className={cn(
                "h-1.5 cursor-pointer rounded-full transition-all duration-200",
                i === active
                  ? "w-5 bg-accent-amber shadow-[0_0_8px_var(--accent-amber)]"
                  : "w-1.5 bg-border hover:bg-muted-foreground"
              )}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function CarouselItem({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="carousel-item" className={cn("min-w-[280px] snap-start", className)} {...props} />
}

export { Carousel, CarouselItem }
