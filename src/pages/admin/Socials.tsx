import AdminCrudPage from '../../components/AdminCrudPage'
import {
  getSocials,
  createSocials,
  updateSocials,
  deleteSocials,
  type Social,
} from '../../lib/supabase'
import type { AdminColumn, AdminField } from '../../components/AdminCrudPage'

const socialFields: AdminField[] = [
  { key: 'label', label: 'Label', type: 'text', required: true, placeholder: 'LinkedIn' },
  { key: 'href', label: 'URL', type: 'text', required: true, placeholder: 'https://...' },
  {
    key: 'icon',
    label: 'Icon',
    type: 'text',
    description: 'Use the existing lucide-react icon name format.',
    placeholder: 'Linkedin',
  },
  { key: 'display_order', label: 'Display order', type: 'number', placeholder: '0' },
]

const socialColumns: AdminColumn<Social>[] = [
  { key: 'label', label: 'Network', className: 'admin-column-primary' },
  {
    key: 'href',
    label: 'URL',
    className: 'admin-column-url',
    title: (social) => social.href,
    render: (social) => <span className="admin-url-text">{social.href}</span>,
  },
  {
    key: 'icon',
    label: 'Icon',
    className: 'admin-column-icon',
    render: (social) => social.icon || <span className="admin-cell-muted">{'\u2014'}</span>,
  },
]

export default function AdminSocials() {
  return (
    <AdminCrudPage
      title="Socials"
      singularTitle="Social"
      description="Manage the social links used throughout the portfolio."
      fields={socialFields}
      columns={socialColumns}
      search={{ keys: ['label', 'href', 'icon'], placeholder: 'Search social links...' }}
      compact
      getItemLabel={(social) => social.label}
      getFn={getSocials}
      createFn={createSocials}
      updateFn={updateSocials}
      deleteFn={deleteSocials}
    />
  )
}
