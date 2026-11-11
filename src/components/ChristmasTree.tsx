import type { CSSProperties } from 'react'

const lightPositions = [
  [42, 24], [56, 27], [35, 38], [65, 41], [28, 54], [72, 57],
  [38, 67], [62, 70], [47, 46], [54, 57], [45, 80], [57, 84],
]

interface ChristmasTreeProps {
  placed: number[]
  lit: boolean
  interactive?: boolean
  onPlace?: (index: number) => void
}

export default function ChristmasTree({ placed, lit, interactive = false, onPlace }: ChristmasTreeProps) {
  return (
    <div className={`tree-scene${lit ? ' tree-scene--lit' : ''}`} aria-label="CSS-drawn Christmas tree">
      <div className={`tree-star${lit ? ' tree-star--glow' : ''}`} aria-label={lit ? 'Glowing star' : 'Unlit star'}>★</div>
      <div className="tree-top" />
      <div className="tree-middle" />
      <div className="tree-bottom" />
      <div className="tree-trunk" />
      <div className="tree-lights" aria-hidden="true">
        {lightPositions.map(([left, top], index) => (
          <span
            className={`tree-light tree-light--${index % 4}${lit ? ' tree-light--on' : ''}`}
            key={`${left}-${top}`}
            style={{ left: `${left}%`, top: `${top}%` }}
          />
        ))}
      </div>
      {Array.from({ length: 6 }, (_, index) => {
        const coordinates = [
          { left: '50%', top: '30%' },
          { left: '38%', top: '43%' },
          { left: '62%', top: '49%' },
          { left: '31%', top: '62%' },
          { left: '69%', top: '67%' },
          { left: '50%', top: '76%' },
        ][index]
        const ornamentStyle = coordinates as CSSProperties
        return (
          <button
            aria-label={placed.includes(index) ? `Ornament ${index + 1} placed` : `Empty ornament hook ${index + 1}`}
            className={`tree-ornament tree-ornament--${index}${placed.includes(index) ? ' tree-ornament--placed' : ''}`}
            disabled={!interactive || placed.includes(index)}
            key={index}
            onClick={() => onPlace?.(index)}
            style={ornamentStyle}
            type="button"
          >
            {placed.includes(index) ? <span className={`ornament-ball ornament-ball--${index}`} /> : <span className="ornament-hook" />}
          </button>
        )
      })}
      <div className="tree-skirt" />
      <div className="tree-gifts" aria-hidden="true">
        <span className="mini-gift mini-gift--red" />
        <span className="mini-gift mini-gift--gold" />
        <span className="mini-gift mini-gift--green" />
      </div>
    </div>
  )
}
