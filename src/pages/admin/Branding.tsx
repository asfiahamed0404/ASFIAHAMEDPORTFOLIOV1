import { useState, useEffect } from 'react';
import { supabase, updateSiteContent } from '../../lib/supabase';
import { toast } from 'sonner';
import { useSiteContent } from '../../hooks/usePortfolioData';

// Helper to upload a file to Supabase storage and return public URL
async function uploadFile(file: File, path: string): Promise<string | null> {
  const { error: uploadError } = await supabase.storage.from('branding').upload(path, file, {
    upsert: true,
    cacheControl: '3600',
    contentType: file.type,
  });
  if (uploadError) {
    toast.error(`Upload failed: ${uploadError.message}`);
    return null;
  }
  const { data } = supabase.storage.from('branding').getPublicUrl(path);
  return data?.publicUrl || null;
}

export default function AdminBranding() {
  const { content, loading, error } = useSiteContent();
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [portraitUrl, setPortraitUrl] = useState<string | null>(null);
  const [heroImageUrl, setHeroImageUrl] = useState<string | null>(null);
  const [faviconUrl, setFaviconUrl] = useState<string | null>(null);

  useEffect(() => {
    if (content) {
      setLogoUrl(content.logo_url ?? null);
      setPortraitUrl(content.portrait_url ?? null);
      setHeroImageUrl(content.hero_image_url ?? null);
      setFaviconUrl(content.favicon_url ?? null);
    }
  }, [content]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const path = `${field}/${file.name}`;
    const publicUrl = await uploadFile(file, path);
    if (!publicUrl) return;
    // Update corresponding field in site_content
    const updateData: Record<string, any> = {};
    if (field === 'logo') updateData.logo_url = publicUrl;
    else if (field === 'portrait') updateData.portrait_url = publicUrl;
    else if (field === 'hero_image') updateData.hero_image_url = publicUrl;
    else if (field === 'favicon') updateData.favicon_url = publicUrl;
    try {
      await updateSiteContent(updateData);
      toast.success('Asset saved');
      // Update local state
      if (field === 'logo') setLogoUrl(publicUrl);
      else if (field === 'portrait') setPortraitUrl(publicUrl);
      else if (field === 'hero_image') setHeroImageUrl(publicUrl);
      else if (field === 'favicon') setFaviconUrl(publicUrl);
    } catch (err) {
      toast.error(`Failed to save: ${(err as Error).message}`);
    }
  };

  if (loading) return <div className="admin-loading">Loading branding assets...</div>;

  if (error) {
    return (
      <div className="admin-page">
        <div className="admin-page-header">
          <div>
            <p className="admin-kicker">Visual identity</p>
            <h1 className="admin-page-title">Branding</h1>
          </div>
        </div>
        <div className="admin-error-panel">
          <p className="text-red-300 mb-3">Failed to load branding assets</p>
          <p className="text-sm mb-5 text-[#d4d4d8]">{error}</p>
          <button type="button" onClick={() => window.location.reload()} className="admin-primary-action">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <p className="admin-kicker">Visual identity</p>
          <h1 className="admin-page-title">Branding</h1>
        </div>
      </div>

      <div className="admin-content-panel admin-branding-panel">
        <div className="admin-form-grid admin-form-wide">
        <div className="admin-field">
          <label className="admin-field-label">Website Logo</label>
          {logoUrl && <img src={logoUrl} alt="Logo" className="admin-asset-preview admin-asset-preview-logo" />}
          <input type="file" accept="image/*" onChange={e => handleFileChange(e, 'logo')} className="admin-input cursor-pointer" />
        </div>
        <div className="admin-field">
          <label className="admin-field-label">Profile Portrait</label>
          {portraitUrl && <img src={portraitUrl} alt="Portrait" className="admin-asset-preview admin-asset-preview-portrait" />}
          <input type="file" accept="image/*" onChange={e => handleFileChange(e, 'portrait')} className="admin-input cursor-pointer" />
        </div>
        <div className="admin-field">
          <label className="admin-field-label">Hero Image</label>
          {heroImageUrl && <img src={heroImageUrl} alt="Hero" className="admin-asset-preview admin-asset-preview-hero" />}
          <input type="file" accept="image/*" onChange={e => handleFileChange(e, 'hero_image')} className="admin-input cursor-pointer" />
        </div>
        <div className="admin-field">
          <label className="admin-field-label">Favicon (optional)</label>
          {faviconUrl && <img src={faviconUrl} alt="Favicon" className="admin-asset-preview admin-asset-preview-favicon" />}
          <input type="file" accept="image/*" onChange={e => handleFileChange(e, 'favicon')} className="admin-input cursor-pointer" />
        </div>
      </div>
      </div>
    </div>
  );
}
