import * as React from "react"
import { cn } from "@/lib/utils"

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg"
  color?: "white" | "primary" | "current"
}

const LoadingSpinner = React.forwardRef<HTMLDivElement, LoadingSpinnerProps>(
  ({ className, size = "md", color = "current", ...props }, ref) => {
    const sizeClasses = {
      sm: "w-4 h-4",
      md: "w-5 h-5", 
      lg: "w-6 h-6"
    }

    const colorClasses = {
      white: "text-white",
      primary: "text-primary",
      current: "text-current"
    }

    return (
      <div
        ref={ref}
        className={cn(
          "animate-spin",
          sizeClasses[size],
          colorClasses[color],
          className
        )}
        {...props}
      >
        <svg
          className="w-full h-full"
          fill="none"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            fill="currentColor"
          />
        </svg>
      </div>
    )
  }
)

LoadingSpinner.displayName = "LoadingSpinner"

export { LoadingSpinner } 