import { useState, useCallback, useEffect } from 'react'
import { Plus, Pencil, Trash, Upload, ImageIcon, X } from 'lucide-react'
import { toast } from 'sonner'
import { supabase } from '../../lib/supabase'
import type { Certificate } from '../../lib/supabase'

const certificateFields = [
  { key: 'name', label: 'Name', type: 'text', required: true },
  { key: 'issuer', label: 'Issuer', type: 'text', required: true },
  { key: 'display_order', label: 'Display Order', type: 'number' },
]

export default function AdminCertificates() {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editing, setEditing] = useState<Certificate | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .order('display_order', { ascending: true })
      if (error) throw error
      setCertificates(data || [])
      setLoading(false)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError(message)
      setLoading(false)
    }
  }, [])

// Upload image to Supabase Storage
   const uploadImage = async (file: File): Promise<string | null> => {
     try {
       const fileExt = file.name.split('.').pop()
       const fileName = `${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}.${fileExt}`
const { error } = await supabase.storage
          .from('certificate-images')
          .upload(fileName, file, {
            upsert: true,
            cacheControl: '3600',
            contentType: file.type,
          })
       if (error) throw error
       // Get public URL
       const { data: { publicUrl } } = supabase.storage
         .from('certificate-images')
         .getPublicUrl(fileName)
       return publicUrl
     } catch (err) {
       console.error('Error uploading image:', err)
       throw err
     }
    }

  // Delete image from Supabase Storage
  const deleteImageFromStorage = async (url: string) => {
    try {
      const segments = url.split('/')
      const fileName = segments[segments.length - 1]
      const { error } = await supabase.storage.from('certificate-images').remove([fileName])
      if (error) throw error
    } catch (err) {
      console.error('Error deleting image:', err)
      toast.error('Failed to delete image')
    }
  }

  const handleRemoveImage = async () => {
    if (editing?.image_url) {
      await deleteImageFromStorage(editing.image_url)
      setEditing(prev => {
        if (!prev) return prev
        return { ...prev, image_url: null }
      })
    }
    setImagePreview(null)
    setImageFile(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this certificate?')) return
    try {
      await supabase.from('certificates').delete().eq('id', id)
      toast.success('Certificate deleted')
      setCertificates(prev => prev.filter(cert => cert.id !== id))
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      toast.error(`Failed to delete: ${message}`)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (saving) return
    setSaving(true)
    try {
      let imageUrl = null
      if (imageFile) {
        imageUrl = await uploadImage(imageFile)
      }

const certificateData = {
         ...editing,
         name: editing?.name || '',
         issuer: editing?.issuer || '',
         display_order: editing?.display_order || 0,
         image_url: imageUrl ?? (editing?.image_url ?? null),
       }

      if (editing?.id) {
        const { data, error } = await supabase
          .from('certificates')
          .update(certificateData)
          .eq('id', editing.id)
          .select()
          .single()
        if (error) throw error
        toast.success('Certificate updated')
        setCertificates(prev =>
          prev.map(cert => (cert.id === editing!.id ? data : cert))
        )
      } else {
        const { data, error } = await supabase
          .from('certificates')
          .insert(certificateData)
          .select()
          .single()
        if (error) throw error
        toast.success('Certificate created')
        setCertificates(prev => [data, ...prev])
      }

      setIsFormOpen(false)
      setEditing(null)
      setImagePreview(null)
      setImageFile(null)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      toast.error(`Failed to save: ${message}`)
    } finally {
      setSaving(false)
    }
  }

  // Handle image change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    acceptFile(file)
  }

  const acceptFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }
    setImageFile(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    e.stopPropagation()
    e.currentTarget.classList.add('cert-upload--dragover')
  }

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    e.stopPropagation()
    e.currentTarget.classList.remove('cert-upload--dragover')
  }

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    e.stopPropagation()
    e.currentTarget.classList.remove('cert-upload--dragover')
    const file = e.dataTransfer.files?.[0]
    if (file) acceptFile(file)
  }

  // Handle form input change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setEditing(prev => {
      if (!prev) return { name: '', issuer: '', display_order: 0 } as Certificate
      return { ...prev, [name]: value === '' ? null : value }
    })
  }

  // Handle form submit
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSave(e)
  }

  // Load initial data
  useEffect(() => {
    load()
  }, [load])

  if (loading) return <div className="text-white">Loading...</div>

if (error) {
  return (
    <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-gray-800 text-white rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-white text-2xl">Certificates</h1>
        <button
          onClick={() => {
            setEditing(null)
            setIsFormOpen(true)
          }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded flex items-center gap-2"
        >
          <Plus size={16} /> Add
        </button>
      </div>
      <div className="bg-red-900/20 border border-red-800 rounded-3xl p-8 text-center">
        <p className="text-red-400 mb-4">Failed to load certificates</p>
        <p className="text-gray-300 text-sm mb-4">{error}</p>
        <button onClick={load} className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded mt-2">
          Retry
        </button>
      </div>
    </div>
  )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-white text-2xl">Certificates</h1>
        <button
          onClick={() => {
            setEditing(null)
            setIsFormOpen(true)
          }}
          className="btn-primary px-4 py-2 rounded-xl flex items-center gap-2"
        >
          <Plus size={16} /> Add
        </button>
      </div>

      <div className="bg-[#1a1a2e] border border-gray-600 rounded-3xl overflow-hidden shadow-md">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#2c2c3a] text-white">
            <tr>
              {certificateFields
                .filter(f => f.type !== 'textarea')
                .slice(0, 2)
                .map(col => (
                  <th key={col.key} className="p-4 font-medium">
                    {col.label}
                  </th>
                ))}
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {certificates.map(cert => (
              <tr
                key={cert.id}
                className="border-t border-[#27272a] hover:bg-[#18181b]"
              >
{certificateFields
                   .filter(f => f.type !== 'textarea')
                   .slice(0, 2)
                   .map(col => (
                     <td key={col.key} className="p-4">
                       {String((cert as any)[col.key] || '')}
                     </td>
                   ))}
                <td className="p-4 flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setEditing(cert)
                      setIsFormOpen(true)
                      // Set image preview if exists
                      if (cert.image_url) {
                        setImagePreview(cert.image_url)
                        setImageFile(null)
                      } else {
                        setImagePreview(null)
                        setImageFile(null)
                      }
                    }}
                    className="p-2 rounded-lg hover:bg-[#27272a] transition-colors"
                  >
                    <Pencil size={16} className="text-white" />
                  </button>
                  <button
                    onClick={() => handleDelete(cert.id)}
                    className="p-2 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {certificates.length === 0 && (
              <tr>
                <td
                  colSpan={certificateFields.filter(f => f.type !== 'textarea').slice(0, 2).length + 1}
                  className="p-8 text-center text-[#71717a]"
                >
                  No certificates found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 border border-white rounded-3xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl text-white">
            <h2 className="text-white text-xl mb-6">
              {editing ? 'Edit' : 'Add'} Certificate
            </h2>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm text-white mb-2">
                  Name
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  className="form-input w-full rounded-2xl px-4 h-12 bg-white/10 border border-white focus:ring-2 focus:ring-white focus:border-white text-white placeholder-gray-300"
                  value={editing?.name || ''}
                  onChange={handleInputChange}
                />
              </div>
              {/* Issuer */}
              <div>
                <label className="block text-sm text-white mb-2">
                  Issuer
                </label>
                <input
                  name="issuer"
                  type="text"
                  required
                  className="form-input w-full rounded-2xl px-4 h-12 bg-white/10 border border-white focus:ring-2 focus:ring-white focus:border-white text-white placeholder-gray-300"
                  value={editing?.issuer || ''}
                  onChange={handleInputChange}
                />
              </div>
              {/* Display Order */}
              <div>
                <label className="block text-sm text-white mb-2">
                  Display Order
                </label>
                <input
                  name="display_order"
                  type="number"
                  className="form-input w-full rounded-2xl px-4 h-12 bg-white/10 border border-white focus:ring-2 focus:ring-white focus:border-white text-white placeholder-gray-300"
                  value={editing?.display_order?.toString() || ''}
                  onChange={handleInputChange}
                />
              </div>
              {/* Image Upload */}
              <div>
                <label className="block text-sm text-white mb-2">
                  Certificate Image (PNG, JPG, WEBP, GIF)
                </label>
                {imagePreview ? (
                  <div className="cert-upload cert-upload--filled group">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="cert-upload-preview"
                    />
                    <div className="cert-upload-actions">
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="cert-upload-remove"
                        aria-label="Remove image"
                      >
                        <X size={14} />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <label
                    className="cert-upload cert-upload--empty group"
                    onDragOver={handleDragOver}
                    onDragEnter={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/webp, image/gif"
                      className="sr-only"
                      onChange={handleImageChange}
                    />
                    <div className="cert-upload-icon">
                      <ImageIcon size={22} className="text-[#a5b4fc]" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="cert-upload-title">Click or drag to upload</span>
                      <span className="cert-upload-sub">PNG, JPG, WEBP or GIF — up to ~5MB</span>
                    </div>
                    <span className="cert-upload-cta">
                      <Upload size={13} />
                      Browse
                    </span>
                  </label>
                )}
              </div>
              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => {
                    setIsFormOpen(false)
                    setEditing(null)
                    setImagePreview(null)
                    setImageFile(null)
                  }}
                  className="px-6 py-2 rounded-xl border border-white text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary px-6 py-2 rounded-xl inline-flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {saving && <span className="spinner" aria-hidden="true" />}
                  <span>{saving ? 'Saving…' : editing ? 'Update' : 'Add'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}