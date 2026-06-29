import { GraduationCap } from 'lucide-react';
import type { FC } from 'react';
import { useEducation, useExperience } from '../../hooks/usePortfolioData';

const EducationExperienceSection: FC = () => {
  const { education } = useEducation();
  const { experience } = useExperience();

  const hasEducation = education.length > 0;
  const hasExperience = !!experience;

  if (!hasEducation && !hasExperience) return null;

  return (
    <section className="section max-w-5xl mx-auto px-6 py-20 border-b border-[#27272a]">
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
              {education.map((item) => (
                <div key={item.id} className="timeline-item pl-9">
                  <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-[#6366f1] border-[3px] border-[#030303]" />
                  <div className="text-sm text-[#71717a] mb-1">{item.period}</div>
                  <div className="text-white text-xl font-semibold tracking-tight mb-1">{item.title}</div>
                  <div className="text-[#a1a1aa] mb-3">{item.subtitle}</div>
                  <ul className="space-y-1.5 text-sm">
                    {(item.details || []).map((d, i) => (
                      <li key={i} className="pl-1">• {d}</li>
                    ))}
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
                {(experience.details || []).map((d, i) => (
                  <li key={i} className="pl-1">• {d}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default EducationExperienceSection;
