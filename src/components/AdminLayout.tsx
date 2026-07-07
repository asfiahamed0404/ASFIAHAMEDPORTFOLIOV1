import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { toast } from 'sonner'
import {
  Award,
  Briefcase,
  Code2,
  FileText,
  Globe,
  GraduationCap,
  Layers,
  LayoutDashboard,
  Link2,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import logo from '../assets/logo.png'

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
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = async () => {
    const { error } = await logout()
    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Logged out')
    }
  }

  const renderSidebar = () => (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-brand">
        <span className="brand-mark">
          <img src={logo} alt="Asfi Ahamed" className="h-8 w-8 object-contain" />
        </span>
        <div>
          <div className="text-lg font-semibold text-white">Admin Studio</div>
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#7dd3fc]">Portfolio CMS</div>
        </div>
      </div>

      <nav className="admin-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/admin'}
            onClick={() => setIsOpen(false)}
            className={({ isActive }) => `admin-nav-link ${isActive ? 'admin-nav-link-active' : ''}`}
          >
            <item.icon size={18} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="admin-sidebar-actions">
        <a href="/" className="admin-nav-link">
          <Globe size={18} />
          <span>View Site</span>
        </a>
        <button type="button" onClick={handleLogout} className="admin-nav-link admin-nav-link-danger">
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )

  return (
    <div className="admin-shell">
      <div className="admin-mobile-topbar">
        <div className="flex items-center gap-3">
          <span className="brand-mark">
            <img src={logo} alt="Asfi Ahamed" className="h-7 w-7 object-contain" />
          </span>
          <span className="font-semibold text-white">Admin Studio</span>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          className="admin-menu-button"
          aria-label={isOpen ? 'Close admin navigation' : 'Open admin navigation'}
        >
          {isOpen ? <X size={19} /> : <Menu size={19} />}
        </button>
      </div>

      <div className="admin-desktop-sidebar">{renderSidebar()}</div>
      {isOpen && <div className="admin-mobile-sidebar">{renderSidebar()}</div>}

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  )
}
