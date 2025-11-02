import * as React from "react"

import { cn } from "@/lib/utils"

type SizeVariant = "sm" | "md" | "lg" | "xl"

type InputProps = React.ComponentProps<"input"> & {
  sizeVariant?: SizeVariant
}

const sizeClasses: Record<SizeVariant, string> = {
  sm: "h-9 py-1 text-sm",
  md: "h-10 py-2 text-base",
  lg: "h-11 py-3 text-base",
  xl: "h-12 py-3 text-lg",
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, sizeVariant = "md", ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        data-slot="input"
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input w-full min-w-0 rounded-md border bg-transparent px-3 shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          sizeClasses[sizeVariant],
          className
        )}
        {...props}
      />
    )
  }
)

Input.displayName = "Input"

export { Input }
