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