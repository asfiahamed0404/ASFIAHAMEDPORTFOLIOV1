import { ChevronLeft, ChevronRight } from 'lucide-react'

interface AdminPaginationProps {
  page: number
  pageSize: number
  totalItems: number
  onPageChange: (page: number) => void
}

export default function AdminPagination({
  page,
  pageSize,
  totalItems,
  onPageChange,
}: AdminPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const start = totalItems === 0 ? 0 : (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, totalItems)

  return (
    <div className="admin-pagination" aria-label="Table pagination">
      <p className="admin-pagination-summary" aria-live="polite">
        Showing <strong>{start}–{end}</strong> of <strong>{totalItems}</strong>
      </p>
      <div className="admin-pagination-controls">
        <button
          type="button"
          className="admin-pagination-button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} aria-hidden="true" />
        </button>
        <span className="admin-pagination-page">
          {page} / {totalPages}
        </span>
        <button
          type="button"
          className="admin-pagination-button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Next page"
        >
          <ChevronRight size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
