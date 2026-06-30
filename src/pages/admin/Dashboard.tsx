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
    <div className="space-y-8">
      <div>
        <h1 className="text-white text-3xl tracking-tight">Dashboard</h1>
        <p className="text-[#71717a] mt-1">Manage your portfolio content</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminStatCard title="Projects" getFn={getProjects} icon={Briefcase} />
        <AdminStatCard title="Skills" getFn={getSkills} icon={Code2} />
        <AdminStatCard title="Education" getFn={getEducation} icon={GraduationCap} />
        <AdminStatCard title="Certificates" getFn={getCertificates} icon={Award} />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <AdminStatCard title="Experience" getFn={getExperience} icon={FileText} />
        <AdminStatCard title="Social Links" getFn={getSocials} icon={Link2} />
      </div>
    </div>
  )
}

function AdminStatCard({ title, getFn, icon: Icon }: StatCardProps) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    getFn().then((data) => setCount(Array.isArray(data) ? data.length : 0))
  }, [getFn])

  return (
    <div className="bg-[#1a1a2e] border border-gray-600 rounded-3xl p-6 hover:border-indigo-600 transition-colors shadow-md">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-[#6366f1]/10 rounded-xl text-[#818cf8]">
          <Icon size={24} />
        </div>
        <div className="text-sm text-[#71717a]">{title}</div>
      </div>
      <div className="text-3xl font-bold text-white">{count}</div>
    </div>
  )
}