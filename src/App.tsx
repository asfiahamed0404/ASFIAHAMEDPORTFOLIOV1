import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import RequireAuth from './components/RequireAuth'
import AdminLayout from './components/AdminLayout'
import Home from './pages/Home'
import Login from './pages/Login'
import AdminDashboard from './pages/admin/Dashboard'
import AdminProjects from './pages/admin/Projects'
import AdminSkills from './pages/admin/Skills'
import AdminEducation from './pages/admin/Education'
import AdminExperience from './pages/admin/Experience'
import AdminCertificates from './pages/admin/Certificates'
import AdminSiteContent from './pages/admin/SiteContent'
import AdminBranding from './pages/admin/Branding'
import AdminSocials from './pages/admin/Socials'
import './index.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route element={<RequireAuth><AdminLayout /></RequireAuth>}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/projects" element={<AdminProjects />} />
          <Route path="/admin/skills" element={<AdminSkills />} />
          <Route path="/admin/education" element={<AdminEducation />} />
          <Route path="/admin/experience" element={<AdminExperience />} />
          <Route path="/admin/certificates" element={<AdminCertificates />} />
          <Route path="/admin/site-content" element={<AdminSiteContent />} />
          <Route path="/admin/socials" element={<AdminSocials />} />
          <Route path="/admin/branding" element={<AdminBranding />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster position="top-center" richColors closeButton />
    </BrowserRouter>
  )
}

export default App
