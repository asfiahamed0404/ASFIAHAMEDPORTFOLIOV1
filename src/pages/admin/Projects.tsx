import AdminCrudPage from '../../components/AdminCrudPage'
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  type Project,
} from '../../lib/supabase'
import type { AdminColumn, AdminField } from '../../components/AdminCrudPage'

const projectFields: AdminField[] = [
  {
    key: 'title',
    label: 'Title',
    type: 'text',
    required: true,
    section: 'Project details',
    placeholder: 'Project title',
  },
  {
    key: 'year',
    label: 'Year',
    type: 'text',
    required: true,
    section: 'Project details',
    placeholder: '2026',
  },
  {
    key: 'highlight',
    label: 'Highlight tag',
    type: 'text',
    section: 'Project details',
    placeholder: 'Featured',
  },
  {
    key: 'display_order',
    label: 'Display order',
    type: 'number',
    section: 'Project details',
    placeholder: '0',
  },
  {
    key: 'description',
    label: 'Description',
    type: 'textarea',
    required: true,
    section: 'Story and technology',
    rows: 5,
    wide: true,
    placeholder: 'Describe the project and its outcome',
  },
  {
    key: 'tech',
    label: 'Tech stack',
    type: 'array',
    required: true,
    section: 'Story and technology',
    description: 'Separate technologies with commas.',
    placeholder: 'React, TypeScript, Supabase',
    wide: true,
  },
  {
    key: 'github',
    label: 'GitHub URL',
    type: 'text',
    section: 'Links and media',
    placeholder: 'https://github.com/...',
  },
  {
    key: 'demo',
    label: 'Demo URL',
    type: 'text',
    section: 'Links and media',
    placeholder: 'https://...',
  },
  {
    key: 'live_website',
    label: 'Live website URL',
    type: 'text',
    section: 'Links and media',
    placeholder: 'https://...',
  },
  {
    key: 'image_url',
    label: 'Image URL',
    type: 'text',
    section: 'Links and media',
    placeholder: 'https://...',
  },
]

const projectColumns: AdminColumn<Project>[] = [
  { key: 'title', label: 'Project', className: 'admin-column-primary' },
  { key: 'year', label: 'Year', className: 'admin-column-year' },
  {
    key: 'highlight',
    label: 'Highlight',
    className: 'admin-column-highlight',
    render: (project) =>
      project.highlight ? (
        <span className="admin-tag admin-tag-accent">{project.highlight}</span>
      ) : (
        <span className="admin-cell-muted">{'\u2014'}</span>
      ),
  },
]

export default function AdminProjects() {
  return (
    <AdminCrudPage
      title="Projects"
      singularTitle="Project"
      description="Manage the work featured across the portfolio."
      fields={projectFields}
      columns={projectColumns}
      search={{
        keys: ['title', 'year', 'description', 'tech', 'highlight'],
        placeholder: 'Search projects...',
      }}
      pageSize={10}
      formSize="lg"
      formDescription="Keep the summary concise, then add the relevant links and media."
      getItemLabel={(project) => project.title}
      getFn={getProjects}
      createFn={createProject}
      updateFn={updateProject}
      deleteFn={deleteProject}
    />
  )
}
