"use client"

import { cn } from "@/lib/utils"

interface MarqueeProps {
  children: React.ReactNode
  className?: string
  reverse?: boolean
  pauseOnHover?: boolean
  duration?: number
}

export function Marquee({
  children,
  className,
  reverse = false,
  pauseOnHover = true,
  duration = 35,
}: MarqueeProps) {
  return (
    <div
      className={cn("flex overflow-hidden", className)}
      style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}
    >
      {[0, 1].map((i) => (
        <div
          key={i}
          aria-hidden={i === 1}
          className={cn(
            "flex min-w-full shrink-0",
            reverse ? "[animation:var(--animate-marquee-reverse)]" : "[animation:var(--animate-marquee)]",
            pauseOnHover && "hover:[animation-play-state:paused]",
          )}
        >
          {children}
        </div>
      ))}
    </div>
  )
}
