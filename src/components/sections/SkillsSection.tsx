import { Code2 } from 'lucide-react';
import { useSkills } from '../../hooks/usePortfolioData';
import type { FC } from 'react';
import SectionHeading from '../SectionHeading';

const SkillsSection: FC = () => {
  const { skills, loading, error } = useSkills();

  if (loading) return <div className="text-white text-center py-20">Loading skills…</div>;
  if (error) return <div className="text-red-400 text-center py-20">Failed to load skills</div>;
  if (skills.length === 0) return null;

  // Group skills by category
  const categorized = skills.reduce<Record<string, string[]>>((acc, skill) => {
    acc[skill.category] = acc[skill.category] ?? [];
    acc[skill.category].push(skill.name);
    return acc;
  }, {});

  return (
    <section id="skills" className="relative px-6 py-24 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[#0a0a0c]" />
      <div className="absolute inset-x-0 top-0 -z-10 h-px section-divider" />
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          eyebrow="Expertise"
          title="Skills & tech."
          subtitle="The languages, frameworks, and tools I reach for most often."
          icon={Code2}
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {Object.entries(categorized).map(([category, items]) => (
            <div
              key={category}
              className="group relative rounded-3xl border border-[#27272a] bg-[#111113]/70 backdrop-blur-md p-7 card-hover-lift card-glow-top card-shine"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="font-semibold text-white tracking-tight text-lg">
                  <span className="title-gradient">{category}</span>
                </div>
                <div className="text-xs font-mono text-[#71717a]">
                  {String(items.length).padStart(2, '0')}
                </div>
              </div>
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
  );
};

export default SkillsSection;
