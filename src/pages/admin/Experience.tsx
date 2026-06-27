import AdminCrudPage from '../../components/AdminCrudPage'
import { getExperience, createExperience, updateExperience, deleteExperience } from '../../lib/supabase'
import type { AdminField } from '../../components/AdminCrudPage'

const experienceFields: AdminField[] = [
  { key: 'title', label: 'Title', type: 'text', required: true },
  { key: 'subtitle', label: 'Subtitle (Company/Org)', type: 'text', required: true },
  { key: 'period', label: 'Period', type: 'text', required: true },
  { key: 'details', label: 'Details (comma separated)', type: 'array', required: true },
  { key: 'display_order', label: 'Display Order', type: 'number' },
]

export default function AdminExperience() {
  return (
    <AdminCrudPage
      title="Experience"
      fields={experienceFields}
      getFn={getExperience}
      createFn={createExperience}
      updateFn={updateExperience}
      deleteFn={deleteExperience}
    />
  )
}