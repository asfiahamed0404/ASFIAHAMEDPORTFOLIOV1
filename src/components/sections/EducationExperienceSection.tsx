import { GraduationCap } from 'lucide-react';
import type { FC } from 'react';
import { useEducation, useExperience } from '../../hooks/usePortfolioData';
import SectionHeading from '../SectionHeading';

const EducationExperienceSection: FC = () => {
  const { education } = useEducation();
  const { experience } = useExperience();

  const hasEducation = education.length > 0;
  const hasExperience = !!experience;

  if (!hasEducation && !hasExperience) return null;

  const Block: FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="relative rounded-3xl border border-[#27272a] bg-[#111113]/60 backdrop-blur-md p-8 card-hover-lift card-glow-top">
      <h3 className="text-white text-2xl tracking-tight mb-8 font-semibold">
        <span className="title-gradient">{title}</span>
      </h3>
      <div className="space-y-10">{children}</div>
    </div>
  );

  return (
    <section className="relative px-6 py-24">
      <div className="absolute inset-x-0 top-0 -z-10 h-px section-divider" />
      <div className="max-w-5xl mx-auto">
        <SectionHeading
          eyebrow="Background"
          title="Education & Experience."
          icon={GraduationCap}
          subtitle="A foundation built on academic depth, real-world teaching, and a steady climb into engineering."
        />
        <div className="grid md:grid-cols-2 gap-6">
          {/* Education */}
          {hasEducation && (
            <Block title="Education">
              {education.map((item) => (
                <div key={item.id} className="timeline-item pl-9">
                  <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-[#6366f1] border-[3px] border-[#030303]" />
                  <div className="text-sm text-[#818cf8] mb-1 font-mono">{item.period}</div>
                  <div className="text-white text-xl font-semibold tracking-tight mb-1">{item.title}</div>
                  <div className="text-[#a1a1aa] mb-3">{item.subtitle}</div>
                  <ul className="space-y-1.5 text-sm text-[#d4d4d8]">
                    {(item.details || []).map((d, i) => (
                      <li key={i} className="pl-1">• {d}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </Block>
          )}

          {/* Experience */}
          {hasExperience && experience && (
            <Block title="Experience">
              <div className="timeline-item pl-9">
                <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-[#6366f1] border-[3px] border-[#030303]" />
                <div className="text-sm text-[#818cf8] mb-1 font-mono">{experience.period}</div>
                <div className="text-white text-xl font-semibold tracking-tight mb-1">{experience.title}</div>
                <div className="text-[#a1a1aa] mb-3">{experience.subtitle}</div>
                <ul className="space-y-1.5 text-sm text-[#d4d4d8]">
                  {(experience.details || []).map((d, i) => (
                    <li key={i} className="pl-1">• {d}</li>
                  ))}
                </ul>
              </div>
            </Block>
          )}
        </div>
      </div>
    </section>
  );
};

export default EducationExperienceSection;
