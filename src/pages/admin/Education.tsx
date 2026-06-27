import AdminCrudPage from '../../components/AdminCrudPage'
import { getEducation, createEducation, updateEducation, deleteEducation } from '../../lib/supabase'
import type { AdminField } from '../../components/AdminCrudPage'

const educationFields: AdminField[] = [
  { key: 'title', label: 'Title', type: 'text', required: true },
  { key: 'subtitle', label: 'Subtitle (Institution)', type: 'text', required: true },
  { key: 'period', label: 'Period', type: 'text', required: true },
  { key: 'details', label: 'Details (comma separated)', type: 'array', required: true },
  { key: 'display_order', label: 'Display Order', type: 'number' },
]

export default function AdminEducation() {
  return (
    <AdminCrudPage
      title="Education"
      fields={educationFields}
      getFn={getEducation}
      createFn={createEducation}
      updateFn={updateEducation}
      deleteFn={deleteEducation}
    />
  )
}