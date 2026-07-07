import { useState, useEffect, useCallback } from 'react'
import { getSiteContent, updateSiteContent } from '../../lib/supabase'
import type { SiteContent } from '../../lib/supabase'
import { toast } from 'sonner'

const fields = [
  { key: 'hero_title', label: 'Hero Title', type: 'text' },
  { key: 'hero_subtitle', label: 'Hero Subtitle (HTML)', type: 'textarea' },
  { key: 'hero_status', label: 'Hero Status', type: 'text' },
  { key: 'about_text', label: 'About Title (HTML)', type: 'textarea' },
  { key: 'about_paragraph1', label: 'About Paragraph 1 (HTML)', type: 'textarea' },
  { key: 'about_paragraph2', label: 'About Paragraph 2 (HTML)', type: 'textarea' },
  { key: 'about_paragraph3', label: 'About Paragraph 3 (HTML)', type: 'textarea' },
  { key: 'contact_intro', label: 'Contact Intro', type: 'text' },
  { key: 'footer_text', label: 'Footer Text', type: 'text' },
  { key: 'seo_title', label: 'SEO Title', type: 'text' },
  { key: 'seo_description', label: 'SEO Description', type: 'textarea' },
  { key: 'resume_url', label: 'Resume URL', type: 'text' },
]

export default function AdminSiteContent() {
  const [content, setContent] = useState<SiteContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getSiteContent()
      if (data) setContent(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content) return
    setSaving(true)
    try {
      await updateSiteContent(content)
      toast.success('Saved')
    } catch (err) {
      toast.error(`Failed to save: ${(err as Error).message}`)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="admin-loading">Loading site content...</div>

  if (error) {
    return (
      <div className="admin-page">
        <div className="admin-page-header">
          <div>
            <p className="admin-kicker">Homepage copy</p>
            <h1 className="admin-page-title">Site Content</h1>
          </div>
        </div>
        <div className="admin-error-panel">
          <p className="text-red-300 mb-3">Failed to load site content</p>
          <p className="text-sm mb-5 text-[#d4d4d8]">{error}</p>
          <button type="button" onClick={load} className="admin-primary-action">
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
          <p className="admin-kicker">Homepage copy</p>
          <h1 className="admin-page-title">Site Content</h1>
        </div>
      </div>

      <div className="admin-content-panel">
        <form onSubmit={handleSave} className="admin-form-grid admin-form-wide">
          {fields.map((field) => (
            <div key={field.key} className="admin-field">
              <label className="admin-field-label">
                {field.label}
              </label>
              {field.type === 'textarea' ? (
                <textarea
                  className="admin-textarea"
                  rows={4}
                  value={content?.[field.key as keyof SiteContent] as string || ''}
                  onChange={(e) =>
                    setContent((prev) =>
                      prev ? { ...prev, [field.key]: e.target.value } : null
                    )
                  }
                />
              ) : (
                <input
                  type="text"
                  className="admin-input"
                  value={content?.[field.key as keyof SiteContent] as string || ''}
                  onChange={(e) =>
                    setContent((prev) =>
                      prev ? { ...prev, [field.key]: e.target.value } : null
                    )
                  }
                />
              )}
            </div>
          ))}
          <div className="admin-actions">
            <button type="submit" disabled={saving || !content} className="admin-btn admin-btn-primary">
              {saving && <span className="spinner" aria-hidden="true" />}
              <span>{saving ? 'Saving...' : 'Save changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
