import AdminCrudPage from '../../components/AdminCrudPage'
import { getSkills, createSkill, updateSkill, deleteSkill } from '../../lib/supabase'
import type { AdminField } from '../../components/AdminCrudPage'

const skillFields: AdminField[] = [
  { key: 'name', label: 'Name', type: 'text', required: true },
  { key: 'category', label: 'Category', type: 'text', required: true },
  { key: 'level', label: 'Level (0-100)', type: 'number', required: true },
  { key: 'display_order', label: 'Display Order', type: 'number' },
]

export default function AdminSkills() {
  return (
    <AdminCrudPage
      title="Skills"
      singularTitle="Skill"
      fields={skillFields}
      getFn={getSkills}
      createFn={createSkill}
      updateFn={updateSkill}
      deleteFn={deleteSkill}
    />
  )
}