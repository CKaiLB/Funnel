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
    const callbackRef = React.useRef(onAnimationComplete)

    // Update ref when callback changes
    React.useEffect(() => {
      callbackRef.current = onAnimationComplete
    }, [onAnimationComplete])

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
        console.log("UnlockAnimation: Calling onAnimationComplete callback");
        try {
          callbackRef.current();
        } catch (error) {
          console.error("UnlockAnimation: Error calling onAnimationComplete:", error);
        }
      }, 3200)

      return () => {
        clearTimeout(timer1)
        clearTimeout(timer2)
        clearTimeout(timer3)
        clearTimeout(timer4)
      }
    }, []) // Empty dependency array - only run once on mount

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
            <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
              {animationPhase === 'lock' && "🔓 Unlocking Hidden Feature..."}
              {animationPhase === 'unlocking' && "✨ Discovering Secret Bonus..."}
              {animationPhase === 'unlocked' && "🎉 Hidden Feature Unlocked!"}
              {animationPhase === 'fade-out' && "🚀 You've Unlocked Something Special!"}
            </h2>
            <p className="text-blue-100 text-lg drop-shadow-md">
              {animationPhase === 'lock' && "Scanning for exclusive offers..."}
              {animationPhase === 'unlocking' && "Accessing your hidden bonus..."}
              {animationPhase === 'unlocked' && "🎁 FREE AI Consultation with Sweep Team!"}
              {animationPhase === 'fade-out' && "Get personalized AI strategy - 100% Free"}
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

          {/* Success checkmark and bonus reveal */}
          {animationPhase === 'unlocked' && (
            <div className="mt-6 space-y-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto animate-pulse">
                <div className="w-8 h-8 text-white">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4 border-2 border-white/30 animate-pulse">
                <p className="text-white font-semibold text-xl mb-1">🎯 Hidden Bonus Revealed!</p>
                <p className="text-blue-100 text-base">Free AI Consultation with Sweep Team</p>
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