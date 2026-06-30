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
  fields: AdminField[]
  getFn: () => Promise<any[]>
  createFn: (data: any) => Promise<any>
  updateFn: (id: string, data: any) => Promise<any>
  deleteFn: (id: string) => Promise<void>
  idKey?: string
}

export default function AdminCrudPage({
  title,
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
    }
  }

  const displayColumns = fields.filter((f) => f.type !== 'textarea').slice(0, 2)

  if (loading) return <div className="text-white">Loading...</div>

  if (error) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-white text-2xl">{title}</h1>
          <button
            onClick={() => {
              setEditing({})
              setIsFormOpen(true)
            }}
            className="btn-primary px-4 py-2 rounded-xl flex items-center gap-2"
          >
            <Plus size={16} /> Add
          </button>
        </div>
        <div className="bg-red-900/20 border border-red-800 rounded-3xl p-8 text-center">
          <p className="text-red-400 mb-4">Failed to load {title.toLowerCase()}</p>
          <p className="text-white text-sm mb-4">{error}</p>
          <button onClick={load} className="btn-primary px-4 py-2 rounded-xl">
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-white text-2xl">{title}</h1>
        <button
          onClick={() => {
            setEditing({})
            setIsFormOpen(true)
          }}
          className="btn-primary px-4 py-2 rounded-xl flex items-center gap-2"
        >
          <Plus size={16} /> Add
        </button>
      </div>

      <div className="bg-[#1a1a2e] border border-gray-600 rounded-3xl overflow-hidden shadow-md">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#18181b] text-white">
            <tr>
              {displayColumns.map((col) => (
                <th key={col.key} className="p-4 font-medium">
                  {col.label}
                </th>
              ))}
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item[idKey]}
                className="border-t border-[#27272a] hover:bg-[#18181b]"
              >
                {displayColumns.map((col) => (
                  <td key={col.key} className="p-4">
                    {Array.isArray(item[col.key])
                      ? item[col.key].join(', ')
                      : String(item[col.key] || '')}
                  </td>
                ))}
                <td className="p-4 flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setEditing(item)
                      setIsFormOpen(true)
                    }}
                    className="p-2 rounded-lg hover:bg-[#27272a] transition-colors"
                  >
                    <Pencil size={16} className="text-white" />
                  </button>
                  <button
                    onClick={() => handleDelete(item[idKey])}
                    className="p-2 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td
                  colSpan={displayColumns.length + 1}
                  className="p-8 text-center text-gray-300"
                >
                  No items found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 border border-white rounded-3xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl text-white">
            <h2 className="text-white text-xl mb-6">
              {editing[idKey] ? 'Edit' : 'Add'} {title.slice(0, -1)}
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              {fields.map((field) => (
                <div key={field.key}>
                  <label className="block text-sm text-white mb-2">
                    {field.label}
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea
                      required={field.required}
                      className="form-input w-full rounded-2xl px-4 py-3 bg-white/10 border border-white focus:ring-2 focus:ring-white focus:border-white text-black placeholder-gray-500 resize-none"
                      rows={4}
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
                      className="form-input w-full rounded-2xl px-4 h-12 bg-white/10 border border-white focus:ring-2 focus:ring-white focus:border-white text-black placeholder-gray-500"
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
                      className="form-input w-full rounded-2xl px-4 h-12 bg-white/10 border border-white focus:ring-2 focus:ring-white focus:border-white text-black placeholder-gray-500"
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
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-6 py-2 rounded-xl border border-white text-white hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary px-6 py-2 rounded-xl">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}