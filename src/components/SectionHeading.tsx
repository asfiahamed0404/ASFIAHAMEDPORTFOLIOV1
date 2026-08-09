import type { LucideIcon } from 'lucide-react'

interface SectionHeadingProps {
  id?: string
  eyebrow: string
  title: string
  subtitle?: string
  icon: LucideIcon
  align?: 'left' | 'center'
}

const SectionHeading = ({
  id,
  eyebrow,
  title,
  subtitle,
  icon: Icon,
  align = 'left',
}: SectionHeadingProps) => (
  <header id={id} className={`pp-section-heading ${align === 'center' ? 'pp-section-heading-center' : ''}`}>
    <p className="pp-eyebrow">
      <Icon size={15} aria-hidden="true" />
      {eyebrow}
    </p>
    <h2>{title}</h2>
    {subtitle && <p className="pp-section-description">{subtitle}</p>}
  </header>
)

export default SectionHeading
