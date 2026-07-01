import { motion } from 'framer-motion'

const orbs = [
  {
    size: 520,
    x: '-10%',
    y: '8%',
    duration: 22,
    delay: 0,
    color: 'rgba(99, 102, 241, 0.18)',
  },
  {
    size: 420,
    x: '70%',
    y: '24%',
    duration: 28,
    delay: -6,
    color: 'rgba(168, 85, 247, 0.16)',
  },
  {
    size: 600,
    x: '40%',
    y: '62%',
    duration: 32,
    delay: -10,
    color: 'rgba(236, 72, 153, 0.12)',
  },
  {
    size: 360,
    x: '5%',
    y: '78%',
    duration: 26,
    delay: -14,
    color: 'rgba(56, 189, 248, 0.12)',
  },
]

export default function AmbientOrbs() {
  return (
    <div className="ambient-orbs" aria-hidden="true">
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="orb"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            background: `radial-gradient(circle at center, ${orb.color} 0%, transparent 65%)`,
          }}
          animate={{
            x: [0, 60, -40, 0],
            y: [0, -50, 30, 0],
            scale: [1, 1.08, 0.96, 1],
          }}
          transition={{
            duration: orb.duration,
            delay: orb.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}
