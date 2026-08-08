import AdminCrudPage from '../../components/AdminCrudPage'
import { getSkills, createSkill, updateSkill, deleteSkill, type Skill } from '../../lib/supabase'
import type { AdminColumn, AdminField } from '../../components/AdminCrudPage'

const skillFields: AdminField[] = [
  { key: 'name', label: 'Name', type: 'text', required: true, placeholder: 'Skill name' },
  {
    key: 'category',
    label: 'Category',
    type: 'text',
    required: true,
    placeholder: 'Frontend, Backend, Tools...',
  },
  {
    key: 'level',
    label: 'Level',
    type: 'number',
    required: true,
    description: 'Use a value from 0 to 100.',
    min: 0,
    max: 100,
    placeholder: '80',
  },
  { key: 'display_order', label: 'Display order', type: 'number', placeholder: '0' },
]

const skillColumns: AdminColumn<Skill>[] = [
  { key: 'name', label: 'Skill', className: 'admin-column-primary' },
  {
    key: 'category',
    label: 'Category',
    render: (skill) => <span className="admin-tag">{skill.category}</span>,
  },
  {
    key: 'level',
    label: 'Level',
    className: 'admin-column-level',
    title: (skill) => `${skill.level}%`,
    render: (skill) => {
      const level = Number(skill.level)
      const safeLevel = Number.isFinite(level) ? Math.min(100, Math.max(0, level)) : 0
      return (
        <div className="admin-level-indicator" aria-label={`${safeLevel} percent`}>
          <span className="admin-level-value">{safeLevel}%</span>
          <span className="admin-level-track" aria-hidden="true">
            <span className="admin-level-fill" style={{ width: `${safeLevel}%` }} />
          </span>
        </div>
      )
    },
  },
]

export default function AdminSkills() {
  return (
    <AdminCrudPage
      title="Skills"
      singularTitle="Skill"
      description="Organize skills by category and proficiency."
      fields={skillFields}
      columns={skillColumns}
      search={{ keys: ['name', 'category'], placeholder: 'Search skills...' }}
      filter={{ key: 'category', label: 'Category' }}
      pageSize={10}
      getItemLabel={(skill) => skill.name}
      getFn={getSkills}
      createFn={createSkill}
      updateFn={updateSkill}
      deleteFn={deleteSkill}
    />
  )
}
