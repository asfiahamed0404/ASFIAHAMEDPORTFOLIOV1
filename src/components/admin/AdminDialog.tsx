import { useEffect, useEffectEvent, useId, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

interface AdminDialogProps {
  open: boolean
  title: string
  description?: string
  children: ReactNode
  onClose: () => void
  closeLabel?: string
  size?: 'sm' | 'md' | 'lg'
  preventClose?: boolean
}

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

export default function AdminDialog({
  open,
  title,
  description,
  children,
  onClose,
  closeLabel = 'Close dialog',
  size = 'md',
  preventClose = false,
}: AdminDialogProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const descriptionId = useId()
  const requestClose = useEffectEvent(() => {
    if (!preventClose) onClose()
  })

  useEffect(() => {
    if (!open) return

    const previousFocus = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const focusTimer = window.setTimeout(() => {
      const preferred = panelRef.current?.querySelector<HTMLElement>('[data-autofocus]')
      const firstFocusable = panelRef.current?.querySelector<HTMLElement>(focusableSelector)
      ;(preferred ?? firstFocusable ?? panelRef.current)?.focus()
    }, 0)

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        requestClose()
        return
      }

      if (event.key !== 'Tab' || !panelRef.current) return
      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(focusableSelector),
      ).filter((element) => !element.hasAttribute('disabled'))

      if (focusable.length === 0) {
        event.preventDefault()
        panelRef.current.focus()
        return
      }

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      window.clearTimeout(focusTimer)
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
      previousFocus?.focus()
    }
  }, [open])

  if (!open) return null

  return createPortal(
    <div
      className="admin-modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !preventClose) onClose()
      }}
    >
      <div
        ref={panelRef}
        className={`admin-modal-panel admin-modal-panel-${size}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
      >
        <div className="admin-modal-header">
          <div>
            <h2 id={titleId} className="admin-modal-title">{title}</h2>
            {description && (
              <p id={descriptionId} className="admin-modal-description">{description}</p>
            )}
          </div>
          <button
            type="button"
            className="admin-dialog-close"
            onClick={onClose}
            disabled={preventClose}
            aria-label={closeLabel}
          >
            <X size={17} aria-hidden="true" />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  )
}
