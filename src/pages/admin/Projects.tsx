import AdminCrudPage from '../../components/AdminCrudPage'
import { getProjects, createProject, updateProject, deleteProject } from '../../lib/supabase'
import type { AdminField } from '../../components/AdminCrudPage'

const projectFields: AdminField[] = [
  { key: 'title', label: 'Title', type: 'text', required: true },
  { key: 'year', label: 'Year', type: 'text', required: true },
  { key: 'description', label: 'Description', type: 'textarea', required: true },
  { key: 'tech', label: 'Tech Stack (comma separated)', type: 'array', required: true },
  { key: 'github', label: 'GitHub URL', type: 'text' },
  { key: 'demo', label: 'Demo URL', type: 'text' },
  { key: 'highlight', label: 'Highlight Tag', type: 'text' },
  { key: 'image_url', label: 'Image URL', type: 'text' },
  { key: 'display_order', label: 'Display Order', type: 'number' },
]

export default function AdminProjects() {
  return (
    <AdminCrudPage
      title="Projects"
      fields={projectFields}
      getFn={getProjects}
      createFn={createProject}
      updateFn={updateProject}
      deleteFn={deleteProject}
    />
  )
}