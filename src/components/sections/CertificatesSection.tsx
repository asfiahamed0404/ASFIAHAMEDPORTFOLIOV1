import { useState } from 'react';
import type { FC } from 'react';
import { Award, Maximize2, X } from 'lucide-react';
import type { Certificate } from '../../lib/supabase';
import SectionHeading from '../SectionHeading';

interface CertificatesSectionProps {
  certificates: Certificate[];
}

const CertificatesSection: FC<CertificatesSectionProps> = ({ certificates }) => {
  const [selectedCertificateImageUrl, setSelectedCertificateImageUrl] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (certificates.length === 0) return null;

  const openImage = (url: string) => {
    setSelectedCertificateImageUrl(url);
    setIsModalOpen(true);
  };

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
          {certificates.map((cert) => {
            const hasImage = !!cert.image_url;
            return (
              <div
                key={cert.id}
                role={hasImage ? 'button' : undefined}
                tabIndex={hasImage ? 0 : -1}
                onClick={hasImage ? () => openImage(cert.image_url!) : undefined}
                onKeyDown={
                  hasImage
                    ? (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          openImage(cert.image_url!);
                        }
                      }
                    : undefined
                }
                className="cert-card group relative flex flex-col overflow-hidden rounded-2xl card-hover-lift card-glow-top card-shine"
              >
                <div className="cert-card-media">
                  {hasImage ? (
                    <img
                      src={cert.image_url!}
                      alt={cert.name}
                      loading="lazy"
                      className="cert-card-image"
                    />
                  ) : (
                    <div className="cert-card-fallback">
                      <Award size={28} className="text-[#a5b4fc]" />
                    </div>
                  )}
                  {hasImage && (
                    <div className="cert-card-zoom">
                      <Maximize2 size={14} className="text-white" />
                    </div>
                  )}
                </div>
                <div className="cert-card-body">
                  <h3 className="cert-card-title">{cert.name}</h3>
                  <span className="cert-card-issuer">{cert.issuer}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {isModalOpen && selectedCertificateImageUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative bg-[#0d0d10] border border-[#27272a] rounded-3xl p-6 w-full max-w-3xl card-glow-top"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-[#27272a] hover:bg-[#3f3f46] text-white transition-colors z-10"
              aria-label="Close"
            >
              <X size={16} />
            </button>
            <img
              src={selectedCertificateImageUrl}
              alt="Certificate"
              className="max-w-full max-h-[80vh] object-contain rounded-xl border border-[#27272a] mt-2 mx-auto"
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default CertificatesSection;
