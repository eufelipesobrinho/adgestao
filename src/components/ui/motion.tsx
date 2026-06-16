import { motion, type HTMLMotionProps } from "framer-motion"
import { fadeInUp, staggerDelay } from "@/lib/motion"
import { cn } from "@/lib/utils"

interface FadeInProps extends HTMLMotionProps<"div"> {
  delay?: number
}

export function FadeIn({ children, className, delay = 0, ...props }: FadeInProps) {
  return (
    <motion.div
      initial={fadeInUp.initial}
      animate={fadeInUp.animate}
      transition={{ ...fadeInUp.transition, delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

interface AnimatedTableRowProps extends HTMLMotionProps<"tr"> {
  index: number
}

export function AnimatedTableRow({
  children,
  className,
  index,
  ...props
}: AnimatedTableRowProps) {
  return (
    <motion.tr
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: staggerDelay(index) }}
      className={cn(
        "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
        className
      )}
      {...props}
    >
      {children}
    </motion.tr>
  )
}
