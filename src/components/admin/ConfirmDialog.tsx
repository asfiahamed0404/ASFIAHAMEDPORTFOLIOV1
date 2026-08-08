import { AlertTriangle } from 'lucide-react'
import AdminDialog from './AdminDialog'

interface ConfirmDialogProps {
  open: boolean
  title: string
  description: string
  onCancel: () => void
  onConfirm: () => void
  confirming?: boolean
  confirmLabel?: string
}

export default function ConfirmDialog({
  open,
  title,
  description,
  onCancel,
  onConfirm,
  confirming = false,
  confirmLabel = 'Delete',
}: ConfirmDialogProps) {
  return (
    <AdminDialog
      open={open}
      title={title}
      description={description}
      onClose={onCancel}
      size="sm"
      preventClose={confirming}
    >
      <div className="admin-confirm-note">
        <AlertTriangle size={17} aria-hidden="true" />
        <span>This action cannot be undone.</span>
      </div>
      <div className="admin-dialog-actions">
        <button
          type="button"
          className="admin-btn admin-btn-ghost"
          onClick={onCancel}
          disabled={confirming}
          data-autofocus
        >
          Cancel
        </button>
        <button
          type="button"
          className="admin-btn admin-btn-danger"
          onClick={onConfirm}
          disabled={confirming}
        >
          {confirming && <span className="admin-spinner" aria-hidden="true" />}
          {confirming ? 'Deleting…' : confirmLabel}
        </button>
      </div>
    </AdminDialog>
  )
}
