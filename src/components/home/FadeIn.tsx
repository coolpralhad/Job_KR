"use client"
import { useSpring, useInView, animated } from "@react-spring/web"
import { ReactNode } from "react"

interface FadeInProps {
  children: ReactNode
  delay?: number
  direction?: "up" | "down" | "left" | "right" | "none"
  className?: string
  once?: boolean
}

const dirMap = {
  up:    { y:  28, x:  0 },
  down:  { y: -28, x:  0 },
  left:  { y:   0, x:  28 },
  right: { y:   0, x: -28 },
  none:  { y:   0, x:  0 },
}

export default function FadeIn({ children, delay = 0, direction = "up", className, once = true }: FadeInProps) {
  const [ref, inView] = useInView({ once })
  const { x, y } = dirMap[direction]

  const spring = useSpring({
    from: { opacity: 0, x, y },
    to: inView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x, y },
    delay: delay * 1000,
    config: { tension: 200, friction: 24 },
  })

  return (
    <animated.div
      ref={ref}
      className={className}
      style={{
        opacity:   spring.opacity,
        transform: direction === "left" || direction === "right"
          ? spring.x.to(xv => `translateX(${xv}px)`)
          : spring.y.to(yv => `translateY(${yv}px)`),
      }}
    >
      {children}
    </animated.div>
  )
}
