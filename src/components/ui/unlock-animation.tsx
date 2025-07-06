import * as React from "react"
import { cn } from "@/lib/utils"
import { Lock, Unlock } from "lucide-react"

interface UnlockAnimationProps {
  onAnimationComplete: () => void
  className?: string
}

const UnlockAnimation = React.forwardRef<HTMLDivElement, UnlockAnimationProps>(
  ({ onAnimationComplete, className, ...props }, ref) => {
    const [animationPhase, setAnimationPhase] = React.useState<'lock' | 'unlocking' | 'unlocked' | 'fade-out'>('lock')

    React.useEffect(() => {
      // Start with lock visible
      const timer1 = setTimeout(() => {
        setAnimationPhase('unlocking')
      }, 500)

      // Show unlocking animation
      const timer2 = setTimeout(() => {
        setAnimationPhase('unlocked')
      }, 1500)

      // Start fade out
      const timer3 = setTimeout(() => {
        setAnimationPhase('fade-out')
      }, 2500)

      // Complete animation and call callback
      const timer4 = setTimeout(() => {
        onAnimationComplete()
      }, 3200)

      return () => {
        clearTimeout(timer1)
        clearTimeout(timer2)
        clearTimeout(timer3)
        clearTimeout(timer4)
      }
    }, [onAnimationComplete])

    return (
      <div
        ref={ref}
        className={cn(
          "fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700",
          animationPhase === 'fade-out' && "animate-fade-out",
          className
        )}
        {...props}
      >
        <div className="text-center">
          {/* Lock Icon */}
          <div className={cn(
            "mb-6 transition-all duration-700 ease-in-out",
            animationPhase === 'lock' && "scale-100 opacity-100",
            animationPhase === 'unlocking' && "scale-110 opacity-80 animate-bounce",
            animationPhase === 'unlocked' && "scale-90 opacity-60",
            animationPhase === 'fade-out' && "scale-75 opacity-0"
          )}>
            {animationPhase === 'unlocked' ? (
              <Unlock className="w-24 h-24 text-white animate-pulse" />
            ) : (
              <Lock className="w-24 h-24 text-white" />
            )}
          </div>

          {/* Text */}
          <div className={cn(
            "transition-all duration-500 ease-in-out",
            animationPhase === 'lock' && "opacity-100",
            animationPhase === 'unlocking' && "opacity-80",
            animationPhase === 'unlocked' && "opacity-60",
            animationPhase === 'fade-out' && "opacity-0"
          )}>
            <h2 className="text-3xl font-bold text-white mb-2">
              {animationPhase === 'lock' && "Unlocking Your Access..."}
              {animationPhase === 'unlocking' && "Almost There..."}
              {animationPhase === 'unlocked' && "Access Granted!"}
              {animationPhase === 'fade-out' && "Welcome!"}
            </h2>
            <p className="text-blue-100 text-lg">
              {animationPhase === 'lock' && "Preparing your exclusive consultation..."}
              {animationPhase === 'unlocking' && "Setting up your personalized strategy..."}
              {animationPhase === 'unlocked' && "Your free consultation is ready!"}
              {animationPhase === 'fade-out' && "Let's get started!"}
            </p>
          </div>

          {/* Loading dots */}
          {animationPhase === 'unlocking' && (
            <div className="flex justify-center space-x-2 mt-6">
              <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          )}

          {/* Success checkmark */}
          {animationPhase === 'unlocked' && (
            <div className="mt-6">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto animate-pulse">
                <div className="w-8 h-8 text-white">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }
)

UnlockAnimation.displayName = "UnlockAnimation"

export { UnlockAnimation } 