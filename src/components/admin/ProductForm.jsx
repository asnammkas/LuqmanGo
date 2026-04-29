import React, { useState, useRef, useMemo, useEffect } from 'react';
import DOMPurify from 'dompurify';
import { useProducts } from '../../context/ProductContext';
import { useCategories } from '../../context/CategoryContext';
import { ArrowLeft, LayoutGrid, DollarSign, ImageIcon, AlertCircle, X, Upload, Camera, ImagePlus, ChevronDown, Search, Plus } from 'lucide-react';
import { storage } from '../../config/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import styles from '../../pages/admin/ProductManagement.module.css';

const FormSection = ({ icon, title, children }) => (
  <div className={styles.formSection}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', marginBottom: '1.8rem' }}>
      <div className={styles.formSectionIcon}>{icon}</div>
      <h3 className={styles.formSectionTitle}>{title}</h3>
    </div>
    {children}
  </div>
);

const FieldLabel = ({ children }) => (
  <label className={styles.fieldLabel}>{children}</label>
);

const ProductForm = ({ currentProduct, onClose }) => {
  const { addProduct, updateProduct } = useProducts();
  const { categories: contextCategories, addCategory: addCatToContext } = useCategories();

  const [formData, setFormData] = useState(
    currentProduct 
    ? { ...currentProduct, price: currentProduct.price.toString(), stock: currentProduct.stock.toString() }
    : { title: '', price: '', category: '', description: '', image: '', stock: '', featured: false }
  );

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const [catOpen, setCatOpen] = useState(false);
  const [catSearch, setCatSearch] = useState('');
  const catRef = useRef(null);

  const existingCategories = useMemo(() => {
    const cats = [...new Set(contextCategories.map(c => c.name).filter(Boolean))];
    return cats.sort((a, b) => a.localeCompare(b));
  }, [contextCategories]);

  const filteredCategories = useMemo(() => {
    if (!catSearch.trim()) return existingCategories;
    return existingCategories.filter(c => c.toLowerCase().includes(catSearch.toLowerCase()));
  }, [existingCategories, catSearch]);

  const isNewCategory = catSearch.trim() && !existingCategories.some(c => c.toLowerCase() === catSearch.trim().toLowerCase());

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (catRef.current && !catRef.current.contains(e.target)) setCatOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectCategory = (cat) => {
    setFormData(prev => ({ ...prev, category: cat }));
    setCatSearch('');
    setCatOpen(false);
  };

  const addNewCategory = () => {
    const trimmed = catSearch.trim();
    if (trimmed) {
      setFormData(prev => ({ ...prev, category: trimmed }));
      addCatToContext({ name: trimmed, image: '', isDeals: false });
      setCatSearch('');
      setCatOpen(false);
    }
  };

  const handleImageUpload = (file) => {
    if (!file) return;
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
    if (!allowedTypes.includes(file.type)) { setUploadError('Please upload a JPG, PNG, or WebP image.'); return; }
    if (file.size > 5 * 1024 * 1024) { setUploadError('Image must be under 5MB.'); return; }
    
    setUploading(true); 
    setUploadError(''); 
    setUploadProgress(0);
    
    const fileName = `products/${Date.now()}_${(file.name || 'image.jpg').replace(/[^a-zA-Z0-9.]/g, '_')}`;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    
    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = snapshot.totalBytes > 0 ? Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100) : 0;
        setUploadProgress(progress);
      },
      (error) => { 
        console.error('Upload error:', error); 
        setUploadError('Upload failed. Please try again.'); 
        setUploading(false); 
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then((url) => {
            setFormData(p => ({ ...p, image: url }));
            setUploading(false);
          })
          .catch((err) => {
            console.error('Download URL error:', err);
            setUploadError('Failed to get image URL.');
            setUploading(false);
          });
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setUploadError('');
    try {
      const productData = { 
        ...formData, 
        title: DOMPurify.sanitize(formData.title),
        category: DOMPurify.sanitize(formData.category),
        description: DOMPurify.sanitize(formData.description),
        price: parseFloat(formData.price), 
        stock: parseInt(formData.stock, 10) 
      };
      if (currentProduct) { 
        await updateProduct(currentProduct.id, productData); 
      } else { 
        await addProduct(productData); 
      }
      onClose();
    } catch (err) {
      console.error("Submit Error:", err);
      setUploadError(err?.message || 'Failed to publish item. Please check permissions or try again.');
      setUploading(false);
    }
  };

  return (
    <>
      <div className="admin-page-header">
        <div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '0.6rem', padding: 0, fontFamily: 'inherit' }}>
            <ArrowLeft size={16} /> Back to Catalog
          </button>
          <h1>{currentProduct ? 'Edit Product' : 'Add New Item'}</h1>
          <p>Catalog Entry #{currentProduct?.id?.substring(0, 8) || 'New'}</p>
        </div>
        {formData.image && (
          <div style={{ width: '64px', height: '64px', borderRadius: '16px', overflow: 'hidden', border: '2px solid var(--color-border)', flexShrink: 0 }}>
            <img src={formData.image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}
      </div>

      <div className="admin-table-card" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <FormSection icon={<LayoutGrid size={18} color="#001d04" />} title="General Details">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div>
                <FieldLabel>Product Title</FieldLabel>
                <input required type="text" className={styles.styledInput} value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Handcrafted Ceramic Vase" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                <div ref={catRef} style={{ position: 'relative' }}>
                  <FieldLabel>Category</FieldLabel>
                  <div
                    onClick={() => setCatOpen(!catOpen)}
                    className={styles.comboboxTrigger}
                    style={{
                      backgroundColor: catOpen ? 'white' : '#F9F9F9',
                      border: catOpen ? '1px solid #436132' : '1px solid rgba(0,0,0,0.06)',
                      borderRadius: catOpen ? '12px 12px 0 0' : '12px',
                      boxShadow: catOpen ? '0 0 0 4px rgba(67,97,50,0.08)' : 'none',
                    }}
                  >
                    <span style={{ fontSize: '0.92rem', color: formData.category ? '#1E2A3A' : '#9CA3AF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {formData.category || 'Select or type category…'}
                    </span>
                    <ChevronDown size={16} color="#706F65" style={{ transition: 'transform 0.2s', transform: catOpen ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }} />
                  </div>
                  <input type="text" required value={formData.category} onChange={() => {}} tabIndex={-1} style={{ position: 'absolute', opacity: 0, height: 0, width: 0, pointerEvents: 'none' }} />

                  {catOpen && (
                    <div className={styles.dropdownPanel}>
                      <div style={{ padding: '0.6rem 0.8rem', borderBottom: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Search size={14} color="#9CA3AF" style={{ flexShrink: 0 }} />
                        <input
                          autoFocus type="text" value={catSearch} onChange={e => setCatSearch(e.target.value)} placeholder="Search or type new…"
                          onClick={e => e.stopPropagation()} style={{ border: 'none', outline: 'none', fontSize: '0.85rem', color: '#1E2A3A', width: '100%', background: 'transparent', fontFamily: 'inherit' }}
                        />
                      </div>
                      <div style={{ overflowY: 'auto', maxHeight: '180px', padding: '0.3rem 0' }}>
                        {filteredCategories.map(cat => (
                          <div
                            key={cat} onClick={(e) => { e.stopPropagation(); selectCategory(cat); }}
                            style={{
                              padding: '0.6rem 1rem', fontSize: '0.88rem', cursor: 'pointer',
                              color: formData.category === cat ? '#436132' : '#1E2A3A', fontWeight: formData.category === cat ? 700 : 400,
                              backgroundColor: formData.category === cat ? 'rgba(67,97,50,0.06)' : 'transparent', transition: 'background-color 0.15s',
                              display: 'flex', alignItems: 'center', gap: '0.5rem',
                            }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(67,97,50,0.08)'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = formData.category === cat ? 'rgba(67,97,50,0.06)' : 'transparent'}
                          >
                            {cat}
                          </div>
                        ))}
                        {isNewCategory && (
                          <div
                            onClick={(e) => { e.stopPropagation(); addNewCategory(); }}
                            style={{
                              padding: '0.65rem 1rem', fontSize: '0.85rem', cursor: 'pointer', color: '#436132', fontWeight: 600,
                              borderTop: filteredCategories.length ? '1px solid rgba(0,0,0,0.06)' : 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'background-color 0.15s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(67,97,50,0.08)'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            <Plus size={14} /> Add "{catSearch.trim()}"
                          </div>
                        )}
                        {filteredCategories.length === 0 && !isNewCategory && (
                          <div style={{ padding: '1rem', textAlign: 'center', color: '#9CA3AF', fontSize: '0.82rem' }}>No categories found</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <FieldLabel>Status</FieldLabel>
                  <div style={{ height: '3.2rem', display: 'flex', alignItems: 'center', padding: '0 1.1rem', backgroundColor: 'white', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '12px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontSize: '0.88rem', width: '100%', color: '#001d04' }}>
                      <input type="checkbox" checked={formData.featured} onChange={e => setFormData({ ...formData, featured: e.target.checked })} style={{ width: '1.1rem', height: '1.1rem', accentColor: '#001d04', cursor: 'pointer' }} />
                      Feature on Homepage
                    </label>
                  </div>
                </div>
              </div>
              <div>
                <FieldLabel>Product Description</FieldLabel>
                <textarea
                  required rows={4} className={styles.styledInput} style={{ resize: 'none' }} value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>
          </FormSection>

          <FormSection icon={<DollarSign size={18} color="#001d04" />} title="Pricing & Inventory">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              <div>
                <FieldLabel>Retail Price (LKR)</FieldLabel>
                <input required type="number" step="0.01" min="0" className={styles.styledInput} value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} placeholder="0.00" />
              </div>
              <div>
                <FieldLabel>Stock Available</FieldLabel>
                <input required type="number" min="0" className={styles.styledInput} value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} placeholder="0" />
              </div>
            </div>
          </FormSection>

          <FormSection icon={<ImageIcon size={18} color="#001d04" />} title="Product Media">
            {uploadError && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '12px', padding: '0.8rem 1rem', marginBottom: '0.9rem', color: '#991B1B', fontSize: '0.82rem', fontWeight: 500 }}>
                <AlertCircle size={15} /> {uploadError}
              </div>
            )}
            {formData.image ? (
              <div style={{ position: 'relative', marginBottom: '0.9rem' }}>
                <div style={{ border: '2px solid rgba(0,29,4,0.07)', borderRadius: '16px', overflow: 'hidden', backgroundColor: 'white' }}>
                  <img src={formData.image} alt="Preview" style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }} onError={e => { e.target.style.display = 'none'; }} />
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
                    <p style={{ fontSize: '0.92rem', fontWeight: 600, color: '#001d04', marginBottom: '0.25rem' }}>Drop your image here</p>
                    <p style={{ fontSize: '0.78rem', color: '#706F65', margin: '0 0 1.2rem' }}>JPG, PNG, WebP · Max 5MB</p>
                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                      <button type="button" onClick={() => cameraInputRef.current?.click()} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.65rem 1.3rem', backgroundColor: '#1E2A3A', color: 'white', border: 'none', borderRadius: '12px', fontSize: '0.82rem', fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer', transition: 'all 0.2s' }}>
                        <Camera size={16} /> Take Photo
                      </button>
                      <button type="button" onClick={() => fileInputRef.current?.click()} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.65rem 1.3rem', backgroundColor: 'white', color: '#1E2A3A', border: '1px solid rgba(0,0,0,0.12)', borderRadius: '12px', fontSize: '0.82rem', fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer', transition: 'all 0.2s' }}>
                        <ImagePlus size={16} /> Gallery
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={e => { const f = e.target.files[0]; if (f) handleImageUpload(f); e.target.value = ''; }} style={{ display: 'none' }} />
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={e => { const f = e.target.files[0]; if (f) handleImageUpload(f); e.target.value = ''; }} style={{ display: 'none' }} />
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '0.62rem', fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.12em', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Or Paste Image URL</p>
              <input type="url" className={styles.styledInput} value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} placeholder="https://…" style={{ fontSize: '0.82rem' }} />
            </div>
          </FormSection>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', paddingBottom: '3rem', marginTop: '1rem' }}>
            <button type="button" onClick={onClose} className={styles.btnSecondary}>Discard</button>
            <button type="submit" disabled={uploading} className={styles.btnPrimary}>
              {currentProduct ? 'Save Changes' : 'Publish Item'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ProductForm;
