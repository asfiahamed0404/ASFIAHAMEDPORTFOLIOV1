import { Mail, Phone, MapPin, Send, Sparkles } from 'lucide-react';
import { useSiteContent } from '../../hooks/usePortfolioData';
import { useState } from 'react';
import { toast } from 'sonner';
import type { FC } from 'react';
import SectionHeading from '../SectionHeading';

const ContactSection: FC = () => {
  const { content: siteContent } = useSiteContent();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const copyEmail = () => {
    navigator.clipboard.writeText('muasfiahamed276@gmail.com');
    toast.success('Email copied to clipboard');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

  if (!siteContent) return null;
  if (!siteContent.contact_intro) return null;

  return (
    <section id="contact" className="relative px-6 py-28 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[#0a0a0c]" />
      <div className="absolute inset-x-0 top-0 -z-10 h-px section-divider" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(168,85,247,0.18),transparent_60%)] pointer-events-none" />
      <div className="max-w-3xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 h-9 rounded-full bg-[#6366f1]/10 border border-[#6366f1]/30 text-[#818cf8] text-sm font-medium mb-8">
          <Sparkles size={14} />
          Let&apos;s connect
        </div>
        <SectionHeading
          eyebrow="Contact"
          title="Let's work together."
          subtitle={siteContent.contact_intro}
          icon={Mail}
          align="center"
        />
        <div className="relative bg-[#0d0d10]/80 border border-[#27272a] rounded-3xl p-8 md:p-10 text-left card-glow-top backdrop-blur-md">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs text-[#a1a1aa] mb-2.5 font-mono uppercase tracking-[2px]">
                  Your name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="form-field w-full rounded-2xl px-6 h-14 text-base placeholder:text-[#52525b]"
                  placeholder="Jane Doe"
                />
              </div>
              <div>
                <label className="block text-xs text-[#a1a1aa] mb-2.5 font-mono uppercase tracking-[2px]">
                  Email address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-field w-full rounded-2xl px-6 h-14 text-base placeholder:text-[#52525b]"
                  placeholder="you@company.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-[#a1a1aa] mb-2.5 font-mono uppercase tracking-[2px]">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={6}
                className="form-field w-full rounded-2xl px-6 py-5 resize-y text-base placeholder:text-[#52525b]"
                placeholder="Tell me about your project or opportunity..."
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full h-14 rounded-2xl flex items-center justify-center gap-3 text-base font-medium disabled:opacity-70"
            >
              {isSubmitting ? 'Opening email...' : 'Send Message'} <Send size={18} />
            </button>
          </form>
          <div className="mt-8 pt-8 border-t border-[#27272a] flex flex-col sm:flex-row items-center justify-center gap-x-8 gap-y-3 text-sm">
            <button
              onClick={copyEmail}
              className="flex items-center gap-2 text-[#a1a1aa] hover:text-white transition-colors"
            >
              <Mail size={16} /> muasfiahamed276@gmail.com
            </button>
            <a href="tel:+94781556402" className="flex items-center gap-2 text-[#a1a1aa] hover:text-white transition-colors">
              <Phone size={16} /> +94 78 155 6402
            </a>
            <span className="flex items-center gap-2 text-[#71717a]">
              <MapPin size={16} /> Sri Lanka
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
