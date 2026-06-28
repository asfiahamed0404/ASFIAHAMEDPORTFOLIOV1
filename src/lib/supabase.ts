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