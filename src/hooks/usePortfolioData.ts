import { useState, useEffect } from 'react'
import type {
  Project,
  Skill,
  Education,
  Experience,
  Certificate,
  SiteContent,
  Social,
} from '../lib/supabase'
import {
  getProjects,
  getSkills,
  getEducation,
  getExperience,
  getCertificates,
  getSiteContent,
  getSocials,
} from '../lib/supabase'

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    getProjects()
      .then((data) => {
        if (mounted) setProjects(data)
      })
      .catch(() => {
        if (mounted) setError('Failed to load projects')
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })
    return () => { mounted = false }
  }, [])

  return { projects, loading, error }
}

export function useSkills() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    getSkills()
      .then((data) => {
        if (mounted) setSkills(data)
      })
      .catch(() => {
        if (mounted) setError('Failed to load skills')
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })
    return () => { mounted = false }
  }, [])

  return { skills, loading, error }
}

export function useEducation() {
  const [education, setEducation] = useState<Education[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    getEducation()
      .then((data) => {
        if (mounted) setEducation(data)
      })
      .catch(() => {
        if (mounted) setError('Failed to load education')
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })
    return () => { mounted = false }
  }, [])

  return { education, loading, error }
}

export function useExperience() {
  const [experience, setExperience] = useState<Experience | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    getExperience()
      .then((data) => {
        if (mounted) setExperience(data[0] ?? null)
      })
      .catch(() => {
        if (mounted) setError('Failed to load experience')
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })
    return () => { mounted = false }
  }, [])

  return { experience, loading, error }
}

export function useCertificates() {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    getCertificates()
      .then((data) => {
        if (mounted) setCertificates(data)
      })
      .catch(() => {
        if (mounted) setError('Failed to load certificates')
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })
    return () => { mounted = false }
  }, [])

  return { certificates, loading, error }
}

export function useSiteContent() {
  const [content, setContent] = useState<SiteContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    getSiteContent()
      .then((data) => {
        if (mounted) setContent(data)
      })
      .catch(() => {
        if (mounted) setError('Failed to load site content')
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })
    return () => { mounted = false }
  }, [])

  return { content, loading, error }
}

export function useSocials() {
  const [socials, setSocials] = useState<Social[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    getSocials()
      .then((data) => {
        if (mounted) setSocials(data)
      })
      .catch(() => {
        if (mounted) setError('Failed to load socials')
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })
    return () => { mounted = false }
  }, [])

  return { socials, loading, error }
}

export function usePortfolioData() {
  const projects = useProjects()
  const skills = useSkills()
  const education = useEducation()
  const experience = useExperience()
  const certificates = useCertificates()
  const siteContent = useSiteContent()
  const socials = useSocials()

  const loading =
    projects.loading ||
    skills.loading ||
    education.loading ||
    experience.loading ||
    certificates.loading ||
    siteContent.loading ||
    socials.loading

  const error =
    projects.error ||
    skills.error ||
    education.error ||
    experience.error ||
    certificates.error ||
    siteContent.error ||
    socials.error

  return {
    projects,
    skills,
    education,
    experience,
    certificates,
    siteContent,
    socials,
    loading,
    error,
  }
}