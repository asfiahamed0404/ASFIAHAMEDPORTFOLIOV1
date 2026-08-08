import AdminCrudPage from '../../components/AdminCrudPage'
import {
  getExperience,
  createExperience,
  updateExperience,
  deleteExperience,
  type Experience,
} from '../../lib/supabase'
import type { AdminColumn, AdminField } from '../../components/AdminCrudPage'

const experienceFields: AdminField[] = [
  { key: 'title', label: 'Title', type: 'text', required: true, placeholder: 'Role or position' },
  {
    key: 'subtitle',
    label: 'Company or organization',
    type: 'text',
    required: true,
    placeholder: 'Company or organization',
  },
  { key: 'period', label: 'Period', type: 'text', required: true, placeholder: '2024 - Present' },
  {
    key: 'details',
    label: 'Details',
    type: 'array',
    required: true,
    arrayFormat: 'lines',
    description: 'Enter one responsibility or achievement per line.',
    placeholder: 'Add one detail per line',
    rows: 5,
    wide: true,
  },
  { key: 'display_order', label: 'Display order', type: 'number', placeholder: '0' },
]

const experienceColumns: AdminColumn<Experience>[] = [
  { key: 'title', label: 'Role', className: 'admin-column-primary' },
  { key: 'subtitle', label: 'Organization' },
  { key: 'period', label: 'Period', className: 'admin-column-period' },
]

export default function AdminExperience() {
  return (
    <AdminCrudPage
      title="Experience"
      singularTitle="Experience Entry"
      description="Maintain the professional experience timeline."
      fields={experienceFields}
      columns={experienceColumns}
      search={{ keys: ['title', 'subtitle', 'period', 'details'], placeholder: 'Search experience...' }}
      compact
      formDescription="Add the role, organization, period, and its key outcomes."
      getItemLabel={(experience) => experience.title}
      getFn={getExperience}
      createFn={createExperience}
      updateFn={updateExperience}
      deleteFn={deleteExperience}
    />
  )
}
