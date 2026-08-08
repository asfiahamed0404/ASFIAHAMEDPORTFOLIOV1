import AdminCrudPage from '../../components/AdminCrudPage'
import {
  getEducation,
  createEducation,
  updateEducation,
  deleteEducation,
  type Education,
} from '../../lib/supabase'
import type { AdminColumn, AdminField } from '../../components/AdminCrudPage'

const educationFields: AdminField[] = [
  { key: 'title', label: 'Title', type: 'text', required: true, placeholder: 'Qualification' },
  {
    key: 'subtitle',
    label: 'Institution',
    type: 'text',
    required: true,
    placeholder: 'School or institution',
  },
  { key: 'period', label: 'Period', type: 'text', required: true, placeholder: '2022 - 2026' },
  {
    key: 'details',
    label: 'Details',
    type: 'array',
    required: true,
    arrayFormat: 'lines',
    description: 'Enter one detail per line. Each line remains a separate list item.',
    placeholder: 'Add one detail per line',
    rows: 5,
    wide: true,
  },
  { key: 'display_order', label: 'Display order', type: 'number', placeholder: '0' },
]

const educationColumns: AdminColumn<Education>[] = [
  { key: 'title', label: 'Qualification', className: 'admin-column-primary' },
  { key: 'subtitle', label: 'Institution' },
  { key: 'period', label: 'Period', className: 'admin-column-period' },
]

export default function AdminEducation() {
  return (
    <AdminCrudPage
      title="Education"
      singularTitle="Education Entry"
      description="Maintain the education timeline shown on the portfolio."
      fields={educationFields}
      columns={educationColumns}
      search={{ keys: ['title', 'subtitle', 'period', 'details'], placeholder: 'Search education...' }}
      compact
      formDescription="Add the qualification, institution, period, and its key details."
      getItemLabel={(education) => education.title}
      getFn={getEducation}
      createFn={createEducation}
      updateFn={updateEducation}
      deleteFn={deleteEducation}
    />
  )
}
