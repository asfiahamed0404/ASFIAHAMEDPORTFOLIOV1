import { useState, useEffect } from 'react'
import { getProjects, getSkills, getEducation, getExperience, getCertificates, getSocials } from '../../lib/supabase'
import { Briefcase, Code2, GraduationCap, Award, FileText, Link2 } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  getFn: () => Promise<unknown[]>
  icon: LucideIcon
}

export default function AdminDashboard() {
  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <p className="admin-kicker">Portfolio CMS</p>
          <h1 className="admin-page-title">Dashboard</h1>
        </div>
      </div>

      <div className="admin-stat-grid">
        <AdminStatCard title="Projects" getFn={getProjects} icon={Briefcase} />
        <AdminStatCard title="Skills" getFn={getSkills} icon={Code2} />
        <AdminStatCard title="Education" getFn={getEducation} icon={GraduationCap} />
        <AdminStatCard title="Certificates" getFn={getCertificates} icon={Award} />
        <AdminStatCard title="Experience" getFn={getExperience} icon={FileText} />
        <AdminStatCard title="Social Links" getFn={getSocials} icon={Link2} />
      </div>
    </div>
  )
}

function AdminStatCard({ title, getFn, icon: Icon }: StatCardProps) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    getFn()
      .then((data) => setCount(Array.isArray(data) ? data.length : 0))
      .catch(() => setCount(0))
  }, [getFn])

  return (
    <div className="admin-stat-card">
      <div className="flex items-center gap-3">
        <div className="admin-stat-icon">
          <Icon size={24} />
        </div>
        <div className="text-sm text-[#a1a1aa]">{title}</div>
      </div>
      <div className="text-3xl font-bold text-white">{count}</div>
    </div>
  )
}
