import { useState, useEffect, useLayoutEffect, type FC } from 'react';
import { motion } from 'framer-motion';
import {
  Mail, Phone, MapPin, ExternalLink, Download,
  Calendar, Code2, User, Briefcase, GraduationCap, ArrowRight, Heart, RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

import asfiPortrait from '../assets/Asfi_face.png';
import asfiFull from '../assets/Asfi.png';
import logo from '../assets/logo.png';

import { supabase } from '../lib/supabase';
import type { Project } from '../lib/supabase';
import {
  usePortfolioData,
} from '../hooks/usePortfolioData';
import BackToTop from '../components/BackToTop';
import AmbientOrbs from '../components/AmbientOrbs';
import CertificatesSection from '../components/sections/CertificatesSection';

// Helper to check if value is empty
const isEmpty = (val: unknown): boolean => {
  if (val === null || val === undefined) return true;
  if (typeof val === 'string' && val.trim() === '') return true;
  if (Array.isArray(val) && val.length === 0) return true;
  return false;
};

const isNotEmpty = (val: unknown): boolean => !isEmpty(val);

// Helper to check if about section has content
const hasAboutContent = (content: any): boolean => {
  if (!content) return false;
  return (
    isNotEmpty(content.about_text) ||
    isNotEmpty(content.about_paragraph1) ||
    isNotEmpty(content.about_paragraph2) ||
    isNotEmpty(content.about_paragraph3)
  );
};

// Helper to check if contact section has info
const hasContactInfo = (content: any): boolean => {
  if (!content) return false;
  return isNotEmpty(content.contact_intro);
};

// Helper to filter valid social links
const getValidSocials = (socials: any[]): any[] => {
  return socials.filter(s => isNotEmpty(s.href));
};

// Helper to check if hero has content
const hasHeroContent = (content: any): boolean => {
  if (!content) return false;
  return (
    isNotEmpty(content.hero_title) ||
    isNotEmpty(content.hero_subtitle) ||
    isNotEmpty(content.hero_status)
  );
};

// Components
const Nav: FC<{ hasAbout: boolean; hasEducation: boolean; hasProjects: boolean; hasSkills: boolean; hasCertificates: boolean }> = ({
  hasAbout, hasEducation, hasProjects, hasSkills, hasCertificates
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { label: "About", href: "#about", show: hasAbout },
    { label: "Education", href: "#education", show: hasEducation || true },
    { label: "Projects", href: "#projects", show: hasProjects },
    { label: "Skills", href: "#skills", show: hasSkills },
    { label: "Certificates", href: "#certificates", show: hasCertificates },
  ].filter(link => link.show);

  const scrollTo = (id: string) => {
    const element = document.querySelector(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition - bodyRect - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#030303]/95 backdrop-blur-lg border-b border-[#27272a]">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-20">
        {/* Logo */}
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <img
            src={logo}
            alt="Asfi Ahamed"
            className="w-9 h-9 object-contain"
          />
          <div>
            <div className="font-semibold text-white tracking-tight text-xl">Asfi Ahamed</div>
            <div className="text-[10px] text-[#71717a] -mt-1">CSE</div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-9 text-sm">
          {navLinks.map(link => (
            <button
              key={link.label}
              onClick={() => scrollTo(link.href)}
              className="nav-link text-[#a1a1aa] hover:text-white transition-colors"
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <a
            href="/Asfi_CV.pdf"
            download="Asfi_Ahamed_CV.pdf"
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-white text-[#030303] text-sm font-medium hover:bg-white/90 transition-all active:scale-[0.985]"
          >
            <Download size={16} /> CV
          </a>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-[#a1a1aa]"
          >
            <Code2 size={20} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-[#27272a] bg-[#030303] px-6 py-6 flex flex-col gap-4 text-sm">
          {navLinks.map(link => (
            <button
              key={link.label}
              onClick={() => scrollTo(link.href)}
              className="text-left py-2 text-[#a1a1aa] hover:text-white"
            >
              {link.label}
            </button>
          ))}
          <div className="pt-3 border-t border-[#27272a] flex flex-col gap-3">
            <a href="/Asfi_CV.pdf" download="Asfi_Ahamed_CV.pdf" className="flex items-center gap-2 text-white py-2">
              <Download size={16} /> Download CV
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

const ProjectCard: FC<{ project: Project; index: number }> = ({ project, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04 }}
      className="project-card group bg-[#111113] border border-[#27272a] rounded-3xl p-8 flex flex-col h-full"
    >
      <div className="flex justify-between items-start mb-5">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h3 className="text-2xl font-semibold tracking-tight text-white">{project.title}</h3>
            {project.highlight && (
              <span className="text-[10px] font-mono uppercase tracking-[2px] px-3 py-0.5 rounded-full bg-[#6366f1]/10 text-[#818cf8] border border-[#6366f1]/20">
                {project.highlight}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-[#71717a] text-sm">
            <Calendar size={14} /> {project.year}
          </div>
        </div>
      </div>

      <p className="text-[#a1a1aa] leading-relaxed flex-1 mb-6">
        {project.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        {(project.tech || []).map((t, i) => (
          <span key={i} className="tech-badge">{t}</span>
        ))}
      </div>

      <div className="flex gap-3 mt-auto pt-4 border-t border-[#27272a]">
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-[#a1a1aa] hover:text-white transition-colors group/btn"
          >
            View on GitHub
            <ExternalLink size={14} className="opacity-50 group-hover/btn:opacity-100" />
          </a>
        )}
        {project.demo && (
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-[#a1a1aa] hover:text-white transition-colors group/btn"
          >
            Demo
            <ExternalLink size={14} className="opacity-50 group-hover/btn:opacity-100" />
          </a>
        )}
        {!project.github && !project.demo && (
          <span className="flex items-center gap-2 text-sm text-[#71717a]">
            Coming Soon
          </span>
        )}
      </div>
    </motion.div>
  );
};

// ============================================
// APPRECIATE SECTION — Real Supabase + Realtime
// ============================================
const AppreciateSection: FC = () => {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);
  const [reaction, setReaction] = useState<string | null>(null);
  const [showThanks, setShowThanks] = useState(false);
  const [loading, setLoading] = useState(true);

  const reactions = [
    { emoji: "👏", label: "Great work" },
    { emoji: "🔥", label: "Impressive" },
    { emoji: "💡", label: "Inspiring" },
    { emoji: "❤️", label: "Love it" },
  ];

  useEffect(() => {
    const saved = localStorage.getItem("asfi_appreciate");
    if (saved) {
      const data = JSON.parse(saved);
      setLiked(!!data.liked);
      setReaction(data.reaction || null);
      if (data.liked || data.reaction) setShowThanks(true);
    }
  }, []);

  useEffect(() => {
    const fetchCount = async () => {
      const { data } = await supabase
        .from('appreciations')
        .select('count')
        .eq('id', 1)
        .single();

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
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const incrementInDatabase = async () => {
    const { data } = await supabase
      .from('appreciations')
      .update({ count: count + 1 })
      .eq('id', 1)
      .select()
      .single();

    if (data) {
      setCount(data.count);
    }
  };

  const handleLike = async () => {
    if (liked) return;

    await incrementInDatabase();
    setLiked(true);
    setShowThanks(true);

    localStorage.setItem(
      "asfi_appreciate",
      JSON.stringify({ liked: true, reaction })
    );

    toast.success("Thank you! It really means a lot ❤️", {
      duration: 3000,
    });
  };

  const handleReaction = async (emoji: string) => {
    const newReaction = emoji;
    setReaction(newReaction);
    setShowThanks(true);

    if (!liked) {
      await incrementInDatabase();
      setLiked(true);

      localStorage.setItem(
        "asfi_appreciate",
        JSON.stringify({ liked: true, reaction: newReaction })
      );
    } else {
      localStorage.setItem(
        "asfi_appreciate",
        JSON.stringify({ liked, reaction: newReaction })
      );
    }

    toast.success(`Thanks for the ${emoji}!`, { duration: 2000 });
  };

  return (
    <section className="section border-y border-[#27272a] bg-[#0a0a0c] py-16 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Heart className="text-[#6366f1]" size={20} />
          <span className="uppercase tracking-[2px] text-xs font-mono text-[#6366f1]">
            APPRECIATE
          </span>
        </div>

        <h2 className="text-white text-3xl tracking-tight mb-3">
          Did you enjoy my portfolio?
        </h2>
        <p className="text-[#a1a1aa] mb-10">
          A small appreciation.
        </p>

        {/* Main Heart Button */}
        <div className="flex flex-col items-center">
          <motion.button
            onClick={handleLike}
            whileTap={{ scale: 0.9 }}
            className={`group relative flex items-center justify-center w-24 h-24 rounded-full border-2 transition-all duration-300 ${
              liked
                ? "border-[#ef4444] bg-[#ef4444]/10"
                : "border-[#27272a] hover:border-[#6366f1]/50 hover:bg-[#111113]"
            }`}
            disabled={liked || loading}
          >
            <motion.div
              animate={{
                scale: liked ? [1, 1.3, 1] : 1,
              }}
              transition={{ duration: 0.4 }}
            >
              <Heart
                size={48}
                className={`transition-all ${liked ? "fill-[#ef4444] text-[#ef4444]" : "text-[#a1a1aa] group-hover:text-white"}`}
              />
            </motion.div>
          </motion.button>

          <div className="mt-4 text-sm min-h-[22px]">
            {loading ? (
              <span className="text-[#71717a]">Loading...</span>
            ) : count === 0 ? (
              <span className="text-[#a1a1aa]">Be the first to appreciate this portfolio</span>
            ) : (
              <>
                <span className="font-mono text-lg text-white">{count}</span>
                <span className="text-[#71717a]"> people have appreciated my portfolio</span>
              </>
            )}
          </div>
        </div>

        {/* Quick Reactions */}
        <div className="mt-10">
          <p className="text-xs uppercase tracking-widest text-[#71717a] mb-4">or quickly react</p>
          <div className="flex flex-wrap justify-center gap-3">
            {reactions.map((r, index) => (
              <button
                key={index}
                onClick={() => handleReaction(r.emoji)}
                disabled={reaction === r.emoji}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl border text-sm transition-all active:scale-[0.985] ${
                  reaction === r.emoji
                    ? "border-[#6366f1] bg-[#6366f1]/10 text-white"
                    : "border-[#27272a] hover:border-[#6366f1]/60 hover:bg-[#111113] text-[#a1a1aa] hover:text-white"
                }`}
              >
                <span className="text-xl">{r.emoji}</span>
                <span>{r.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Thank You Message */}
        {showThanks && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10 text-[#a1a1aa]"
          >
            <p className="text-lg">
              Thank you ❤️
            </p>
            <p className="text-sm mt-1 text-[#71717a]">
              Feel free to reach out if you'd like to collaborate or chat.
            </p>
          </motion.div>
        )}
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
      <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Loading portfolio</h1>
      <p className="mt-4 max-w-sm text-sm leading-6 text-[#a1a1aa]">
        Preparing the latest projects, skills, and story.
      </p>
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
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">Could not load just now</h1>
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

  // Calculate content visibility
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
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Determine if background section should show (combined education/experience)
  const showBackgroundSection = hasEducation || hasExperience;

  return (
    <div className="min-h-screen bg-[#030303] text-[#a1a1aa] overflow-x-hidden relative">
      <AmbientOrbs />
      <div className="relative z-10">
      <Nav
        hasAbout={hasAbout}
        hasEducation={showBackgroundSection}
        hasProjects={hasProjects}
        hasSkills={hasSkills}
        hasCertificates={hasCertificates}
      />

      {/* HERO */}
      {hasHero && (
        <section className="pt-24 pb-16 px-6 max-w-6xl mx-auto">
          <div className="pt-12 pb-8 flex flex-col-reverse md:grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <div className="hero-text-content">
              {isNotEmpty(siteContent?.hero_status) && (
                <div className="inline-flex items-center gap-2 px-4 h-9 rounded-full bg-[#111113] border border-[#27272a] text-sm mb-8">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  {siteContent?.hero_status}
                </div>
              )}

              {isNotEmpty(siteContent?.hero_title) && (
                <h1 className="text-white tracking-[-3.5px] leading-[0.92] mb-6">
                  {siteContent?.hero_title}
                </h1>
              )}

              {isNotEmpty(siteContent?.hero_subtitle) && (
                <p className="max-w-xl text-2xl md:text-[28px] font-light tracking-[-0.6px] text-[#f4f4f5] mb-10">
                  <span dangerouslySetInnerHTML={{ __html: siteContent?.hero_subtitle || '' }} />
                </p>
              )}

              {(hasProjects || hasContact) && (
                <div className="flex flex-wrap gap-4 hero-actions">
                  {hasProjects && (
                    <button
                      onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                      className="btn-primary flex items-center gap-3 px-8 h-14 rounded-2xl text-base font-medium"
                    >
                      View Projects <ArrowRight size={20} />
                    </button>
                  )}
                  {hasContact && (
                    <button
                      onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                      className="btn-secondary flex items-center gap-3 px-8 h-14 rounded-2xl text-base font-medium"
                    >
                      Get in Touch
                    </button>
                  )}
                </div>
              )}

              {/* Social Links */}
              {hasSocials && (
                <div className="flex items-center gap-3 mt-9 hero-socials">
                  {validSocials.map((social, idx) => (
                    <a
                      key={idx}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center h-11 px-5 rounded-2xl border border-[#27272a] hover:border-[#6366f1] hover:text-white transition-all text-sm"
                      aria-label={social.label}
                    >
                      {social.label}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Portrait Photo */}
            <div className="relative flex justify-center md:justify-end mt-8 md:mt-0 hero-portrait">
              <div className="absolute -inset-4 bg-gradient-to-br from-[#6366f1]/20 to-transparent rounded-[3rem] blur-2xl" />
              <motion.img
                src={asfiPortrait}
                alt="Asfi Ahamed"
                className="relative w-[260px] h-[260px] md:w-[320px] md:h-[320px] object-cover object-[50%_30%] rounded-[2.5rem] border border-[#27272a] shadow-2xl grayscale hover:grayscale-0 transition-all duration-500 hover:brightness-110 hover:saturate-125"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
              />
            </div>
          </div>
        </section>
      )}

      {/* ABOUT */}
      {hasAbout && (
        <section id="about" className="section border-t border-[#27272a] bg-[#0a0a0c] py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <User className="text-[#6366f1]" size={20} />
              <span className="uppercase tracking-[2px] text-xs font-mono text-[#6366f1]">ABOUT</span>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Text */}
              <div className="space-y-6">
                {isNotEmpty(siteContent?.about_text) && (
                  <p className="text-2xl leading-tight tracking-tight text-white">
                    <span dangerouslySetInnerHTML={{ __html: siteContent?.about_text || '' }} />
                  </p>
                )}
                <div className="text-[#a1a1aa] space-y-5 leading-relaxed text-[15px]">
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

              {/* Full Photo */}
              <div className="relative">
                <div className="absolute -inset-3 bg-gradient-to-br from-[#6366f1]/10 to-transparent rounded-[2.5rem] blur-2xl" />
                <motion.img
                  src={asfiFull}
                  alt="Asfi Ahamed"
                  className="relative w-full max-w-[520px] mx-auto md:mx-0 rounded-[2.25rem] border border-[#27272a] shadow-xl object-cover md:h-[850px]"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* EDUCATION + EXPERIENCE */}
      {showBackgroundSection && (
        <section id="education" className="section max-w-5xl mx-auto px-6 py-20 border-b border-[#27272a]">
          <div className="flex items-center gap-3 mb-10">
            <GraduationCap className="text-[#6366f1]" size={20} />
            <span className="uppercase tracking-[2px] text-xs font-mono text-[#6366f1]">BACKGROUND</span>
          </div>

          <div className="grid md:grid-cols-2 gap-x-16 gap-y-16">
            {/* Education */}
            {hasEducation && (
              <div>
                <h2 className="text-white text-3xl tracking-tight mb-9">Education</h2>
                <div className="space-y-12">
                  {education.map((item, index) => (
                    <div key={item.id || index} className="timeline-item pl-9">
                      <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-[#6366f1] border-[3px] border-[#030303]" />
                      <div className="text-sm text-[#71717a] mb-1">{item.period}</div>
                      <div className="text-white text-xl font-semibold tracking-tight mb-1">{item.title}</div>
                      <div className="text-[#a1a1aa] mb-3">{item.subtitle}</div>
                      <ul className="space-y-1.5 text-sm">
                        {(item.details || []).map((d, i) => <li key={i} className="pl-1">• {d}</li>)}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Experience */}
            {hasExperience && experience && (
              <div>
                <h2 className="text-white text-3xl tracking-tight mb-9">Experience</h2>
                <div className="timeline-item pl-9">
                  <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-[#6366f1] border-[3px] border-[#030303]" />
                  <div className="text-sm text-[#71717a] mb-1">{experience.period}</div>
                  <div className="text-white text-xl font-semibold tracking-tight mb-1">{experience.title}</div>
                  <div className="text-[#a1a1aa] mb-3">{experience.subtitle}</div>
                  <ul className="space-y-1.5 text-sm">
                    {(experience.details || []).map((d, i) => <li key={i} className="pl-1">• {d}</li>)}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* PROJECTS */}
      {hasProjects && (
        <section id="projects" className="section max-w-6xl mx-auto px-6 py-20">
          <div className="flex-end justify-between mb-10">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Briefcase className="text-[#6366f1]" size={20} />
                <span className="uppercase tracking-[2px] text-xs font-mono text-[#6366f1]">SELECTED WORK</span>
              </div>
              <h2 className="text-white text-4xl tracking-[-1.5px]">Projects</h2>
            </div>
            <p className="hidden md:block max-w-xs text-sm text-[#71717a]">
              A collection of projects spanning AI, full-stack development, and systems programming.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {projects.map((project, index) => (
              <ProjectCard key={project.id || index} project={project} index={index} />
            ))}
          </div>
        </section>
      )}

      {/* SKILLS */}
      {hasSkills && (
        <section id="skills" className="section bg-[#0a0a0c] border-y border-[#27272a] py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-10">
              <Code2 className="text-[#6366f1]" size={20} />
              <span className="uppercase tracking-[2px] text-xs font-mono text-[#6366f1]">EXPERTISE</span>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {Object.entries(
                skills.reduce<Record<string, string[]>>((acc, skill) => {
                  if (!acc[skill.category]) acc[skill.category] = [];
                  acc[skill.category].push(skill.name);
                  return acc;
                }, {})
              ).map(([category, items]) => (
                <div key={category}>
                  <div className="font-semibold text-white tracking-tight mb-5 text-lg">{category}</div>
                  <div className="flex flex-wrap gap-2">
                    {items.map((skill, i) => (
                      <div
                        key={i}
                        className="skill-pill px-4 py-1.5 rounded-2xl border border-[#27272a] text-sm hover:bg-[#6366f1] hover:text-white hover:border-[#6366f1] cursor-default"
                      >
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CERTIFICATES */}
      <CertificatesSection certificates={certificates} />

      {/* APPRECIATE */}
      <AppreciateSection />

      {/* CONTACT */}
      {hasContact && (
        <section id="contact" className="section border-t border-[#27272a] bg-[#0a0a0c] py-20 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-white text-5xl tracking-[-2px] mb-4">Let's work together.</h2>

            <div className="bg-[#111113] border border-[#27272a] rounded-3xl p-10 text-left">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-[#a1a1aa] mb-2.5">Your name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="form-input w-full rounded-2xl px-6 h-14 text-lg placeholder:text-[#52525b]"
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[#a1a1aa] mb-2.5">Email address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="form-input w-full rounded-2xl px-6 h-14 text-lg placeholder:text-[#52525b]"
                      placeholder="you@company.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-[#a1a1aa] mb-2.5">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={6}
                    className="form-input w-full rounded-3xl px-6 py-5 resize-y text-lg placeholder:text-[#52525b]"
                    placeholder="Tell me about your project or opportunity..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full h-14 rounded-2xl flex items-center justify-center gap-3 text-lg font-medium disabled:opacity-70"
                >
                  {isSubmitting ? "Opening email..." : "Send Message"} <ArrowRight size={20} />
                </button>
              </form>

              <div className="mt-8 pt-8 border-t border-[#27272a] flex flex-col sm:flex-row items-center justify-center gap-x-8 gap-y-3 text-sm">
                <button onClick={copyEmail} className="flex items-center gap-2 hover:text-white transition-colors">
                  <Mail size={16} /> muasfiahamed276@gmail.com
                </button>
                <a href="tel:+94781556402" className="flex items-center gap-2 hover:text-white transition-colors">
                  <Phone size={16} /> +94 78 155 6402
                </a>
                <span className="flex items-center gap-2 text-[#71717a]">
                  <MapPin size={16} /> Sri Lanka
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer className="border-t border-[#27272a] py-10 px-6 text-center text-sm text-[#52525b]">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <div>© {new Date().getFullYear()} Asfi Ahamed. All rights reserved.</div>
          <div className="flex items-center gap-5">
            <a href="https://github.com/asfiahamed0404" target="_blank" className="hover:text-[#a1a1aa]">GitHub</a>
            <a href="https://www.linkedin.com/in/asfi-ahamed-baa362347" target="_blank" className="hover:text-[#a1a1aa]">LinkedIn</a>
            <button onClick={copyEmail} className="hover:text-[#a1a1aa]">Email</button>
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

  return (
    <PortfolioContent
      key={retryKey}
      onRetry={() => setRetryKey((currentKey) => currentKey + 1)}
    />
  );
};

export default Home;
