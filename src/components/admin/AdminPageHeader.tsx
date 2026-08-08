import type { ReactNode } from 'react'

interface AdminPageHeaderProps {
  title: string
  eyebrow?: string
  description?: string
  count?: number
  actions?: ReactNode
}

export default function AdminPageHeader({
  title,
  eyebrow,
  description,
  count,
  actions,
}: AdminPageHeaderProps) {
  return (
    <header className="admin-page-header">
      <div className="admin-page-heading">
        {eyebrow && <p className="admin-kicker">{eyebrow}</p>}
        <div className="admin-title-row">
          <h1 className="admin-page-title">{title}</h1>
          {typeof count === 'number' && (
            <span className="admin-record-count" aria-label={`${count} records`}>
              {count}
            </span>
          )}
        </div>
        {description && <p className="admin-page-description">{description}</p>}
      </div>
      {actions && <div className="admin-header-actions">{actions}</div>}
    </header>
  )
}
