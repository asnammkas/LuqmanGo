import { useState, useRef } from 'react';
import DOMPurify from 'dompurify';
import { useCategories } from '../../context/CategoryContext';
import {
  Plus, Edit2, Trash2, ArrowLeft, Image as ImageIcon,
  LayoutGrid, AlertCircle, Upload, X, Camera, ImagePlus
} from 'lucide-react';
import { Link } from 'react-router-dom';
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

const CategoryManagement = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useCategories();
  const [isEditing, setIsEditing] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', image: '', description: '' });
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleEdit = (category) => {
    setCurrentCategory(category);
    setFormData({ name: category.name, image: category.image || '', description: category.description || '' });
    setIsEditing(true); setUploadError(''); setUploadProgress(0);
  };

  const handleAddNew = () => {
    setCurrentCategory(null);
    setFormData({ name: '', image: '', description: '' });
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
    const sanitizedData = {
      name: DOMPurify.sanitize(formData.name),
      image: formData.image, 
      description: DOMPurify.sanitize(formData.description)
    };
    
    if (currentCategory) { 
      updateCategory(currentCategory.id, sanitizedData); 
    } else { 
      addCategory(sanitizedData); 
    }
    setIsEditing(false);
  };

  /* ── Edit / Add Form ── */
  if (isEditing) {
    return (
      <>
        <div className="admin-page-header">
          <div>
            <button onClick={() => setIsEditing(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '0.6rem', padding: 0, fontFamily: 'inherit' }}>
              <ArrowLeft size={16} /> Back to Categories
            </button>
            <h1>{currentCategory ? 'Edit Category' : 'Add New Category'}</h1>
          </div>
        </div>

        <div className="admin-table-card" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <FormSection icon={<LayoutGrid size={18} color="var(--color-primary)" />} title="Category Details">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                <div>
                  <FieldLabel>Category Name</FieldLabel>
                  <StyledInput required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Home & Living" />
                </div>
                <div>
                  <FieldLabel>Category Description</FieldLabel>
                  <textarea 
                    value={formData.description} 
                    onChange={e => setFormData({ ...formData, description: e.target.value })} 
                    placeholder="e.g. Our curation prioritizes the soil..."
                    className="admin-form-input"
                    style={{ minHeight: '100px', resize: 'vertical' }}
                  />
                </div>
              </div>
            </FormSection>

            <FormSection icon={<ImageIcon size={18} color="var(--color-primary)" />} title="Category Image">
              {uploadError && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '12px', padding: '0.8rem 1rem', marginBottom: '0.9rem', color: '#991B1B', fontSize: '0.82rem', fontWeight: 500 }}>
                  <AlertCircle size={15} /> {uploadError}
                </div>
              )}
              {formData.image ? (
                <div style={{ position: 'relative', marginBottom: '0.9rem' }}>
                  <div style={{ border: '2px solid var(--color-border)', borderRadius: '16px', overflow: 'hidden', backgroundColor: 'var(--color-bg-main)', width: '100%', maxWidth: '240px', margin: '0 auto' }}>
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
                      <h4>Drop your category image</h4>
                      <p style={{ margin: '0 0 1.2rem' }}>JPG, PNG, WebP · 1:1 Aspect Ratio recommended</p>
                      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button type="button" onClick={() => cameraInputRef.current?.click()} className="btn btn-primary" style={{ padding: '0.65rem 1.3rem', fontSize: '0.82rem' }}>
                          <Camera size={16} /> Take Photo
                        </button>
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="btn btn-outline" style={{ padding: '0.65rem 1.3rem', fontSize: '0.82rem', background: 'white' }}>
                          <ImagePlus size={16} /> Gallery
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

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
              <button type="button" onClick={() => setIsEditing(false)} className="btn btn-outline" style={{ background: 'white' }}>
                Discard
              </button>
              <button type="submit" disabled={uploading} className="btn btn-primary">
                {currentCategory ? 'Save Changes' : 'Create Category'}
              </button>
            </div>
          </form>
        </div>
      </>
    );
  }

  /* ── Category List ── */
  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1>Categories</h1>
          <p>{categories.length} storefront categories</p>
        </div>
        <div className="admin-page-actions">
          <button onClick={handleAddNew} className="btn btn-primary">
            <Plus size={16} /> Add Category
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.2rem' }}>
        {categories.map((category, index) => (
          <div key={category.id} className="admin-product-row" style={{ padding: '1.2rem', animationDelay: `${index * 0.05}s` }}>
            <div className="admin-product-thumb" style={{ backgroundColor: 'var(--color-bg-main)' }}>
              {category.image ? (
                <img src={category.image} alt={category.name} style={{ width: '100%', height: '100%', objectFit: 'cover', mixBlendMode: 'multiply' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <LayoutGrid size={24} color="var(--color-text-muted)" />
                </div>
              )}
            </div>

            <div className="admin-product-info">
              <h3 className="admin-product-title">{category.name}</h3>
            </div>

            <div className="admin-product-actions" style={{ flexDirection: 'column', gap: '0.4rem' }}>
              <button title="Edit Category" onClick={() => handleEdit(category)} className="admin-action-btn">
                <Edit2 size={16} />
              </button>
              <button title="Delete Category" onClick={() => { if (window.confirm('Remove this category permanently?')) deleteCategory(category.id); }} className="admin-action-btn danger">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}

        {categories.length === 0 && (
          <div style={{ gridColumn: '1 / -1' }} className="admin-empty-state">
            <AlertCircle size={40} color="var(--color-border)" style={{ marginBottom: '1rem' }} />
            <h2>No categories found</h2>
            <p>Start by adding your first category for the storefront.</p>
            <button onClick={handleAddNew} className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
              <Plus size={16} /> Add First Category
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CategoryManagement;
