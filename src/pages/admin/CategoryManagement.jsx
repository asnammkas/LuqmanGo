import { useState, useRef } from 'react';
import { useCategories } from '../../context/CategoryContext';
import {
  Plus, Edit2, Trash2, ArrowLeft, Image as ImageIcon,
  LayoutGrid, AlertCircle, Upload, X, Camera, ImagePlus
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { storage } from '../../config/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const FormSection = ({ icon, title, children }) => (
  <div style={{ 
    backgroundColor: 'white', 
    borderRadius: '24px', 
    padding: '2.2rem', 
    border: '1px solid rgba(0,0,0,0.04)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
    marginBottom: '0.5rem'
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', marginBottom: '1.8rem' }}>
      <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#F3F2EE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {icon}
      </div>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1E2A3A', margin: 0, letterSpacing: '-0.01em' }}>{title}</h3>
    </div>
    {children}
  </div>
);

const FieldLabel = ({ children }) => (
  <label style={{ fontSize: '0.65rem', fontWeight: 700, color: '#706F65', letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
    {children}
  </label>
);

const StyledInput = ({ style, ...props }) => (
  <input
    {...props}
    style={{ 
      backgroundColor: '#F9F9F9', 
      border: '1px solid rgba(0,0,0,0.06)', 
      borderRadius: '12px', 
      padding: '1.1rem 1.25rem', 
      width: '100%', 
      fontFamily: 'inherit', 
      fontSize: '0.92rem', 
      color: '#1E2A3A', 
      outline: 'none', 
      boxSizing: 'border-box', 
      transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)', 
      ...style 
    }}
    onFocus={e => { 
      e.target.style.borderColor = '#436132'; 
      e.target.style.backgroundColor = 'white';
      e.target.style.boxShadow = '0 0 0 4px rgba(67,97,50,0.08)'; 
    }}
    onBlur={e => { 
      e.target.style.borderColor = 'rgba(0,0,0,0.06)'; 
      e.target.style.backgroundColor = '#F9F9F9';
      e.target.style.boxShadow = 'none'; 
    }}
  />
);

const CategoryManagement = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useCategories();
  const [isEditing, setIsEditing] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', image: '', isDeals: false });
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleEdit = (category) => {
    setCurrentCategory(category);
    setFormData({ name: category.name, image: category.image || '', isDeals: !!category.isDeals });
    setIsEditing(true); setUploadError(''); setUploadProgress(0);
  };

  const handleAddNew = () => {
    setCurrentCategory(null);
    setFormData({ name: '', image: '', isDeals: false });
    setIsEditing(true); setUploadError(''); setUploadProgress(0);
  };

  const handleImageUpload = (file) => {
    if (!file) return;
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
    if (!allowedTypes.includes(file.type)) { setUploadError('Please upload a JPG, PNG, or WebP image.'); return; }
    if (file.size > 5 * 1024 * 1024) { setUploadError('Image must be under 5MB.'); return; }
    setUploading(true); setUploadError(''); setUploadProgress(0);
    const fileName = `categories/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
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
    if (currentCategory) { 
      updateCategory(currentCategory.id, formData); 
    } else { 
      addCategory(formData); 
    }
    setIsEditing(false);
  };

  /* ── Edit / Add Form ── */
  if (isEditing) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#F7F3ED', paddingBottom: '6rem' }}>
        {/* Form Header */}
        <div style={{
          background: 'linear-gradient(160deg, #1E2A3A 0%, #162030 100%)',
          padding: 'clamp(1.5rem, 4vw, 3rem) clamp(1.2rem, 3vw, 2rem)',
          paddingTop: 'clamp(1.5rem, 4vw, 2.5rem)',
          color: 'white', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '220px', height: '220px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(67,97,50,0.2) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <button onClick={() => setIsEditing(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', marginBottom: '0.6rem', padding: 0, fontFamily: 'inherit' }}>
                <ArrowLeft size={14} /> Back to Categories
              </button>
              <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 800, margin: 0, letterSpacing: '-0.03em', color: 'white' }}>
                {currentCategory ? 'Edit Category' : 'Add New Category'}
              </h1>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <div style={{ borderRadius: '28px 28px 0 0', padding: 'clamp(1.5rem,4vw,2.5rem) clamp(1.2rem,3vw,2rem)', marginTop: '-1.5rem', position: 'relative', zIndex: 2, maxWidth: '820px', margin: '-1.5rem auto 0' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>

            <FormSection icon={<LayoutGrid size={18} color="#001d04" />} title="Category Details">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                  <div>
                    <FieldLabel>Category Name</FieldLabel>
                    <StyledInput required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Home & Living" />
                  </div>
                  <div>
                    <FieldLabel>Status</FieldLabel>
                    <div style={{ height: '3.2rem', display: 'flex', alignItems: 'center', padding: '0 1.1rem', backgroundColor: 'white', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontSize: '0.88rem', width: '100%', color: '#001d04' }}>
                        <input type="checkbox" checked={formData.isDeals} onChange={e => setFormData({ ...formData, isDeals: e.target.checked })} style={{ width: '1.1rem', height: '1.1rem', accentColor: '#001d04', cursor: 'pointer' }} />
                        Mark as Exclusive Deals Type
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </FormSection>

            <FormSection icon={<ImageIcon size={18} color="#001d04" />} title="Category Image">
              {uploadError && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '12px', padding: '0.8rem 1rem', marginBottom: '0.9rem', color: '#991B1B', fontSize: '0.82rem', fontWeight: 500 }}>
                  <AlertCircle size={15} /> {uploadError}
                </div>
              )}
              {formData.image ? (
                <div style={{ position: 'relative', marginBottom: '0.9rem' }}>
                  <div style={{ border: '2px solid rgba(0,29,4,0.07)', borderRadius: '16px', overflow: 'hidden', backgroundColor: '#E8E3D1', width: '100%', maxWidth: '240px', margin: '0 auto' }}>
                    <img src={formData.image} alt="Preview" style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', mixBlendMode: 'multiply', display: 'block' }} onError={e => { e.target.style.display = 'none'; }} />
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
                  style={{ border: `2px dashed ${isDragOver ? '#001d04' : 'rgba(0,29,4,0.15)'}`, borderRadius: '16px', padding: '2rem 1.5rem', backgroundColor: isDragOver ? 'rgba(0,29,4,0.03)' : 'rgba(255,255,255,0.5)', textAlign: 'center', cursor: 'default', transition: 'all 0.2s', marginBottom: '0.9rem' }}
                >
                  {uploading ? (
                    <div>
                      <div style={{ width: '52px', height: '52px', borderRadius: '50%', backgroundColor: '#E4EDDB', margin: '0 auto 0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Upload size={22} color="#436132" />
                      </div>
                      <p style={{ fontSize: '0.88rem', fontWeight: 600, color: '#001d04', marginBottom: '0.8rem' }}>Uploading… {uploadProgress}%</p>
                      <div style={{ width: '75%', maxWidth: '240px', margin: '0 auto', height: '5px', borderRadius: '99px', backgroundColor: 'rgba(0,29,4,0.08)', overflow: 'hidden' }}>
                        <div style={{ height: '100%', borderRadius: '99px', backgroundColor: '#436132', width: `${uploadProgress}%`, transition: 'width 0.3s ease' }} />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div style={{ width: '52px', height: '52px', borderRadius: '50%', backgroundColor: 'white', margin: '0 auto 0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                        <Upload size={22} color="#706F65" />
                      </div>
                      <p style={{ fontSize: '0.92rem', fontWeight: 600, color: '#001d04', marginBottom: '0.25rem' }}>Drop your category image</p>
                      <p style={{ fontSize: '0.78rem', color: '#706F65', margin: '0 0 1.2rem' }}>JPG, PNG, WebP · 1:1 Aspect Ratio recommended</p>
                      {/* Dual upload buttons: Camera + Gallery */}
                      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          onClick={() => cameraInputRef.current?.click()}
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.45rem',
                            padding: '0.65rem 1.3rem',
                            backgroundColor: '#1E2A3A', color: 'white',
                            border: 'none', borderRadius: '12px',
                            fontSize: '0.82rem', fontWeight: 600, fontFamily: 'inherit',
                            cursor: 'pointer', transition: 'all 0.2s',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#2a3d52'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                          onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#1E2A3A'; e.currentTarget.style.transform = 'translateY(0)'; }}
                        >
                          <Camera size={16} /> Take Photo
                        </button>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.45rem',
                            padding: '0.65rem 1.3rem',
                            backgroundColor: 'white', color: '#1E2A3A',
                            border: '1px solid rgba(0,0,0,0.12)', borderRadius: '12px',
                            fontSize: '0.82rem', fontWeight: 600, fontFamily: 'inherit',
                            cursor: 'pointer', transition: 'all 0.2s',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = '#436132'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.12)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                        >
                          <ImagePlus size={16} /> Gallery
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
              {/* Hidden file inputs: one for camera capture, one for gallery */}
              <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={e => { const f = e.target.files[0]; if (f) handleImageUpload(f); e.target.value = ''; }} style={{ display: 'none' }} />
              <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={e => { const f = e.target.files[0]; if (f) handleImageUpload(f); e.target.value = ''; }} style={{ display: 'none' }} />
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '0.62rem', fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.12em', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Or Paste Image URL</p>
                <StyledInput type="url" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} placeholder="https://…" style={{ fontSize: '0.82rem' }} />
              </div>
            </FormSection>

            {/* Form Actions */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', paddingBottom: '3rem', marginTop: '1rem' }}>
              <button type="button" onClick={() => setIsEditing(false)} style={{ padding: '0.95rem 2rem', background: 'white', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '16px', fontWeight: 600, color: '#706F65', cursor: 'pointer', fontSize: '0.9rem', fontFamily: 'inherit', transition: 'all 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                Discard
              </button>
              <button type="submit" disabled={uploading} style={{ padding: '0.95rem 2.8rem', backgroundColor: '#1E2A3A', color: 'white', borderRadius: '16px', fontWeight: 700, border: 'none', cursor: uploading ? 'not-allowed' : 'pointer', opacity: uploading ? 0.6 : 1, fontSize: '0.9rem', fontFamily: 'inherit', transition: 'all 0.2s' }}>
                {currentCategory ? 'Save Changes' : 'Create Category'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  /* ── Category List ── */
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F7F3ED', paddingBottom: '6rem' }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(160deg, #1E2A3A 0%, #162030 100%)',
        padding: 'clamp(1.5rem, 4vw, 3rem) clamp(1.2rem, 3vw, 2rem)',
        paddingTop: 'clamp(1.5rem, 4vw, 2.5rem)',
        color: 'white', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '220px', height: '220px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(67,97,50,0.25) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
            <Link to="/admin" style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', textDecoration: 'none' }}>
              ← Dashboard
            </Link>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            <div>
              <h1 style={{ fontSize: 'clamp(1.9rem, 5vw, 2.6rem)', fontWeight: 800, margin: '0 0 0.25rem', letterSpacing: '-0.03em', color: 'white' }}>Categories</h1>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem', margin: 0 }}>{categories.length} storefront categories</p>
            </div>
            <button onClick={handleAddNew} style={{
              display: 'flex', alignItems: 'center', gap: '0.45rem',
              padding: '0.6rem 1.2rem',
              backgroundColor: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '100px',
              color: 'white',
              fontSize: '0.8rem', fontWeight: 600,
              textDecoration: 'none',
              transition: 'all 0.2s ease',
              backdropFilter: 'blur(10px)',
              cursor: 'pointer',
              fontFamily: 'inherit'
            }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'; }}
            >
              <Plus size={16} /> Add Category
            </button>
          </div>
        </div>
      </div>

      {/* Category Cards Grid */}
      <div style={{ backgroundColor: '#F7F3ED', borderRadius: '28px 28px 0 0', padding: 'clamp(1.2rem,3vw,2rem)', marginTop: '-1.5rem', position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.2rem' }}>
          {categories.map((category, index) => (
            <div
              key={category.id}
              style={{
                backgroundColor: 'white', borderRadius: '20px',
                padding: '1.2rem', display: 'flex', alignItems: 'center', gap: '1rem',
                border: '1px solid rgba(0,0,0,0.04)',
                animation: `cardEntrance 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) ${index * 0.05}s backwards`,
                transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.07)'; e.currentTarget.style.borderColor = 'rgba(67,97,50,0.15)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.04)'; }}
            >
              {/* Thumbnail */}
              <div style={{ width: '70px', height: '70px', borderRadius: '16px', overflow: 'hidden', flexShrink: 0, backgroundColor: '#E8E3D1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {category.image ? (
                  <img src={category.image} alt={category.name} style={{ width: '108%', height: '108%', objectFit: 'cover', mixBlendMode: 'multiply' }} />
                ) : (
                  <LayoutGrid size={24} color="#afaa9a" />
                )}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#001d04', margin: '0 0 0.35rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {category.name}
                </h3>
                {category.isDeals && (
                  <span style={{ display: 'inline-flex', fontSize: '0.65rem', fontWeight: 700, padding: '0.2rem 0.6rem', backgroundColor: '#FEF9C3', color: '#A16207', borderRadius: '100px' }}>
                    Deals Section
                  </span>
                )}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flexShrink: 0 }}>
                <button title="Edit Category" onClick={() => handleEdit(category)} style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: '#F3F2EE', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background-color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#E4EDDB'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = '#F3F2EE'}
                >
                  <Edit2 size={13} color="#001d04" />
                </button>
                <button title="Delete Category" onClick={() => { if (window.confirm('Remove this category permanently? Products using it will still keep their text category label.')) deleteCategory(category.id); }} style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: '#FEF2F2', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background-color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#FEE2E2'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = '#FEF2F2'}
                >
                  <Trash2 size={13} color="#EF4444" />
                </button>
              </div>
            </div>
          ))}

          {categories.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '5rem 1.5rem', backgroundColor: 'white', borderRadius: '24px', border: '2px dashed rgba(0,0,0,0.08)' }}>
              <AlertCircle size={40} color="#D4CFC5" style={{ marginBottom: '1rem' }} />
              <h2 style={{ fontSize: '1.2rem', color: '#001d04', marginBottom: '0.4rem' }}>No categories found</h2>
              <p style={{ color: '#706F65', marginBottom: '1.5rem', fontSize: '0.88rem' }}>Start by adding your first category for the storefront.</p>
              <button onClick={handleAddNew} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.8rem', backgroundColor: '#001d04', color: 'white', border: 'none', borderRadius: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.9rem' }}>
                <Plus size={16} /> Add First Category
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryManagement;
