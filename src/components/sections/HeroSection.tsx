import { motion } from 'framer-motion';
import type { FC } from 'react';

interface HeroSectionProps {
  heroTitle?: string | null;
  heroSubtitle?: string | null;
  heroStatus?: string | null;
  portraitUrl?: string | null;
  fallbackPortrait: string;


}

const HeroSection: FC<HeroSectionProps> = ({
  heroTitle,
  heroSubtitle,
  heroStatus,
  portraitUrl,
  fallbackPortrait,
}) => {
  // Fallback text values if content is missing
  const title = heroTitle ?? 'Hi, I’m Asfi Ahamed';
  const subtitle = heroSubtitle ?? 'Computer Science & Engineering Student';
  const status = heroStatus ?? '';

  return (
    <section className="pt-24 pb-16 px-6 max-w-6xl mx-auto">
      <div className="pt-12 pb-8 grid md:grid-cols-2 gap-12 items-center">
        {/* Left side – text */}
        <div>
          {status && (
            <div className="inline-flex items-center gap-2 px-4 h-9 rounded-full bg-[#111113] border border-[#27272a] text-sm mb-8">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {status}
            </div>
          )}
          <h1 className="text-white tracking-[-3.5px] leading-[0.92] mb-6">{title}</h1>
          {subtitle && (
            <p className="max-w-xl text-2xl md:text-[28px] font-light tracking-[-0.6px] text-[#f4f4f5] mb-10">
              <span dangerouslySetInnerHTML={{ __html: subtitle }} />
            </p>
          )}
        </div>

        {/* Right side – portrait */}
        <div className="relative flex justify-center md:justify-end mt-8 md:mt-0">
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-br from-[#6366f1]/20 to-transparent rounded-[3rem] blur-2xl" />
            <motion.img
              src={portraitUrl || fallbackPortrait}
              alt="Asfi Ahamed"
              className="relative w-[260px] h-[260px] md:w-[320px] md:h-[320px] object-cover object-[50%_30%] rounded-[2.5rem] border border-[#27272a] shadow-2xl"
              loading="lazy"
              width={320}
              height={320}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
