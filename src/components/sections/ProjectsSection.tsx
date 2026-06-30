import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';
import { useRef } from 'react';
import type { FC } from 'react';
import { useProjects } from '../../hooks/usePortfolioData';
import type { Project } from '../../lib/supabase';

const ProjectCard: FC<{ project: Project; index: number }> = ({ project, index }) => (
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
          {/* optional year display */}
          {project.year && <span>{project.year}</span>}
        </div>
      </div>
    </div>
    <p className="text-[#a1a1aa] leading-relaxed flex-1 mb-6">{project.description}</p>
    <div className="flex flex-wrap gap-2 mb-6">
      {(project.tech || []).map((t, i) => (
        <span key={i} className="tech-badge">{t}</span>
      ))}
    </div>
    <div className="flex gap-3 mt-auto pt-4 border-t border-[#27272a]">
      {project.github && (
        <a href={project.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-[#a1a1aa] hover:text-white transition-colors">
          GitHub
        </a>
      )}
      {project.demo && (
        <a href={project.demo} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-[#a1a1aa] hover:text-white transition-colors">
          Demo
        </a>
      )}
      {project.live_website && (
        <a href={project.live_website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-[#a1a1aa] hover:text-white transition-colors">
          Visit Site
        </a>
      )}
    </div>
  </motion.div>
);

const ProjectsSection: FC = () => {
  const { projects, loading, error } = useProjects();
  const sliderRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const scrollAmount = sliderRef.current.offsetWidth; // Scroll by one full card width
      sliderRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (loading) return <div className="text-white">Loading projects…</div>;
  if (error) return <div className="text-red-400">Failed to load projects</div>;

  return (
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
      
      {/* Mobile Slider Container */}
      <div className="relative md:hidden">
        <div 
          ref={sliderRef}
          className="projects-slider"
        >
          {projects.map((project, index) => (
            <div key={project.id} className="projects-slider-card">
              <ProjectCard project={project} index={index} />
            </div>
          ))}
        </div>
        
        {/* Mobile Navigation Arrows */}
        <button 
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-[#111113]/80 border border-[#27272a] text-[#a1a1aa] hover:text-white hover:border-[#6366f1]/50 transition-colors backdrop-blur-sm"
          aria-label="Previous project"
        >
          <span className="text-2xl">‹</span>
        </button>
        <button 
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-[#111113]/80 border border-[#27272a] text-[#a1a1aa] hover:text-white hover:border-[#6366f1]/50 transition-colors backdrop-blur-sm"
          aria-label="Next project"
        >
          <span className="text-2xl">›</span>
        </button>
      </div>

      {/* Desktop Grid */}
      <div className="hidden md:grid md:grid-cols-2 gap-5">
        {projects.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>
    </section>
  );
};

export default ProjectsSection;