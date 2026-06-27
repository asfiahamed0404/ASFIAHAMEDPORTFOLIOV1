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
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    const data = await getSiteContent()
    if (data) setContent(data)
    setLoading(false)
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

  if (loading) return <div className="text-white">Loading...</div>

  return (
    <div>
      <h1 className="text-white text-2xl mb-6">Site Content</h1>
      <form onSubmit={handleSave} className="space-y-4 max-w-2xl">
        {fields.map((field) => (
          <div key={field.key}>
            <label className="block text-sm text-[#a1a1aa] mb-2">
              {field.label}
            </label>
            {field.type === 'textarea' ? (
              <textarea
                className="form-input w-full rounded-2xl px-4 py-3 resize-none"
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
                className="form-input w-full rounded-2xl px-4 h-12"
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
        <button type="submit" disabled={saving} className="btn-primary px-6 py-2 rounded-xl mt-4">
          {saving ? 'Saving...' : 'Save'}
        </button>
      </form>
    </div>
  )
}