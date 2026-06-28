import { Award, ExternalLink } from 'lucide-react';
import { useCertificates } from '../../hooks/usePortfolioData';
import { useState } from 'react';
import type { FC } from 'react';

const CertificatesSection: FC = () => {
  const { certificates, loading, error } = useCertificates();
  const [selectedCertificateImageUrl, setSelectedCertificateImageUrl] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (loading) return <div className="text-white">Loading certificates…</div>;
  if (error) return <div className="text-red-400">Failed to load certificates</div>;
  if (certificates.length === 0) return null;

  return (
    <section id="certificates" className="max-w-5xl mx-auto px-6 py-20">
      <div className="flex items-center gap-3 mb-10">
        <Award className="text-[#6366f1]" size={20} />
        <span className="uppercase tracking-[2px] text-xs font-mono text-[#6366f1]">CERTIFICATIONS</span>
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {certificates.map((cert) => (
          <div key={cert.id} className="cert-card bg-[#111113] border border-[#27272a] rounded-3xl px-6 py-6 hover:border-[#6366f1]/60 transition-colors relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <div className="font-medium text-white tracking-tight mb-1">{cert.name}</div>
                <div className="text-sm text-[#71717a]">{cert.issuer}</div>
              </div>
              {cert.image_url && (
                <button
                  onClick={() => {
                    setSelectedCertificateImageUrl(cert.image_url);
                    setIsModalOpen(true);
                  }}
                  className="p-1 rounded-full hover:bg-[#27272a] transition-colors"
                >
                  <ExternalLink size={16} className="text-[#a1a1aa] hover:text-white" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      {/* Modal */}
      {isModalOpen && selectedCertificateImageUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-[#111113] border border-[#27272a] rounded-3xl p-6 w-full max-w-md">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-white text-xl font-semibold">Certificate</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-full hover:bg-[#27272a] transition-colors">
                <ExternalLink size={16} className="text-[#a1a1aa] hover:text-white" />
              </button>
            </div>
            <div className="flex items-center justify-center">
              <img src={selectedCertificateImageUrl} alt="Certificate" className="max-w-full h-auto rounded-xl border border-[#27272a]" />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default CertificatesSection;
