import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import type { FC } from 'react'

interface SectionHeadingProps {
  id?: string
  eyebrow: string
  title: string
  subtitle?: string
  icon: LucideIcon
  align?: 'left' | 'center'
}

const SectionHeading: FC<SectionHeadingProps> = ({
  id,
  eyebrow,
  title,
  subtitle,
  icon: Icon,
  align = 'left',
}) => {
  const alignment = align === 'center' ? 'items-center text-center' : 'items-start text-left'
  return (
    <div id={id} className={`section-eyebrow-wrap flex flex-col gap-4 mb-10 ${alignment}`}>
      <div className="section-eyebrow relative inline-flex items-center gap-3 pl-1">
        <span className="section-eyebrow-bar" />
        <Icon className="text-[#818cf8]" size={18} />
        <span className="uppercase tracking-[3px] text-[11px] font-mono text-[#818cf8]">
          {eyebrow}
        </span>
      </div>
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        className="section-title text-white text-4xl md:text-5xl tracking-[-1.5px] leading-[1.05]"
      >
        <span className="title-gradient">{title}</span>
      </motion.h2>
      {subtitle && (
        <p className="max-w-xl text-[#a1a1aa] text-[15px] leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  )
}

export default SectionHeading
