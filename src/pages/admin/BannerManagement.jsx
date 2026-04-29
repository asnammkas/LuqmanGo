import { useState, useRef } from 'react';
import DOMPurify from 'dompurify';
import { useBanners } from '../../context/BannerContext';
import {
  Plus, Edit2, Trash2, ArrowLeft, Image as ImageIcon,
  Link as LinkIcon, AlertCircle, Upload, X, Camera, ImagePlus, ArrowUp, ArrowDown
} from 'lucide-react';
import { storage } from '../../config/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const FormSection = ({ icon, title, children }) => (
  <div className="admin-form-section">
    <div className="admin-form-section-header">
      <div className="admin-form-section-icon">{icon}</div>
      <h3>{title}</h3>
    </div>
    {children}
  </div>
);

const FieldLabel = ({ children }) => (
  <label className="admin-form-label">{children}</label>
);

const StyledInput = ({ style, ...props }) => (
  <input className="admin-form-input" style={style} {...props} />
);

const BannerManagement = () => {
  const { banners, addBanner, updateBanner, deleteBanner } = useBanners();
  const [isEditing, setIsEditing] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(null);
  const [formData, setFormData] = useState({ title: '', image: '', link: '', order: 0 });
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleEdit = (banner) => {
    setCurrentBanner(banner);
    setFormData({ 
      title: banner.title || '', 
      image: banner.image || '', 
      link: banner.link || '', 
      order: banner.order || 0 
    });
    setIsEditing(true); setUploadError(''); setUploadProgress(0);
  };

  const handleAddNew = () => {
    setCurrentBanner(null);
    const nextOrder = banners.length > 0 ? Math.max(...banners.map(b => b.order || 0)) + 1 : 0;
    setFormData({ title: '', image: '', link: '/', order: nextOrder });
    setIsEditing(true); setUploadError(''); setUploadProgress(0);
  };

  const handleImageUpload = (file) => {
    if (!file) return;
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
    if (!allowedTypes.includes(file.type)) { setUploadError('Please upload a JPG, PNG, or WebP image.'); return; }
    if (file.size > 5 * 1024 * 1024) { setUploadError('Image must be under 5MB.'); return; }
    setUploading(true); setUploadError(''); setUploadProgress(0);
    const fileName = `banners/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on('state_changed',
      (snapshot) => setUploadProgress(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)),
      (error) => { console.error(error); setUploadError('Upload failed. Please try again.'); setUploading(false); },
      async () => {
        try {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          setFormData(p => ({ ...p, image: url })); setUploading(false);
        } catch { setUploadError('Failed to get image URL.'); setUploading(false); }
      }
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const sanitizedData = {
      title: DOMPurify.sanitize(formData.title),
      image: formData.image, 
      link: DOMPurify.sanitize(formData.link),
      order: Number(formData.order)
    };
    
    if (currentBanner) { 
      updateBanner(currentBanner.id, sanitizedData); 
    } else { 
      addBanner(sanitizedData); 
    }
    setIsEditing(false);
  };

  const moveBanner = (index, direction) => {
    if (direction === -1 && index === 0) return;
    if (direction === 1 && index === banners.length - 1) return;
    
    const targetIndex = index + direction;
    const current = banners[index];
    const target = banners[targetIndex];

    // Swap orders
    updateBanner(current.id, { order: target.order || targetIndex });
    updateBanner(target.id, { order: current.order || index });
  };

  /* ── Edit / Add Form ── */
  if (isEditing) {
    return (
      <>
        <div className="admin-page-header">
          <div>
            <button onClick={() => setIsEditing(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '0.6rem', padding: 0, fontFamily: 'inherit' }}>
              <ArrowLeft size={16} /> Back to Banners
            </button>
            <h1>{currentBanner ? 'Edit Banner' : 'Add New Banner'}</h1>
          </div>
        </div>

        <div className="admin-table-card" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            
            <FormSection icon={<ImageIcon size={18} color="var(--color-primary)" />} title="Banner Image">
              {uploadError && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '12px', padding: '0.8rem 1rem', marginBottom: '0.9rem', color: '#991B1B', fontSize: '0.82rem', fontWeight: 500 }}>
                  <AlertCircle size={15} /> {uploadError}
                </div>
              )}
              {formData.image ? (
                <div style={{ position: 'relative', marginBottom: '0.9rem' }}>
                  <div style={{ border: '2px solid var(--color-border)', borderRadius: '16px', overflow: 'hidden', backgroundColor: 'var(--color-bg-main)', width: '100%', maxWidth: '600px', margin: '0 auto' }}>
                    <img src={formData.image} alt="Preview" style={{ width: '100%', aspectRatio: '21/9', objectFit: 'cover', display: 'block' }} onError={e => { e.target.style.display = 'none'; }} />
                  </div>
                  <button type="button" onClick={() => { setFormData(p => ({ ...p, image: '' })); setUploadProgress(0); setUploadError(''); }} style={{ position: 'absolute', top: '0.7rem', right: '0.7rem', width: '30px', height: '30px', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.55)', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div
                  onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
                  onDragLeave={e => { e.preventDefault(); setIsDragOver(false); }}
                  onDrop={e => { e.preventDefault(); setIsDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleImageUpload(f); }}
                  className={`admin-dropzone ${isDragOver ? 'dragover' : ''} ${uploading ? 'admin-dropzone-uploading' : ''}`}
                  style={{ marginBottom: '0.9rem' }}
                >
                  {uploading ? (
                    <div>
                      <div className="admin-dropzone-icon">
                        <Upload size={22} color="var(--color-primary)" />
                      </div>
                      <h4>Uploading… {uploadProgress}%</h4>
                      <div className="admin-upload-progress">
                        <div className="admin-upload-progress-bar" style={{ width: `${uploadProgress}%` }} />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="admin-dropzone-icon">
                        <Upload size={22} color="var(--color-text-muted)" />
                      </div>
                      <h4>Drop your promotional banner image</h4>
                      <p style={{ margin: '0 0 1.2rem' }}>JPG, PNG, WebP · 16:9 or Ultrawide Aspect Ratio recommended</p>
                      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="btn btn-outline" style={{ padding: '0.65rem 1.3rem', fontSize: '0.82rem', background: 'white' }}>
                          <ImagePlus size={16} /> Choose File
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
              <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={e => { const f = e.target.files[0]; if (f) handleImageUpload(f); e.target.value = ''; }} style={{ display: 'none' }} />
              <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={e => { const f = e.target.files[0]; if (f) handleImageUpload(f); e.target.value = ''; }} style={{ display: 'none' }} />
              <div className="admin-url-divider">OR PASTE IMAGE URL</div>
              <StyledInput type="url" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} placeholder="https://…" />
            </FormSection>

            <FormSection icon={<LinkIcon size={18} color="var(--color-primary)" />} title="Banner Details">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                <div>
                  <FieldLabel>Banner Title (Overlay Text)</FieldLabel>
                  <StyledInput type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. SUMMER ESSENTIALS" />
                </div>
                <div>
                  <FieldLabel>Destination Link</FieldLabel>
                  <StyledInput required type="text" value={formData.link} onChange={e => setFormData({ ...formData, link: e.target.value })} placeholder="e.g. /category/Dresses or /stores" />
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.4rem' }}>Where should users go when they click 'Explore Now'?</p>
                </div>
                <div>
                  <FieldLabel>Display Order</FieldLabel>
                  <StyledInput type="number" value={formData.order} onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })} placeholder="0" />
                </div>
              </div>
            </FormSection>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
              <button type="button" onClick={() => setIsEditing(false)} className="btn btn-outline" style={{ background: 'white' }}>
                Discard
              </button>
              <button type="submit" disabled={uploading || !formData.image} className="btn btn-primary">
                {currentBanner ? 'Save Changes' : 'Create Banner'}
              </button>
              {currentBanner && (
                <button 
                  type="button" 
                  onClick={() => { 
                    if (window.confirm('Remove this banner permanently?')) {
                      deleteBanner(currentBanner.id);
                      setIsEditing(false);
                    }
                  }} 
                  className="btn" 
                  style={{ backgroundColor: '#FEF2F2', color: '#991B1B', border: '1px solid #FECACA' }}
                >
                  Delete Banner
                </button>
              )}
            </div>
          </form>
        </div>
      </>
    );
  }

  /* ── Banner List ── */
  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1>Promotional Banners</h1>
          <p>{banners.length} banners in the hero slider</p>
        </div>
        <div className="admin-page-actions">
          <button onClick={handleAddNew} className="btn btn-primary">
            <Plus size={16} /> Add Banner
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.2rem' }}>
        {banners.map((banner, index) => (
          <div key={banner.id} className="admin-product-row" style={{ padding: '1rem', animationDelay: `${index * 0.05}s`, alignItems: 'center' }}>
            
            {/* Order Controls */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', marginRight: '1rem' }}>
              <button 
                onClick={() => moveBanner(index, -1)} 
                disabled={index === 0}
                style={{ background: 'none', border: 'none', cursor: index === 0 ? 'default' : 'pointer', opacity: index === 0 ? 0.3 : 1 }}
              >
                <ArrowUp size={18} />
              </button>
              <button 
                onClick={() => moveBanner(index, 1)} 
                disabled={index === banners.length - 1}
                style={{ background: 'none', border: 'none', cursor: index === banners.length - 1 ? 'default' : 'pointer', opacity: index === banners.length - 1 ? 0.3 : 1 }}
              >
                <ArrowDown size={18} />
              </button>
            </div>

            <div className="admin-product-thumb" style={{ width: '120px', backgroundColor: 'var(--color-bg-main)', borderRadius: '8px', overflow: 'hidden' }}>
              {banner.image ? (
                <img src={banner.image} alt={banner.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ImageIcon size={24} color="var(--color-text-muted)" />
                </div>
              )}
            </div>

            <div className="admin-product-info" style={{ flex: 1, paddingLeft: '1rem' }}>
              <h3 className="admin-product-title">{banner.title || 'Untitled Banner'}</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>Link: {banner.link || '/'}</p>
            </div>

            <div className="admin-product-actions">
              <button title="Edit Banner" onClick={() => handleEdit(banner)} className="admin-action-btn">
                <Edit2 size={16} />
              </button>
              <button title="Delete Banner" onClick={() => { if (window.confirm('Remove this banner permanently?')) deleteBanner(banner.id); }} className="admin-action-btn danger">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}

        {banners.length === 0 && (
          <div className="admin-empty-state">
            <AlertCircle size={40} color="var(--color-border)" style={{ marginBottom: '1rem' }} />
            <h2>No banners found</h2>
            <p>Start by adding your first promotional banner for the homepage.</p>
            <button onClick={handleAddNew} className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
              <Plus size={16} /> Add First Banner
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default BannerManagement;
