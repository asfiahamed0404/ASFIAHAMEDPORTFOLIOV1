import { Code2 } from 'lucide-react';
import { useSkills } from '../../hooks/usePortfolioData';
import type { FC } from 'react';

const SkillsSection: FC = () => {
  const { skills, loading, error } = useSkills();

  if (loading) return <div className="text-white">Loading skills…</div>;
  if (error) return <div className="text-red-400">Failed to load skills</div>;
  if (skills.length === 0) return null;

  // Group skills by category
  const categorized = skills.reduce<Record<string, string[]>>((acc, skill) => {
    acc[skill.category] = acc[skill.category] ?? [];
    acc[skill.category].push(skill.name);
    return acc;
  }, {});

  return (
    <section id="skills" className="section bg-[#0a0a0c] border-y border-[#27272a] py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-10">
          <Code2 className="text-[#6366f1]" size={20} />
          <span className="uppercase tracking-[2px] text-xs font-mono text-[#6366f1]">EXPERTISE</span>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {Object.entries(categorized).map(([category, items]) => (
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
  );
};

export default SkillsSection;
