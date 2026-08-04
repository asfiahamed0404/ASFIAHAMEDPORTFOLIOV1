import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface Project {
  id: string
  title: string
  year: string
  description: string
  tech: string[]
  github: string | null
  demo: string | null
  live_website: string | null
  highlight: string | null
  image_url: string | null
  display_order: number
  created_at: string
  updated_at: string
}

export interface Skill {
  id: string
  name: string
  category: string
  level: number
  display_order: number
  created_at: string
  updated_at: string
}

export interface Education {
  id: string
  title: string
  subtitle: string
  period: string
  details: string[]
  display_order: number
  created_at: string
  updated_at: string
}

export interface Experience {
  id: string
  title: string
  subtitle: string
  period: string
  details: string[]
  display_order: number
  created_at: string
  updated_at: string
}

export interface Certificate {
  id: string
  name: string
  issuer: string
  image_url: string | null
  display_order: number
  created_at: string
  updated_at: string
}

export interface SiteContent {
  id: string
  hero_title: string | null
  hero_subtitle: string | null
  hero_status: string | null
  about_text: string | null
  about_paragraph1: string | null
  about_paragraph2: string | null
  about_paragraph3: string | null
  contact_intro: string | null
  footer_text: string | null
  seo_title: string | null
  seo_description: string | null
  resume_url: string | null
  // Branding assets URLs (optional)
  logo_url?: string | null
  portrait_url?: string | null
  hero_image_url?: string | null
  favicon_url?: string | null
  updated_at: string
}

export interface Social {
  id: string
  label: string
  href: string
  icon: string | null
  display_order: number
  created_at: string
  updated_at: string
}

export async function getProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('display_order', { ascending: true })
  if (error) throw error
  return data || []
}

export async function getSkills(): Promise<Skill[]> {
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .order('display_order', { ascending: true })
  if (error) throw error
  return data || []
}

export async function getEducation(): Promise<Education[]> {
  const { data, error } = await supabase
    .from('education')
    .select('*')
    .order('display_order', { ascending: true })
  if (error) throw error
  return data || []
}

export async function getExperience(): Promise<Experience[]> {
  const { data, error } = await supabase
    .from('experience')
    .select('*')
    .order('display_order', { ascending: true })
  if (error) throw error
  return data || []
}

export async function getCertificates(): Promise<Certificate[]> {
  const { data, error } = await supabase
    .from('certificates')
    .select('*')
    .order('display_order', { ascending: true })
  if (error) throw error
  return data || []
}

export async function getSiteContent(): Promise<SiteContent | null> {
  const { data, error } = await supabase
    .from('site_content')
    .select('*')
    .eq('id', 'main')
    .single()
  if (error && error.code !== 'PGRST116') throw error
  return data
}

export async function getSocials(): Promise<Social[]> {
  const { data, error } = await supabase
    .from('socials')
    .select('*')
    .order('display_order', { ascending: true })
  if (error) throw error
  return data || []
}

// Write operations
export async function createProject(data: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project> {
  const { data: result, error } = await supabase.from('projects').insert(data).select().single()
  if (error) throw error
  return result
}

export async function updateProject(id: string, data: Partial<Project>): Promise<Project> {
  const { data: result, error } = await supabase.from('projects').update(data).eq('id', id).select().single()
  if (error) throw error
  return result
}

export async function deleteProject(id: string): Promise<void> {
  const { error } = await supabase.from('projects').delete().eq('id', id)
  if (error) throw error
}

export async function createSkill(data: Omit<Skill, 'id' | 'created_at' | 'updated_at'>): Promise<Skill> {
  const { data: result, error } = await supabase.from('skills').insert(data).select().single()
  if (error) throw error
  return result
}

export async function updateSkill(id: string, data: Partial<Skill>): Promise<Skill> {
  const { data: result, error } = await supabase.from('skills').update(data).eq('id', id).select().single()
  if (error) throw error
  return result
}

export async function deleteSkill(id: string): Promise<void> {
  const { error } = await supabase.from('skills').delete().eq('id', id)
  if (error) throw error
}

export async function createEducation(data: Omit<Education, 'id' | 'created_at' | 'updated_at'>): Promise<Education> {
  const { data: result, error } = await supabase.from('education').insert(data).select().single()
  if (error) throw error
  return result
}

export async function updateEducation(id: string, data: Partial<Education>): Promise<Education> {
  const { data: result, error } = await supabase.from('education').update(data).eq('id', id).select().single()
  if (error) throw error
  return result
}

export async function deleteEducation(id: string): Promise<void> {
  const { error } = await supabase.from('education').delete().eq('id', id)
  if (error) throw error
}

export async function createExperience(data: Omit<Experience, 'id' | 'created_at' | 'updated_at'>): Promise<Experience> {
  const { data: result, error } = await supabase.from('experience').insert(data).select().single()
  if (error) throw error
  return result
}

export async function updateExperience(id: string, data: Partial<Experience>): Promise<Experience> {
  const { data: result, error } = await supabase.from('experience').update(data).eq('id', id).select().single()
  if (error) throw error
  return result
}

export async function deleteExperience(id: string): Promise<void> {
  const { error } = await supabase.from('experience').delete().eq('id', id)
  if (error) throw error
}

export async function createCertificates(data: Omit<Certificate, 'id' | 'created_at' | 'updated_at'>): Promise<Certificate> {
  const { data: result, error } = await supabase.from('certificates').insert(data).select().single()
  if (error) throw error
  return result
}

export async function updateCertificates(id: string, data: Partial<Certificate>): Promise<Certificate> {
  const { data: result, error } = await supabase.from('certificates').update(data).eq('id', id).select().single()
  if (error) throw error
  return result
}

export async function deleteCertificates(id: string): Promise<void> {
  const { error } = await supabase.from('certificates').delete().eq('id', id)
  if (error) throw error
}

export async function updateSiteContent(data: Partial<SiteContent>): Promise<SiteContent> {
  const { data: result, error } = await supabase.from('site_content').upsert({ id: 'main', ...data }).select().single()
  if (error) throw error
  return result
}

export async function createSocials(data: Omit<Social, 'id' | 'created_at' | 'updated_at'>): Promise<Social> {
  const { data: result, error } = await supabase.from('socials').insert(data).select().single()
  if (error) throw error
  return result
}

export async function updateSocials(id: string, data: Partial<Social>): Promise<Social> {
  const { data: result, error } = await supabase.from('socials').update(data).eq('id', id).select().single()
  if (error) throw error
  return result
}

export async function deleteSocials(id: string): Promise<void> {
  const { error } = await supabase.from('socials').delete().eq('id', id)
  if (error) throw error
}

// Appreciation functions
export async function submitAppreciation(visitorId: string): Promise<void> {
  const { error } = await supabase
    .from('appreciation_logs')
    .insert({ visitor_id: visitorId })
  // Ignore unique constraint violation — visitor already appreciated
  if (error && error.code !== '23505') throw error
}

export async function removeAppreciation(visitorId: string): Promise<void> {
  const { error } = await supabase
    .from('appreciation_logs')
    .delete()
    .eq('visitor_id', visitorId)
  if (error) throw error
}

export interface AppreciationStats {
  total: number
  today: number
  thisWeek: number
  thisMonth: number
  dailyCounts: { date: string; count: number }[]
}

export async function getAppreciationStats(): Promise<AppreciationStats> {
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()

  const dayOfWeek = now.getDay()
  const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek)
  const weekStartStr = weekStart.toISOString()

  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

  const thirtyDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29).toISOString()

  // Fetch all logs from the last 30 days in a single query (admin only via RLS)
  const { data: allLogs, error: allError } = await supabase
    .from('appreciation_logs')
    .select('created_at')

  if (allError) throw allError

  const logs = allLogs || []
  const total = logs.length

  const today = logs.filter(l => l.created_at >= todayStart).length
  const thisWeek = logs.filter(l => l.created_at >= weekStartStr).length
  const thisMonth = logs.filter(l => l.created_at >= monthStart).length

  // Build daily counts for the last 30 days
  const recentLogs = logs.filter(l => l.created_at >= thirtyDaysAgo)
  const countMap: Record<string, number> = {}

  // Initialize all 30 days with 0
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i)
    const key = d.toISOString().split('T')[0]
    countMap[key] = 0
  }

  recentLogs.forEach(log => {
    const key = log.created_at.split('T')[0]
    if (countMap[key] !== undefined) {
      countMap[key]++
    }
  })

  const dailyCounts = Object.entries(countMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, count }))

  return { total, today, thisWeek, thisMonth, dailyCounts }
}

// Auth helpers
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  return { data, error }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function getUser() {
  const { data } = await supabase.auth.getUser()
  return data.user
}