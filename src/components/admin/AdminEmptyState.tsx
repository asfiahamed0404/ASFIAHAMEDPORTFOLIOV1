import { Inbox, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

interface AdminEmptyStateProps {
  title: string
  description?: string
  action?: ReactNode
  icon?: LucideIcon
  compact?: boolean
}

export default function AdminEmptyState({
  title,
  description,
  action,
  icon: Icon = Inbox,
  compact = false,
}: AdminEmptyStateProps) {
  return (
    <div className={`admin-empty-state${compact ? ' admin-empty-state-compact' : ''}`}>
      <span className="admin-empty-icon" aria-hidden="true">
        <Icon size={19} />
      </span>
      <div>
        <p className="admin-empty-title">{title}</p>
        {description && <p className="admin-empty-description">{description}</p>}
      </div>
      {action && <div className="admin-empty-action">{action}</div>}
    </div>
  )
}
