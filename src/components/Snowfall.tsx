import { memo, type CSSProperties } from 'react'

interface SnowfallProps {
  intense?: boolean
}

const flakes = Array.from({ length: 48 }, (_, index) => ({
  left: `${(index * 37 + 11) % 100}%`,
  delay: `${-((index * 13) % 19)}s`,
  duration: `${12 + ((index * 7) % 14)}s`,
  size: `${2 + ((index * 11) % 5)}px`,
  drift: `${((index * 17) % 90) - 45}px`,
}))

function Snowfall({ intense = false }: SnowfallProps) {
  return (
    <div className={`snowfall${intense ? ' snowfall--intense' : ''}`} aria-hidden="true">
      {flakes.map((flake, index) => (
        <i
          className="snowflake"
          key={index}
          style={{
            left: flake.left,
            animationDelay: flake.delay,
            animationDuration: flake.duration,
            width: flake.size,
            height: flake.size,
            '--drift': flake.drift,
          } as CSSProperties}
        />
      ))}
    </div>
  )
}

export default memo(Snowfall)
