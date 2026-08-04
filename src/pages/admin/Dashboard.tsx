import { useState, useEffect } from 'react'
import {
  getProjects,
  getSkills,
  getEducation,
  getExperience,
  getCertificates,
  getSocials,
  getAppreciationStats,
} from '../../lib/supabase'
import type { AppreciationStats } from '../../lib/supabase'
import {
  Briefcase,
  Code2,
  GraduationCap,
  Award,
  FileText,
  Link2,
  Heart,
  CalendarDays,
  CalendarRange,
  CalendarCheck,
  TrendingUp,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface StatCardProps {
  title: string
  getFn: () => Promise<unknown[]>
  icon: LucideIcon
}

export default function AdminDashboard() {
  const [appreciationStats, setAppreciationStats] = useState<AppreciationStats | null>(null)
  const [appreciationLoading, setAppreciationLoading] = useState(true)
  const [appreciationError, setAppreciationError] = useState<string | null>(null)

  useEffect(() => {
    getAppreciationStats()
      .then((stats) => {
        setAppreciationStats(stats)
      })
      .catch((err) => {
        setAppreciationError(err?.message || 'Failed to load appreciation stats')
      })
      .finally(() => setAppreciationLoading(false))
  }, [])

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

      {/* Appreciation Stats Section */}
      <div className="mt-10">
        <div className="mb-5 flex items-center gap-3">
          <span className="section-eyebrow-bar" />
          <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.22em] text-[#7dd3fc]">
            <Heart size={15} />
            Appreciations
          </span>
        </div>

        {appreciationLoading && (
          <div className="admin-stat-card flex items-center justify-center" style={{ minHeight: 120 }}>
            <p className="text-sm text-[#a1a1aa]">Loading appreciation stats…</p>
          </div>
        )}

        {appreciationError && (
          <div className="admin-stat-card flex items-center justify-center" style={{ minHeight: 120 }}>
            <p className="text-sm text-[#fb7185]">{appreciationError}</p>
          </div>
        )}

        {appreciationStats && !appreciationLoading && (
          <>
            <div className="admin-stat-grid">
              <AppreciationStatCard
                title="Total"
                value={appreciationStats.total}
                icon={Heart}
                accent="rose"
              />
              <AppreciationStatCard
                title="Today"
                value={appreciationStats.today}
                icon={CalendarDays}
                accent="cyan"
              />
              <AppreciationStatCard
                title="This Week"
                value={appreciationStats.thisWeek}
                icon={CalendarRange}
                accent="indigo"
              />
              <AppreciationStatCard
                title="This Month"
                value={appreciationStats.thisMonth}
                icon={CalendarCheck}
                accent="purple"
              />
            </div>

            {/* Activity Chart */}
            <div className="admin-content-panel mt-6">
              <div className="mb-5 flex items-center gap-2">
                <TrendingUp size={16} className="text-[#7dd3fc]" />
                <h3 className="text-sm font-medium text-white">Last 30 Days Activity</h3>
              </div>
              <div style={{ width: '100%', height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={appreciationStats.dailyCounts}>
                    <defs>
                      <linearGradient id="appreciationGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#fb7185" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#fb7185" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.06)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="date"
                      tick={{ fill: '#71717a', fontSize: 10 }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v: string) => {
                        const d = new Date(v)
                        return `${d.getDate()}/${d.getMonth() + 1}`
                      }}
                      interval="preserveStartEnd"
                      minTickGap={36}
                    />
                    <YAxis
                      tick={{ fill: '#71717a', fontSize: 10 }}
                      tickLine={false}
                      axisLine={false}
                      allowDecimals={false}
                      width={28}
                    />
                    <Tooltip
                      contentStyle={{
                        background: '#111113',
                        border: '1px solid rgba(255,255,255,0.12)',
                        borderRadius: '12px',
                        color: '#fff',
                        fontSize: 12,
                      }}
                      labelFormatter={(label) => {
                        const d = new Date(String(label))
                        return d.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      }}
                      formatter={(value) => [String(value), 'Appreciations']}
                    />
                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke="#fb7185"
                      strokeWidth={2}
                      fill="url(#appreciationGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
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

const accentColors: Record<string, { border: string; bg: string; text: string }> = {
  rose: {
    border: 'rgba(251,113,133,0.25)',
    bg: 'rgba(251,113,133,0.08)',
    text: '#fb7185',
  },
  cyan: {
    border: 'rgba(34,211,238,0.25)',
    bg: 'rgba(34,211,238,0.08)',
    text: '#22d3ee',
  },
  indigo: {
    border: 'rgba(129,140,248,0.25)',
    bg: 'rgba(129,140,248,0.08)',
    text: '#818cf8',
  },
  purple: {
    border: 'rgba(168,85,247,0.25)',
    bg: 'rgba(168,85,247,0.08)',
    text: '#a855f7',
  },
}

function AppreciationStatCard({
  title,
  value,
  icon: Icon,
  accent,
}: {
  title: string
  value: number
  icon: LucideIcon
  accent: string
}) {
  const colors = accentColors[accent] || accentColors.rose

  return (
    <div className="admin-stat-card">
      <div className="flex items-center gap-3">
        <div
          className="admin-stat-icon"
          style={{
            borderColor: colors.border,
            background: colors.bg,
            color: colors.text,
          }}
        >
          <Icon size={24} />
        </div>
        <div className="text-sm text-[#a1a1aa]">{title}</div>
      </div>
      <div className="text-3xl font-bold text-white">{value}</div>
    </div>
  )
}
