import { Outlet, NavLink } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { toast } from 'sonner'
import {
  LayoutDashboard,
  Briefcase,
  Code2,
  GraduationCap,
  FileText,
  Award,
  Layers,
  Link2,
  LogOut,
  Globe,
} from 'lucide-react'

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/projects', label: 'Projects', icon: Briefcase },
  { to: '/admin/skills', label: 'Skills', icon: Code2 },
  { to: '/admin/education', label: 'Education', icon: GraduationCap },
  { to: '/admin/experience', label: 'Experience', icon: FileText },
  { to: '/admin/certificates', label: 'Certificates', icon: Award },
  { to: '/admin/site-content', label: 'Site Content', icon: Layers },
  { to: '/admin/branding', label: 'Branding', icon: Globe },
  { to: '/admin/socials', label: 'Socials', icon: Link2 },
]

export default function AdminLayout() {
  const { logout } = useAuth()

  const handleLogout = async () => {
    const { error } = await logout()
    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Logged out')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900 text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-indigo-800 text-white border-r border-indigo-700 flex flex-col shadow-lg">
        <div className="p-6 border-b border-[#27272a]">
          <div className="text-white font-semibold text-xl">Admin</div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/admin'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-300 hover:bg-indigo-800'
                }`
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-[#27272a] space-y-1">
          <a
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-300 hover:bg-indigo-800 transition-colors"
          >
            <Globe size={18} /> View Site
          </a>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400 hover:bg-red-900/20 transition-colors w-full"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto bg-[#121214] text-gray-100">
        <Outlet />
      </main>
    </div>
  )
}
