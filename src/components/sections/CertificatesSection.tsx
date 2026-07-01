import { Award, ExternalLink, X } from 'lucide-react';
import { useCertificates } from '../../hooks/usePortfolioData';
import { useState } from 'react';
import type { FC } from 'react';
import SectionHeading from '../SectionHeading';

const CertificatesSection: FC = () => {
  const { certificates, loading, error } = useCertificates();
  const [selectedCertificateImageUrl, setSelectedCertificateImageUrl] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (loading) return <div className="text-white text-center py-20">Loading certificates…</div>;
  if (error) return <div className="text-red-400 text-center py-20">Failed to load certificates</div>;
  if (certificates.length === 0) return null;

  return (
    <section id="certificates" className="relative px-6 py-24">
      <div className="absolute inset-x-0 top-0 -z-10 h-px section-divider" />
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          eyebrow="Certifications"
          title="Credentials & courses."
          subtitle="Verified completions from Kaggle, NVIDIA, AWS, and others."
          icon={Award}
        />
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="cert-card group relative bg-[#0d0d10]/70 backdrop-blur-md border border-[#27272a] rounded-3xl px-6 py-7 card-hover-lift card-glow-top card-shine"
            >
              <div className="absolute top-5 right-5">
                <div className="w-9 h-9 rounded-full bg-[#6366f1]/10 border border-[#6366f1]/30 flex items-center justify-center group-hover:bg-[#6366f1]/25 transition-colors">
                  <Award size={16} className="text-[#818cf8]" />
                </div>
              </div>
              <div className="flex flex-col h-full justify-end min-h-[110px]">
                <div className="font-semibold text-white tracking-tight mb-1.5 leading-snug">
                  {cert.name}
                </div>
                <div className="text-xs text-[#818cf8] font-mono uppercase tracking-[1.5px]">
                  {cert.issuer}
                </div>
              </div>
              {cert.image_url && (
                <button
                  onClick={() => {
                    setSelectedCertificateImageUrl(cert.image_url);
                    setIsModalOpen(true);
                  }}
                  className="absolute bottom-4 right-4 p-2 rounded-full bg-[#27272a]/60 hover:bg-[#6366f1]/20 text-[#a1a1aa] hover:text-white transition-all opacity-0 group-hover:opacity-100"
                  aria-label={`View ${cert.name} certificate`}
                >
                  <ExternalLink size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Modal */}
      {isModalOpen && selectedCertificateImageUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative bg-[#0d0d10] border border-[#27272a] rounded-3xl p-6 w-full max-w-lg card-glow-top"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-[#27272a] hover:bg-[#3f3f46] text-white transition-colors"
              aria-label="Close"
            >
              <X size={16} />
            </button>
            <img
              src={selectedCertificateImageUrl}
              alt="Certificate"
              className="max-w-full h-auto rounded-xl border border-[#27272a] mt-2"
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default CertificatesSection;
