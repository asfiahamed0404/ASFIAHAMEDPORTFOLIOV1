import AdminCrudPage from '../../components/AdminCrudPage'
import { getCertificates, createCertificates, updateCertificates, deleteCertificates } from '../../lib/supabase'
import type { AdminField } from '../../components/AdminCrudPage'

const certificateFields: AdminField[] = [
  { key: 'name', label: 'Name', type: 'text', required: true },
  { key: 'issuer', label: 'Issuer', type: 'text', required: true },
  { key: 'display_order', label: 'Display Order', type: 'number' },
]

export default function AdminCertificates() {
  return (
    <AdminCrudPage
      title="Certificates"
      fields={certificateFields}
      getFn={getCertificates}
      createFn={createCertificates}
      updateFn={updateCertificates}
      deleteFn={deleteCertificates}
    />
  )
}