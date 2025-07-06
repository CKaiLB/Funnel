import * as React from "react"
import { cn } from "@/lib/utils"

interface ConfettiPiece {
  id: number
  x: number
  y: number
  rotation: number
  scale: number
  color: string
  delay: number
}

interface ConfettiProps {
  onComplete?: () => void
  className?: string
}

const Confetti = React.forwardRef<HTMLDivElement, ConfettiProps>(
  ({ onComplete, className, ...props }, ref) => {
    const [pieces, setPieces] = React.useState<ConfettiPiece[]>([])
    const [isActive, setIsActive] = React.useState(false)

    const colors = [
      '#FF6B6B', // Red
      '#4ECDC4', // Teal
      '#45B7D1', // Blue
      '#96CEB4', // Green
      '#FFEAA7', // Yellow
      '#DDA0DD', // Plum
      '#98D8C8', // Mint
      '#F7DC6F', // Gold
    ]

    React.useEffect(() => {
      // Generate confetti pieces
      const newPieces: ConfettiPiece[] = Array.from({ length: 150 }, (_, i) => ({
        id: i,
        x: Math.random() * 100, // Random horizontal position
        y: -10 - Math.random() * 20, // Start above viewport
        rotation: Math.random() * 360, // Random rotation
        scale: 0.5 + Math.random() * 0.5, // Random scale
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 1000, // Random delay
      }))

      setPieces(newPieces)
      setIsActive(true)

      // Call onComplete after animation duration
      const timer = setTimeout(() => {
        setIsActive(false)
        onComplete?.()
      }, 4000)

      return () => clearTimeout(timer)
    }, [onComplete])

    if (!isActive) return null

    return (
      <div
        ref={ref}
        className={cn("fixed inset-0 pointer-events-none z-40", className)}
        {...props}
      >
        {pieces.map((piece) => (
          <div
            key={piece.id}
            className="absolute w-2 h-2 animate-confetti-fall"
            style={{
              left: `${piece.x}%`,
              top: `${piece.y}%`,
              transform: `rotate(${piece.rotation}deg) scale(${piece.scale})`,
              backgroundColor: piece.color,
              animationDelay: `${piece.delay}ms`,
              animationDuration: `${3000 + Math.random() * 2000}ms`,
            }}
          />
        ))}
      </div>
    )
  }
)

Confetti.displayName = "Confetti"

export { Confetti } 