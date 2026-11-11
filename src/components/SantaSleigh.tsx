import { motion, useReducedMotion } from 'framer-motion'

const flightPath = {
  left: ['112%', '88%', '62%', '36%', '10%', '-18%'],
  top: ['35%', '29%', '25%', '28%', '34%', '39%'],
  scale: [0.72, 0.94, 1.02, 1.02, 0.94, 0.72],
  rotate: [0, -3, 0, 2, 3, 0],
  opacity: [0, 1, 1, 1, 1, 0],
}

function Reindeer({ x }: { x: number }) {
  return (
    <g transform={`translate(${x + 53} 8) scale(-1 1)`}>
      <ellipse cx="22" cy="43" rx="18" ry="10" fill="#8a512f" />
      <ellipse cx="27" cy="41" rx="8" ry="6" fill="#b8794a" />
      <path d="M35 42 39 29 32 23 25 31 16 42" fill="#9d6038" />
      <path d="M39 31 43 21 38 17 33 22 35 33" fill="#a96c41" />
      <ellipse cx="37" cy="18" rx="8" ry="6" fill="#a96c41" />
      <path d="M43 17q8-2 10 2l-5 4-8-1" fill="#d49a71" />
      <path d="m50 18 3 1-3 2" fill="#39241d" />
      <circle cx="39" cy="16" r="1.15" fill="#211714" />
      <path d="m34 13-5-4 1 7m4-4-1-6-4-4m3 5-5-1m6 0 3-5m-2 8 4-5 1-6m-2 5 5-2" fill="none" stroke="#e5c38e" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      <path d="M35 16 29 14 26 19" fill="#c88a5b" />
      <path d="M12 41 10 54l-3 7m12-17-1 12 3 6m13-17 2 11-2 7m-5-21 7 11 1 8" fill="none" stroke="#70452d" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
      <path d="m4 61 5 0m11 1 5 0m10 0 4 0m-18-1 5 0" fill="none" stroke="#29221e" strokeLinecap="round" strokeWidth="3" />
      <path d="M28 34q5 4 11 1" fill="none" stroke="#c84240" strokeWidth="3" />
      <circle cx="30" cy="36" r="1.5" fill="#e7c77f" />
    </g>
  )
}

export default function SantaSleigh() {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      aria-hidden="true"
      className="santa-flight"
      initial={{ left: '112%', top: '35%', opacity: 0 }}
      animate={reduceMotion ? { left: '77%', top: '25%', opacity: 1 } : flightPath}
      transition={reduceMotion ? { duration: 0 } : { duration: 7, repeat: Infinity, repeatDelay: 3, ease: 'easeInOut' }}
    >
      <svg className="santa-sleigh" viewBox="0 0 260 82" role="presentation">
        <path d="M8 49q36-5 75 0t47 0" fill="none" stroke="#d7b76e" strokeDasharray="3 4" strokeWidth="1.5" />
        <Reindeer x={3} />
        <Reindeer x={54} />
        <path d="M98 46q9 0 13 6" fill="none" stroke="#d7b76e" strokeWidth="1.5" />
        <path d="M127 49q8 12 26 12h42q-3 9-16 10h-34q-16-2-22-12" fill="#a92b38" stroke="#e2bb70" strokeLinejoin="round" strokeWidth="2" />
        <path d="M127 49h58l-5 9h-47z" fill="#d64748" />
        <path d="M127 72q28 7 59 0" fill="none" stroke="#e7c77f" strokeLinecap="round" strokeWidth="2" />
        <path d="M141 49q2-16 17-17 13 1 15 17" fill="#b92f3b" />
        <path d="M142 46q5 7 14 7 10 0 16-7l1 7q-6 8-17 8-9 0-14-6z" fill="#fff1df" />
        <circle cx="159" cy="30" r="10" fill="#f2c49b" />
        <path d="M149 28q1-14 14-13 10 1 9 10l-8-4q-5 6-15 7" fill="#c4313c" />
        <path d="M152 17q8-10 18-2l-1 5q-8-4-16 1z" fill="#f8eee0" />
        <circle cx="170" cy="15" r="3" fill="#f8eee0" />
        <circle cx="162" cy="29" r="1.2" fill="#402523" />
        <path d="M156 35q5 5 10 0" fill="none" stroke="#fff4e6" strokeLinecap="round" strokeWidth="3" />
        <path d="M144 51h32" stroke="#e5c276" strokeWidth="3" />
      </svg>
    </motion.div>
  )
}
