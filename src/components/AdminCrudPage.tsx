import { useState, useEffect, useCallback } from 'react'
import { Plus, Pencil, Trash } from 'lucide-react'
import { toast } from 'sonner'

export interface AdminField {
  key: string
  label: string
  type: 'text' | 'textarea' | 'number' | 'array'
  required?: boolean
}

interface AdminCrudPageProps {
  title: string
  singularTitle?: string
  fields: AdminField[]
  getFn: () => Promise<any[]>
  createFn: (data: any) => Promise<any>
  updateFn: (id: string, data: any) => Promise<any>
  deleteFn: (id: string) => Promise<void>
  idKey?: string
}

export default function AdminCrudPage({
  title,
  singularTitle,
  fields,
  getFn,
  createFn,
  updateFn,
  deleteFn,
  idKey = 'id',
}: AdminCrudPageProps) {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editing, setEditing] = useState<Record<string, any>>({})
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getFn()
      setItems(data || [])
      setLoading(false)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError(message)
      setLoading(false)
    }
  }, [getFn])

  useEffect(() => {
    load()
  }, [load])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return
    try {
      await deleteFn(id)
      toast.success('Deleted')
      setItems((prev) => prev.filter((i) => i[idKey] !== id))
    } catch (err) {
      toast.error(`Failed to delete: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (saving) return
    setSaving(true)
    try {
      const id = editing[idKey]
      if (id) {
        await updateFn(id, editing)
        toast.success('Updated')
      } else {
        await createFn(editing)
        toast.success('Created')
      }
      setIsFormOpen(false)
      setEditing({})
      load()
    } catch (err) {
      toast.error(`Failed to save: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setSaving(false)
    }
  }

  const displayColumns = fields.filter((f) => f.type !== 'textarea').slice(0, 2)
  const singular = singularTitle ?? (title.endsWith('s') ? title.slice(0, -1) : title)

  if (loading) return <div className="admin-loading">Loading {title.toLowerCase()}...</div>

  if (error) {
    return (
      <div className="admin-page">
        <div className="admin-page-header">
          <div>
            <p className="admin-kicker">Content manager</p>
            <h1 className="admin-page-title">{title}</h1>
          </div>
        </div>
        <div className="admin-error-panel">
          <p className="text-red-300 mb-3">Failed to load {title.toLowerCase()}</p>
          <p className="text-sm mb-5 text-[#d4d4d8]">{error}</p>
          <button onClick={load} className="admin-primary-action">
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <p className="admin-kicker">Content manager</p>
          <h1 className="admin-page-title">{title}</h1>
        </div>
        <button
          onClick={() => {
            setEditing({})
            setIsFormOpen(true)
          }}
          className="admin-primary-action"
        >
          <Plus size={16} /> Add {singular}
        </button>
      </div>

      <div className="admin-table-shell">
        <table className="admin-table">
          <thead>
            <tr>
              {displayColumns.map((col) => (
                <th key={col.key}>
                  {col.label}
                </th>
              ))}
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item[idKey]}>
                {displayColumns.map((col) => (
                  <td key={col.key}>
                    {Array.isArray(item[col.key])
                      ? item[col.key].join(', ')
                      : String(item[col.key] || '')}
                  </td>
                ))}
                <td>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => {
                        setEditing(item)
                        setIsFormOpen(true)
                      }}
                      className="admin-icon-button"
                      aria-label={`Edit ${singular}`}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(item[idKey])}
                      className="admin-icon-button admin-icon-button-danger"
                      aria-label={`Delete ${singular}`}
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td
                  colSpan={displayColumns.length + 1}
                  className="admin-empty-cell"
                >
                  No items found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isFormOpen && (
        <div className="admin-modal-backdrop" onClick={() => !saving && setIsFormOpen(false)}>
          <div
            className="admin-modal-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="admin-modal-title">
              {editing[idKey] ? `Edit ${singular}` : `Add ${singular}`}
            </h2>
            <form onSubmit={handleSave} className="admin-form-grid">
              {fields.map((field) => (
                <div key={field.key} className="admin-field">
                  <label className="admin-field-label">{field.label}</label>
                  {field.type === 'textarea' ? (
                    <textarea
                      required={field.required}
                      className="admin-textarea"
                      rows={4}
                      placeholder={field.label}
                      value={editing[field.key] || ''}
                      onChange={(e) =>
                        setEditing((prev) => ({
                          ...prev,
                          [field.key]: e.target.value,
                        }))
                      }
                    />
                  ) : field.type === 'array' ? (
                    <input
                      type="text"
                      required={field.required}
                      placeholder="Comma separated"
                      className="admin-input"
                      value={
                        Array.isArray(editing[field.key])
                          ? editing[field.key].join(', ')
                          : editing[field.key] || ''
                      }
                      onChange={(e) =>
                        setEditing((prev) => ({
                          ...prev,
                          [field.key]: e.target.value
                            .split(',')
                            .map((s: string) => s.trim())
                            .filter((s: string) => s.length > 0),
                        }))
                      }
                    />
                  ) : (
                    <input
                      type={field.type === 'number' ? 'number' : 'text'}
                      required={field.required}
                      placeholder={field.label}
                      className="admin-input"
                      value={editing[field.key] || ''}
                      onChange={(e) =>
                        setEditing((prev) => ({
                          ...prev,
                          [field.key]: e.target.value,
                        }))
                      }
                    />
                  )}
                </div>
              ))}
              <div className="admin-actions">
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => setIsFormOpen(false)}
                  className="admin-btn admin-btn-ghost"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="admin-btn admin-btn-primary"
                >
                  {saving && <span className="spinner" aria-hidden="true" />}
                  <span>{saving ? 'Saving...' : 'Save'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
