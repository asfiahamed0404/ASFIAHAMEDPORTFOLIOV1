import { useEffect, useLayoutEffect, useRef, useState, type FC } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Award,
  Briefcase,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Code2,
  Download,
  ExternalLink,
  GraduationCap,
  Heart,
  Layers,
  Mail,
  MapPin,
  Menu,
  Phone,
  RefreshCw,
  Send,
  User,
  X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { toast } from 'sonner';

import asfiPortrait from '../assets/Asfi_face.png';
import asfiFull from '../assets/Asfi.png';
import logo from '../assets/logo.png';

import { supabase } from '../lib/supabase';
import type { Project, SiteContent, Skill, Social } from '../lib/supabase';
import { usePortfolioData } from '../hooks/usePortfolioData';
import BackToTop from '../components/BackToTop';
import AmbientOrbs from '../components/AmbientOrbs';
import CertificatesSection from '../components/sections/CertificatesSection';

const isEmpty = (val: unknown): boolean => {
  if (val === null || val === undefined) return true;
  if (typeof val === 'string' && val.trim() === '') return true;
  if (Array.isArray(val) && val.length === 0) return true;
  return false;
};

const isNotEmpty = (val: unknown): boolean => !isEmpty(val);

const hasAboutContent = (content: SiteContent | null): boolean => {
  if (!content) return false;
  return (
    isNotEmpty(content.about_text) ||
    isNotEmpty(content.about_paragraph1) ||
    isNotEmpty(content.about_paragraph2) ||
    isNotEmpty(content.about_paragraph3)
  );
};

const hasContactInfo = (content: SiteContent | null): boolean => {
  if (!content) return false;
  return isNotEmpty(content.contact_intro);
};

const getValidSocials = (socials: Social[]): Social[] => {
  return socials.filter((social) => isNotEmpty(social.href));
};

const SocialIcon: FC<{ label: string }> = ({ label }) => {
  const normalizedLabel = label.toLowerCase();

  if (normalizedLabel.includes('github')) {
    return (
      <svg className="social-logo" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M12 .5A11.5 11.5 0 0 0 8.36 22.9c.58.1.8-.25.8-.56v-2.02c-3.26.71-3.95-1.4-3.95-1.4-.53-1.36-1.3-1.72-1.3-1.72-1.07-.73.08-.72.08-.72 1.18.08 1.8 1.22 1.8 1.22 1.05 1.79 2.76 1.27 3.43.97.1-.76.41-1.27.75-1.56-2.6-.3-5.34-1.3-5.34-5.8 0-1.28.46-2.33 1.21-3.15-.12-.3-.52-1.5.12-3.1 0 0 .98-.32 3.22 1.2A11.1 11.1 0 0 1 12 5.87c.99 0 1.98.13 2.91.39 2.23-1.52 3.22-1.2 3.22-1.2.64 1.6.24 2.8.12 3.1.75.82 1.2 1.87 1.2 3.15 0 4.51-2.74 5.5-5.35 5.8.42.36.8 1.08.8 2.18v3.05c0 .31.2.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
      </svg>
    );
  }

  if (normalizedLabel.includes('linkedin')) {
    return (
      <svg className="social-logo" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.44-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.32 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13Zm1.78 13.02H3.54V9H7.1v11.45ZM22.22 0H1.77C.8 0 0 .77 0 1.73v20.54C0 23.23.8 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
      </svg>
    );
  }

  if (normalizedLabel.includes('email') || normalizedLabel.includes('mail')) return <Mail size={17} />;

  return <ExternalLink size={17} />;
};

const hasHeroContent = (content: SiteContent | null): boolean => {
  if (!content) return false;
  return (
    isNotEmpty(content.hero_title) ||
    isNotEmpty(content.hero_subtitle) ||
    isNotEmpty(content.hero_status)
  );
};

interface SectionIntroProps {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
}

const SectionIntro: FC<SectionIntroProps> = ({ icon: Icon, eyebrow, title, subtitle, align = 'left' }) => (
  <div className={align === 'center' ? 'mx-auto mb-12 max-w-3xl text-center' : 'mb-12 max-w-3xl'}>
    <div className={`mb-4 flex items-center gap-3 ${align === 'center' ? 'justify-center' : ''}`}>
      <span className="section-eyebrow-bar" />
      <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.22em] text-[#7dd3fc]">
        <Icon size={15} />
        {eyebrow}
      </span>
    </div>
    <h2 className="title-gradient text-4xl sm:text-5xl">{title}</h2>
    {subtitle && <p className="mt-4 text-base leading-7 text-[#a1a1aa]">{subtitle}</p>}
  </div>
);

interface NavProps {
  hasAbout: boolean;
  hasEducation: boolean;
  hasProjects: boolean;
  hasSkills: boolean;
  hasCertificates: boolean;
  resumeUrl: string;
}

const Nav: FC<NavProps> = ({
  hasAbout,
  hasEducation,
  hasProjects,
  hasSkills,
  hasCertificates,
  resumeUrl,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { label: 'About', href: '#about', show: hasAbout },
    { label: 'Background', href: '#education', show: hasEducation },
    { label: 'Projects', href: '#projects', show: hasProjects },
    { label: 'Skills', href: '#skills', show: hasSkills },
    { label: 'Certificates', href: '#certificates', show: hasCertificates },
  ].filter((link) => link.show);

  const scrollTo = (id: string) => {
    const element = document.querySelector(id);
    if (element) {
      const offset = 84;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition - bodyRect - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
    setIsOpen(false);
  };

  return (
    <nav className="public-nav fixed left-0 right-0 top-0 z-50">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-5 sm:px-6">
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="group flex items-center gap-3 text-left"
          aria-label="Scroll to top"
        >
          <span className="brand-mark">
            <img src={logo} alt="Asfi Ahamed" className="h-8 w-8 object-contain" />
          </span>
          <span>
            <span className="block text-base font-semibold text-white sm:text-lg">Asfi Ahamed</span>
            <span className="block font-mono text-[10px] uppercase tracking-[0.28em] text-[#7dd3fc]">Portfolio</span>
          </span>
        </button>

        <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] p-1 text-sm backdrop-blur-xl md:flex">
          {navLinks.map((link) => (
            <button
              key={link.label}
              type="button"
              onClick={() => scrollTo(link.href)}
              className="public-nav-link rounded-full px-4 py-2 text-[#cbd5e1]"
            >
              {link.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <a
            href={resumeUrl}
            download="Asfi_Ahamed_CV.pdf"
            className="hidden h-11 items-center gap-2 rounded-full border border-white/10 bg-white px-4 text-sm font-semibold text-[#030303] transition hover:bg-[#dff7ff] sm:flex"
          >
            <Download size={16} />
            CV
          </a>
          <button
            type="button"
            onClick={() => setIsOpen((open) => !open)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white md:hidden"
            aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
          >
            {isOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-4 mb-4 rounded-[22px] border border-white/10 bg-[#07070a]/95 p-4 shadow-2xl backdrop-blur-xl md:hidden"
        >
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <button
                key={link.label}
                type="button"
                onClick={() => scrollTo(link.href)}
                className="rounded-2xl px-4 py-3 text-left text-sm text-[#d4d4d8] hover:bg-white/[0.06] hover:text-white"
              >
                {link.label}
              </button>
            ))}
            <a
              href={resumeUrl}
              download="Asfi_Ahamed_CV.pdf"
              className="mt-2 flex items-center gap-2 rounded-2xl border border-white/10 px-4 py-3 text-sm text-white"
            >
              <Download size={16} />
              Download CV
            </a>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

const ProjectCard: FC<{ project: Project; index: number }> = ({ project, index }) => {
  const demoLink = project.demo || project.live_website;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ delay: index * 0.05, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      className="project-card-premium group"
    >
      {project.image_url && (
        <div className="project-card-media">
          <img src={project.image_url} alt={project.title} loading="lazy" />
        </div>
      )}
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <div className="mb-5 flex items-start justify-between gap-5">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <h3 className="text-2xl font-semibold text-white">{project.title}</h3>
              {project.highlight && <span className="highlight-chip">{project.highlight}</span>}
            </div>
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-[#7dd3fc]">
              <Calendar size={13} />
              {project.year}
            </div>
          </div>
        </div>

        <p className="mb-6 flex-1 text-[15px] leading-7 text-[#a1a1aa]">{project.description}</p>

        <div className="mb-6 flex flex-wrap gap-2">
          {(project.tech || []).map((tech) => (
            <span key={tech} className="tech-badge">
              {tech}
            </span>
          ))}
        </div>

        <div className="mt-auto flex flex-wrap gap-3 border-t border-white/10 pt-5">
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer" className="project-link">
              GitHub
              <ExternalLink size={14} />
            </a>
          )}
          {demoLink && (
            <a href={demoLink} target="_blank" rel="noopener noreferrer" className="project-link project-link-primary">
              Live view
              <ExternalLink size={14} />
            </a>
          )}
          {!project.github && !demoLink && <span className="project-link opacity-70">Coming soon</span>}
        </div>
      </div>
    </motion.article>
  );
};

const AppreciateSection: FC = () => {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);
  const [reaction, setReaction] = useState<string | null>(null);
  const [showThanks, setShowThanks] = useState(false);
  const [loading, setLoading] = useState(true);

  const reactions = [
    { emoji: '\u{1F44F}', label: 'Great work' },
    { emoji: '\u{1F525}', label: 'Impressive' },
    { emoji: '\u{1F4A1}', label: 'Inspiring' },
    { emoji: '\u2764\uFE0F', label: 'Love it' },
  ];

  useEffect(() => {
    const saved = localStorage.getItem('asfi_appreciate');
    if (saved) {
      const data = JSON.parse(saved);
      setLiked(!!data.liked);
      setReaction(data.reaction || null);
      if (data.liked || data.reaction) setShowThanks(true);
    }
  }, []);

  useEffect(() => {
    const fetchCount = async () => {
      const { data } = await supabase.from('appreciations').select('count').eq('id', 1).single();

      if (data) {
        setCount(data.count);
      }
      setLoading(false);
    };

    fetchCount();

    const channel = supabase
      .channel('appreciations-realtime')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'appreciations',
          filter: 'id=eq.1',
        },
        (payload) => {
          setCount(payload.new.count);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const incrementInDatabase = async () => {
    const { data } = await supabase.from('appreciations').update({ count: count + 1 }).eq('id', 1).select().single();

    if (data) {
      setCount(data.count);
    }
  };

  const handleLike = async () => {
    if (liked) return;

    await incrementInDatabase();
    setLiked(true);
    setShowThanks(true);

    localStorage.setItem('asfi_appreciate', JSON.stringify({ liked: true, reaction }));
    toast.success('Thank you! It really means a lot.', { duration: 3000 });
  };

  const handleReaction = async (emoji: string) => {
    setReaction(emoji);
    setShowThanks(true);

    if (!liked) {
      await incrementInDatabase();
      setLiked(true);
      localStorage.setItem('asfi_appreciate', JSON.stringify({ liked: true, reaction: emoji }));
    } else {
      localStorage.setItem('asfi_appreciate', JSON.stringify({ liked, reaction: emoji }));
    }

    toast.success(`Thanks for the ${emoji}!`, { duration: 2000 });
  };

  return (
    <section className="section px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <div className="appreciate-panel">
          <div className="relative z-10 grid gap-10 md:grid-cols-[1.05fr_0.95fr] md:items-center">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-[#7dd3fc]">
                <Heart size={16} />
                Appreciate
              </div>
              <h2 className="text-4xl text-white sm:text-5xl">Enjoyed the portfolio?</h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-[#a1a1aa]">
                A tiny signal helps me know this work is landing with the people who visit it.
              </p>
            </div>

            <div className="flex flex-col items-center rounded-[24px] border border-white/10 bg-black/20 p-6 text-center backdrop-blur">
              <motion.button
                type="button"
                onClick={handleLike}
                whileTap={{ scale: 0.92 }}
                className={`heart-button ${liked ? 'heart-button-liked' : ''}`}
                disabled={liked || loading}
                aria-label="Appreciate this portfolio"
              >
                <motion.span animate={{ scale: liked ? [1, 1.22, 1] : 1 }} transition={{ duration: 0.45 }}>
                  <Heart size={44} className={liked ? 'fill-[#fb7185] text-[#fb7185]' : 'text-white'} />
                </motion.span>
              </motion.button>

              <div className="mt-5 min-h-[30px] text-sm text-[#a1a1aa]">
                {loading ? (
                  'Loading appreciation count...'
                ) : count === 0 ? (
                  'Be the first to appreciate this portfolio'
                ) : (
                  <>
                    <span className="font-mono text-2xl font-semibold text-white">{count}</span>
                    <span className="ml-2 text-[#a1a1aa]">people appreciated this portfolio</span>
                  </>
                )}
              </div>

              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {reactions.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => handleReaction(item.emoji)}
                    disabled={reaction === item.emoji}
                    className={`reaction-chip ${reaction === item.emoji ? 'reaction-chip-active' : ''}`}
                  >
                    <span>{item.emoji}</span>
                    {item.label}
                  </button>
                ))}
              </div>

              {showThanks && (
                <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-6 text-sm text-[#d4d4d8]">
                  Thank you. Feel free to reach out if you want to collaborate.
                </motion.p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const PortfolioLoadingScreen: FC = () => (
  <main
    className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#030303] px-6 text-white"
    aria-busy="true"
    aria-live="polite"
  >
    <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(99,102,241,0.18),transparent_32%,rgba(34,211,238,0.10)_52%,transparent_72%,rgba(236,72,153,0.13))]" />
    <motion.div
      className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(255,255,255,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.055)_1px,transparent_1px)] [background-size:48px_48px]"
      animate={{ backgroundPosition: ['0px 0px', '48px 48px'] }}
      transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}
    />
    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#818cf8] to-transparent" />
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
      className="relative z-10 flex w-full max-w-md flex-col items-center text-center"
      role="status"
    >
      <div className="relative mb-9 h-32 w-32">
        <motion.div
          className="absolute inset-0 rounded-[2.4rem] bg-[conic-gradient(from_90deg,transparent_0deg,#22d3ee_70deg,#818cf8_160deg,#ec4899_245deg,transparent_360deg)]"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 3.2, ease: 'linear' }}
        />
        <div className="absolute inset-[5px] rounded-[2.1rem] bg-[#030303]" />
        <motion.div
          className="absolute inset-3 flex items-center justify-center rounded-[1.7rem] border border-white/10 bg-white/[0.045] shadow-2xl backdrop-blur"
          animate={{
            scale: [1, 1.035, 1],
            boxShadow: [
              '0 18px 60px rgba(99,102,241,0.18)',
              '0 26px 80px rgba(34,211,238,0.22)',
              '0 18px 60px rgba(99,102,241,0.18)',
            ],
          }}
          transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
        >
          <img src={logo} alt="Asfi Ahamed" className="h-14 w-14 object-contain" />
        </motion.div>
      </div>
      <p className="font-mono text-xs uppercase tracking-[0.32em] text-[#818cf8]">Asfi Ahamed</p>
      <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">Loading portfolio</h1>
      <p className="mt-4 max-w-sm text-sm leading-6 text-[#a1a1aa]">Preparing the latest projects, skills, and story.</p>
      <div className="mt-9 flex items-center gap-2" aria-hidden="true">
        {[0, 1, 2].map((dot) => (
          <motion.span
            key={dot}
            className="h-2 w-2 rounded-full bg-[#a5b4fc]"
            animate={{ opacity: [0.35, 1, 0.35], y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 1.15, delay: dot * 0.16, ease: 'easeInOut' }}
          />
        ))}
      </div>
      <div className="mt-6 h-1 w-64 overflow-hidden rounded-full bg-[#27272a]">
        <motion.div
          className="h-full w-28 rounded-full bg-gradient-to-r from-[#22d3ee] via-[#818cf8] to-[#ec4899]"
          animate={{ x: [-96, 256] }}
          transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
        />
      </div>
      <span className="sr-only">Loading portfolio content</span>
    </motion.div>
  </main>
);

const PortfolioRetryScreen: FC<{ message: string; onRetry: () => void }> = ({ message, onRetry }) => (
  <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#030303] px-6 text-white">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.22),transparent_34%),radial-gradient(circle_at_80%_70%,rgba(236,72,153,0.10),transparent_30%)]" />
    <div className="relative z-10 w-full max-w-lg rounded-[2rem] border border-[#27272a] bg-[#0a0a0c]/90 p-8 text-center shadow-2xl shadow-black/40 backdrop-blur">
      <img src={logo} alt="Asfi Ahamed" className="mx-auto mb-6 h-14 w-14 object-contain" />
      <p className="font-mono text-xs uppercase tracking-[0.28em] text-[#818cf8]">Portfolio</p>
      <h1 className="mt-3 text-3xl font-semibold text-white">Could not load just now</h1>
      <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-[#a1a1aa]">
        The portfolio content could not be reached. Please try again in a moment.
      </p>
      <p className="mt-3 text-xs text-[#71717a]">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="btn-primary mx-auto mt-8 flex h-12 items-center justify-center gap-2 rounded-2xl px-6 text-sm font-medium"
      >
        <RefreshCw size={16} />
        Retry
      </button>
    </div>
  </main>
);

interface PortfolioContentProps {
  onRetry: () => void;
}

const PortfolioContent: FC<PortfolioContentProps> = ({ onRetry }) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [minimumLoaderElapsed, setMinimumLoaderElapsed] = useState(false);
  const projectsScrollerRef = useRef<HTMLDivElement>(null);

  const {
    projects: { projects },
    skills: { skills },
    education: { education },
    experience: { experience },
    certificates: { certificates },
    siteContent: { content: siteContent },
    socials: { socials },
    loading: portfolioLoading,
    error: portfolioError,
  } = usePortfolioData();

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setMinimumLoaderElapsed(true);
    }, 3000);

    return () => window.clearTimeout(timerId);
  }, []);

  const showPortfolioLoader = portfolioLoading || !minimumLoaderElapsed;

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [showPortfolioLoader, portfolioError]);

  if (showPortfolioLoader) {
    return <PortfolioLoadingScreen />;
  }

  if (portfolioError) {
    return <PortfolioRetryScreen message={portfolioError} onRetry={onRetry} />;
  }

  const hasProjects = projects.length > 0;
  const hasSkills = skills.length > 0;
  const hasEducation = education.length > 0;
  const hasExperience = isNotEmpty(experience);
  const hasCertificates = certificates.length > 0;
  const hasAbout = hasAboutContent(siteContent);
  const hasContact = hasContactInfo(siteContent);
  const validSocials = getValidSocials(socials);
  const hasSocials = validSocials.length > 0;
  const hasHero = hasHeroContent(siteContent);
  const showBackgroundSection = hasEducation || hasExperience;
  const resumeUrl = siteContent?.resume_url || '/Asfi_CV.pdf';

  const skillGroups = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  const heroStats = [
    { label: 'Projects', value: projects.length, show: hasProjects, icon: Briefcase },
    { label: 'Skill groups', value: Object.keys(skillGroups).length, show: hasSkills, icon: Layers },
    { label: 'Certificates', value: certificates.length, show: hasCertificates, icon: Award },
  ].filter((item) => item.show);

  const copyEmail = () => {
    navigator.clipboard.writeText('muasfiahamed276@gmail.com');
    toast.success('Email copied to clipboard');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill out all fields');
      return;
    }

    setIsSubmitting(true);

    const subject = encodeURIComponent(`Portfolio Inquiry from ${formData.name}`);
    const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`);
    window.location.href = `mailto:muasfiahamed276@gmail.com?subject=${subject}&body=${body}`;

    setTimeout(() => {
      toast.success('Opening your email client...');
      setFormData({ name: '', email: '', message: '' });
      setIsSubmitting(false);
    }, 800);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const scrollProjects = (direction: -1 | 1) => {
    const scroller = projectsScrollerRef.current;
    if (!scroller) return;

    scroller.scrollBy({
      left: direction * scroller.clientWidth,
      behavior: 'smooth',
    });
  };

  return (
    <div className="portfolio-public min-h-screen overflow-x-hidden bg-[#030303] text-[#a1a1aa]">
      <AmbientOrbs />
      <div className="portfolio-grid-bg" aria-hidden="true" />
      <div className="relative z-10">
        <Nav
          hasAbout={hasAbout}
          hasEducation={showBackgroundSection}
          hasProjects={hasProjects}
          hasSkills={hasSkills}
          hasCertificates={hasCertificates}
          resumeUrl={resumeUrl}
        />

        {hasHero && (
          <section className="public-hero section px-6 pb-24 pt-28 sm:pt-32">
            <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
                className="hero-copy max-w-3xl"
              >
                {isNotEmpty(siteContent?.hero_status) && (
                  <div className="hero-status mb-7 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.045] px-4 py-2 text-sm text-[#d4d4d8] backdrop-blur">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#22c55e] opacity-70" />
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#22c55e]" />
                    </span>
                    {siteContent?.hero_status}
                  </div>
                )}

                {isNotEmpty(siteContent?.hero_title) && (
                  <h1 className="hero-title text-white">{siteContent?.hero_title}</h1>
                )}

                {isNotEmpty(siteContent?.hero_subtitle) && (
                  <p className="hero-subtitle mt-7 max-w-2xl text-xl font-light leading-8 text-[#e4e4e7] sm:text-2xl sm:leading-10">
                    <span dangerouslySetInnerHTML={{ __html: siteContent?.hero_subtitle || '' }} />
                  </p>
                )}

                {(hasProjects || hasContact) && (
                  <div className="hero-actions mt-9 flex flex-wrap gap-3">
                    {hasProjects && (
                      <button
                        type="button"
                        onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                        className="btn-primary flex h-14 items-center gap-3 rounded-2xl px-7 text-base font-semibold"
                      >
                        View work
                        <ArrowRight size={19} />
                      </button>
                    )}
                    {hasContact && (
                      <button
                        type="button"
                        onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                        className="btn-secondary flex h-14 items-center gap-3 rounded-2xl px-7 text-base font-semibold"
                      >
                        Start a conversation
                      </button>
                    )}
                  </div>
                )}

                {hasSocials && (
                  <div className="hero-socials mt-8 flex flex-wrap gap-3">
                    {validSocials.map((social) => (
                      <a
                        key={social.id || social.href}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-chip"
                        aria-label={social.label}
                      >
                        <SocialIcon label={social.label} />
                        {social.label}
                      </a>
                    ))}
                  </div>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.12, ease: [0.23, 1, 0.32, 1] }}
                className="public-portrait-wrap"
              >
                <div className="portrait-orbit" aria-hidden="true" />
                <div className="portrait-shell">
                  <img src={asfiPortrait} alt="Asfi Ahamed" className="h-full w-full object-cover object-[50%_30%]" />
                </div>
                {heroStats.length > 0 && (
                  <div className="hero-stat-strip">
                    {heroStats.map((stat) => {
                      const Icon = stat.icon;
                      return (
                        <div key={stat.label} className="hero-stat">
                          <Icon size={15} />
                          <span className="font-mono text-lg font-semibold text-white">{stat.value}</span>
                          <span>{stat.label}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            </div>
          </section>
        )}

        {hasAbout && (
          <section id="about" className="section section-band px-6 py-24">
            <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
              <motion.div
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55 }}
                className="about-image-shell"
              >
                <img src={asfiFull} alt="Asfi Ahamed" className="h-full w-full object-cover object-top" />
              </motion.div>

              <div>
                <SectionIntro icon={User} eyebrow="About" title="A focused builder with a systems mindset." />
                <div className="about-copy">
                  {isNotEmpty(siteContent?.about_text) && (
                    <p className="text-2xl leading-tight text-white">
                      <span dangerouslySetInnerHTML={{ __html: siteContent?.about_text || '' }} />
                    </p>
                  )}
                  <div className="space-y-5 text-[15px] leading-8 text-[#a1a1aa]">
                    {isNotEmpty(siteContent?.about_paragraph1) && (
                      <p dangerouslySetInnerHTML={{ __html: siteContent?.about_paragraph1 || '' }} />
                    )}
                    {isNotEmpty(siteContent?.about_paragraph2) && (
                      <p dangerouslySetInnerHTML={{ __html: siteContent?.about_paragraph2 || '' }} />
                    )}
                    {isNotEmpty(siteContent?.about_paragraph3) && (
                      <p dangerouslySetInnerHTML={{ __html: siteContent?.about_paragraph3 || '' }} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {showBackgroundSection && (
          <section id="education" className="section px-6 py-24">
            <div className="mx-auto max-w-6xl">
              <SectionIntro
                icon={GraduationCap}
                eyebrow="Background"
                title="Education and hands-on experience."
                subtitle="A concise view of the foundation behind the projects."
              />

              <div className="grid gap-6 lg:grid-cols-2">
                {hasEducation && (
                  <div className="feature-panel">
                    <h3 className="mb-8 text-2xl text-white">Education</h3>
                    <div className="space-y-8">
                      {education.map((item, index) => (
                        <motion.div
                          key={item.id || index}
                          initial={{ opacity: 0, y: 16 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.04 }}
                          className="timeline-item pl-9"
                        >
                          <div className="absolute left-0 top-1.5 h-4 w-4 rounded-full border-[3px] border-[#050509] bg-[#22d3ee]" />
                          <div className="mb-1 font-mono text-xs uppercase tracking-[0.16em] text-[#7dd3fc]">{item.period}</div>
                          <div className="mb-1 text-xl font-semibold text-white">{item.title}</div>
                          <div className="mb-3 text-[#d4d4d8]">{item.subtitle}</div>
                          <ul className="space-y-1.5 text-sm leading-6 text-[#a1a1aa]">
                            {(item.details || []).map((detail) => (
                              <li key={detail}>{detail}</li>
                            ))}
                          </ul>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {hasExperience && experience && (
                  <div className="feature-panel">
                    <h3 className="mb-8 text-2xl text-white">Experience</h3>
                    <div className="timeline-item pl-9">
                      <div className="absolute left-0 top-1.5 h-4 w-4 rounded-full border-[3px] border-[#050509] bg-[#ec4899]" />
                      <div className="mb-1 font-mono text-xs uppercase tracking-[0.16em] text-[#f0abfc]">{experience.period}</div>
                      <div className="mb-1 text-xl font-semibold text-white">{experience.title}</div>
                      <div className="mb-3 text-[#d4d4d8]">{experience.subtitle}</div>
                      <ul className="space-y-1.5 text-sm leading-6 text-[#a1a1aa]">
                        {(experience.details || []).map((detail) => (
                          <li key={detail}>{detail}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {hasProjects && (
          <section id="projects" className="section section-band px-6 py-24">
            <div className="mx-auto max-w-6xl">
              <SectionIntro
                icon={Briefcase}
                eyebrow="Selected work"
                title="Projects with substance."
                subtitle="A CMS-powered collection of shipped work, experiments, and systems."
              />

              <div className="projects-mobile-controls" aria-label="Project carousel controls">
                <button type="button" onClick={() => scrollProjects(-1)} className="project-arrow" aria-label="Previous project">
                  <ChevronLeft size={19} />
                </button>
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#94a3b8]">Swipe projects</span>
                <button type="button" onClick={() => scrollProjects(1)} className="project-arrow" aria-label="Next project">
                  <ChevronRight size={19} />
                </button>
              </div>

              <div ref={projectsScrollerRef} className="projects-showcase" aria-label="Project cards">
                {projects.map((project, index) => (
                  <ProjectCard key={project.id || index} project={project} index={index} />
                ))}
              </div>
            </div>
          </section>
        )}

        {hasSkills && (
          <section id="skills" className="section px-6 py-24">
            <div className="mx-auto max-w-6xl">
              <SectionIntro
                icon={Code2}
                eyebrow="Expertise"
                title="A stack shaped for real builds."
                subtitle="Skills are grouped from the CMS into capability clusters for a cleaner, portfolio-first view."
              />

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                {Object.entries(skillGroups).map(([category, items]) => (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="skill-card"
                  >
                    <div className="mb-6 flex items-start justify-between gap-4">
                      <div>
                        <div className="mb-2 h-1 w-10 rounded-full bg-gradient-to-r from-[#22d3ee] via-[#818cf8] to-[#ec4899]" />
                        <div className="text-lg font-semibold text-white">{category}</div>
                      </div>
                      <span className="rounded-full border border-[#7dd3fc]/25 bg-[#7dd3fc]/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[#bae6fd]">
                        {items.length} skills
                      </span>
                    </div>
                    <div className="skill-cloud">
                      {items.map((skill) => (
                        <span key={skill.id} className="skill-token">
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        <CertificatesSection certificates={certificates} />

        <AppreciateSection />

        {hasContact && (
          <section id="contact" className="section section-band px-6 py-24">
            <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
              <div className="contact-copy">
                <SectionIntro icon={Mail} eyebrow="Contact" title="Let's build something considered." />
                <p className="text-base leading-8 text-[#a1a1aa]">{siteContent?.contact_intro}</p>
                <div className="mt-8 space-y-3 text-sm">
                  <button type="button" onClick={copyEmail} className="contact-link">
                    <Mail size={16} />
                    muasfiahamed276@gmail.com
                  </button>
                  <a href="tel:+94781556402" className="contact-link">
                    <Phone size={16} />
                    +94 78 155 6402
                  </a>
                  <span className="contact-link text-[#a1a1aa]">
                    <MapPin size={16} />
                    Sri Lanka
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="contact-form">
                <div className="grid gap-5 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm text-[#a1a1aa]">Your name</span>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="contact-input"
                      placeholder="Jane Doe"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm text-[#a1a1aa]">Email address</span>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="contact-input"
                      placeholder="you@company.com"
                    />
                  </label>
                </div>

                <label className="mt-5 block">
                  <span className="mb-2 block text-sm text-[#a1a1aa]">Message</span>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={6}
                    className="contact-input min-h-40 resize-y py-4"
                    placeholder="Tell me about your project or opportunity..."
                  />
                </label>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary mt-6 flex h-14 w-full items-center justify-center gap-3 rounded-2xl text-base font-semibold disabled:opacity-70"
                >
                  {isSubmitting ? 'Opening email...' : 'Send message'}
                  <Send size={18} />
                </button>
              </form>
            </div>
          </section>
        )}

        <footer className="border-t border-white/10 px-6 py-10 text-sm text-[#71717a]">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
            <div>{siteContent?.footer_text || `(c) ${new Date().getFullYear()} Asfi Ahamed. All rights reserved.`}</div>
            <div className="flex items-center gap-5">
              <a href="https://github.com/asfiahamed0404" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/asfi-ahamed-baa362347"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                LinkedIn
              </a>
              <button type="button" onClick={copyEmail} className="hover:text-white">
                Email
              </button>
            </div>
          </div>
        </footer>

        <BackToTop />
      </div>
    </div>
  );
};

const Home: FC = () => {
  const [retryKey, setRetryKey] = useState(0);

  return <PortfolioContent key={retryKey} onRetry={() => setRetryKey((currentKey) => currentKey + 1)} />;
};

export default Home;
