import AdminCrudPage from '../../components/AdminCrudPage'
import { getSocials, createSocials, updateSocials, deleteSocials } from '../../lib/supabase'
import type { AdminField } from '../../components/AdminCrudPage'

const socialFields: AdminField[] = [
  { key: 'label', label: 'Label', type: 'text', required: true },
  { key: 'href', label: 'URL', type: 'text', required: true },
  { key: 'icon', label: 'Icon (lucide-react name)', type: 'text' },
  { key: 'display_order', label: 'Display Order', type: 'number' },
]

export default function AdminSocials() {
  return (
    <AdminCrudPage
      title="Socials"
      singularTitle="Social"
      fields={socialFields}
      getFn={getSocials}
      createFn={createSocials}
      updateFn={updateSocials}
      deleteFn={deleteSocials}
    />
  )
}