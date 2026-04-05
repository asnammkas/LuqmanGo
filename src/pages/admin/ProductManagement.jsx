import { useState, useRef, useEffect, useMemo } from 'react';
import { useProducts } from '../../context/ProductContext';
import { useCategories } from '../../context/CategoryContext';
import {
  Plus, Edit2, Trash2, ArrowLeft, Image as ImageIcon,
  LayoutGrid, DollarSign, Package, AlertCircle, Upload, X, Star,
  Camera, ImagePlus, ChevronDown, Search
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { storage } from '../../config/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

/* ── Helpers ── */
const getStockConfig = (stock) => {
  if (stock === 0)    return { label: 'Out of Stock', bg: '#FEE2E2', color: '#B91C1C', dot: '#EF4444' };
  if (stock <= 5)     return { label: `Low — ${stock}`,  bg: '#FEF9C3', color: '#A16207', dot: '#EAB308' };
  return               { label: `${stock} in stock`,     bg: '#DCFCE7', color: '#15803D', dot: '#22C55E' };
};

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

const ProductManagement = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { categories: contextCategories, addCategory: addCatToContext } = useCategories();

  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [formData, setFormData] = useState({ title: '', price: '', category: '', description: '', image: '', stock: '', featured: false });
  const [filterCategory, setFilterCategory] = useState('All');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  // ── Category Combobox State ──
  const [catOpen, setCatOpen] = useState(false);
  const [catSearch, setCatSearch] = useState('');
  const catRef = useRef(null);

  // Derive unique categories from context
  const existingCategories = useMemo(() => {
    const cats = [...new Set(contextCategories.map(c => c.name).filter(Boolean))];
    return cats.sort((a, b) => a.localeCompare(b));
  }, [contextCategories]);

  // Filtered categories based on search input
  const filteredCategories = useMemo(() => {
    if (!catSearch.trim()) return existingCategories;
    return existingCategories.filter(c => c.toLowerCase().includes(catSearch.toLowerCase()));
  }, [existingCategories, catSearch]);

  // Check if the typed value is a brand-new category
  const isNewCategory = catSearch.trim() && !existingCategories.some(c => c.toLowerCase() === catSearch.trim().toLowerCase());

  // Close dropdown on outside click
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

  const handleEdit = (product) => {
    setCurrentProduct(product);
    setFormData({ ...product, price: product.price.toString(), stock: product.stock.toString() });
    setIsEditing(true); setUploadError(''); setUploadProgress(0);
  };

  const handleAddNew = () => {
    setCurrentProduct(null);
    setFormData({ title: '', price: '', category: '', description: '', image: '', stock: '', featured: false });
    setIsEditing(true); setUploadError(''); setUploadProgress(0);
  };

  const handleImageUpload = (file) => {
    if (!file) return;
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
    if (!allowedTypes.includes(file.type)) { setUploadError('Please upload a JPG, PNG, or WebP image.'); return; }
    if (file.size > 5 * 1024 * 1024) { setUploadError('Image must be under 5MB.'); return; }
    setUploading(true); setUploadError(''); setUploadProgress(0);
    const fileName = `products/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
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
    const productData = { ...formData, price: parseFloat(formData.price), stock: parseInt(formData.stock, 10) };
    if (currentProduct) { updateProduct(currentProduct.id, productData); } else { addProduct(productData); }
    setIsEditing(false);
  };

  const categories = ['All', ...new Set(contextCategories.map(c => c.name).filter(Boolean))];
  const filteredProducts = products.filter(p => filterCategory === 'All' || p.category === filterCategory);

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
                <ArrowLeft size={14} /> Back to Catalog
              </button>
              <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 800, margin: 0, letterSpacing: '-0.03em', color: 'white' }}>
                {currentProduct ? 'Edit Product' : 'Add New Item'}
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', margin: '0.3rem 0 0' }}>
                Catalog Entry #{currentProduct?.id?.substring(0, 8) || 'New'}
              </p>
            </div>
            {formData.image && (
              <div style={{ width: '64px', height: '64px', borderRadius: '16px', overflow: 'hidden', border: '2px solid rgba(255,255,255,0.2)', flexShrink: 0 }}>
                <img src={formData.image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
          </div>
        </div>

        {/* Form Body */}
        <div style={{ borderRadius: '28px 28px 0 0', padding: 'clamp(1.5rem,4vw,2.5rem) clamp(1.2rem,3vw,2rem)', marginTop: '-1.5rem', position: 'relative', zIndex: 2, maxWidth: '820px', margin: '-1.5rem auto 0' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>

            <FormSection icon={<LayoutGrid size={18} color="#001d04" />} title="General Details">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div>
                  <FieldLabel>Product Title</FieldLabel>
                  <StyledInput required type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Handcrafted Ceramic Vase" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                  <div ref={catRef} style={{ position: 'relative' }}>
                    <FieldLabel>Category</FieldLabel>
                    {/* Combobox trigger */}
                    <div
                      onClick={() => setCatOpen(!catOpen)}
                      style={{
                        backgroundColor: catOpen ? 'white' : '#F9F9F9',
                        border: catOpen ? '1px solid #436132' : '1px solid rgba(0,0,0,0.06)',
                        borderRadius: catOpen ? '12px 12px 0 0' : '12px',
                        padding: '0 1.25rem',
                        height: '3.2rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        boxSizing: 'border-box',
                        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: catOpen ? '0 0 0 4px rgba(67,97,50,0.08)' : 'none',
                      }}
                    >
                      <span style={{ fontSize: '0.92rem', color: formData.category ? '#1E2A3A' : '#9CA3AF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {formData.category || 'Select or type category…'}
                      </span>
                      <ChevronDown size={16} color="#706F65" style={{ transition: 'transform 0.2s', transform: catOpen ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }} />
                    </div>
                    {/* Hidden required input for form validation */}
                    <input type="text" required value={formData.category} onChange={() => {}} tabIndex={-1} style={{ position: 'absolute', opacity: 0, height: 0, width: 0, pointerEvents: 'none' }} />

                    {/* Dropdown panel */}
                    {catOpen && (
                      <div style={{
                        position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50,
                        backgroundColor: 'white',
                        border: '1px solid #436132', borderTop: 'none',
                        borderRadius: '0 0 12px 12px',
                        boxShadow: '0 12px 32px rgba(0,0,0,0.12)',
                        maxHeight: '240px',
                        overflow: 'hidden',
                        display: 'flex', flexDirection: 'column',
                        animation: 'catDropIn 0.2s ease-out',
                      }}>
                        {/* Search field */}
                        <div style={{ padding: '0.6rem 0.8rem', borderBottom: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Search size={14} color="#9CA3AF" style={{ flexShrink: 0 }} />
                          <input
                            autoFocus
                            type="text"
                            value={catSearch}
                            onChange={e => setCatSearch(e.target.value)}
                            placeholder="Search or type new…"
                            onClick={e => e.stopPropagation()}
                            style={{
                              border: 'none', outline: 'none', fontSize: '0.85rem', color: '#1E2A3A',
                              width: '100%', background: 'transparent', fontFamily: 'inherit',
                            }}
                          />
                        </div>
                        {/* Options list */}
                        <div style={{ overflowY: 'auto', maxHeight: '180px', padding: '0.3rem 0' }}>
                          {filteredCategories.map(cat => (
                            <div
                              key={cat}
                              onClick={(e) => { e.stopPropagation(); selectCategory(cat); }}
                              style={{
                                padding: '0.6rem 1rem',
                                fontSize: '0.88rem',
                                cursor: 'pointer',
                                color: formData.category === cat ? '#436132' : '#1E2A3A',
                                fontWeight: formData.category === cat ? 700 : 400,
                                backgroundColor: formData.category === cat ? 'rgba(67,97,50,0.06)' : 'transparent',
                                transition: 'background-color 0.15s',
                                display: 'flex', alignItems: 'center', gap: '0.5rem',
                              }}
                              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(67,97,50,0.08)'}
                              onMouseLeave={e => e.currentTarget.style.backgroundColor = formData.category === cat ? 'rgba(67,97,50,0.06)' : 'transparent'}
                            >
                              {cat}
                            </div>
                          ))}
                          {/* "Add new" option */}
                          {isNewCategory && (
                            <div
                              onClick={(e) => { e.stopPropagation(); addNewCategory(); }}
                              style={{
                                padding: '0.65rem 1rem',
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                                color: '#436132',
                                fontWeight: 600,
                                borderTop: filteredCategories.length ? '1px solid rgba(0,0,0,0.06)' : 'none',
                                display: 'flex', alignItems: 'center', gap: '0.5rem',
                                transition: 'background-color 0.15s',
                              }}
                              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(67,97,50,0.08)'}
                              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                              <Plus size={14} /> Add "{catSearch.trim()}"
                            </div>
                          )}
                          {filteredCategories.length === 0 && !isNewCategory && (
                            <div style={{ padding: '1rem', textAlign: 'center', color: '#9CA3AF', fontSize: '0.82rem' }}>
                              No categories found
                            </div>
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
                    required rows={4} value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
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
                      resize: 'none', 
                      boxSizing: 'border-box',
                      transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
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
                </div>
              </div>
            </FormSection>

            <FormSection icon={<DollarSign size={18} color="#001d04" />} title="Pricing & Inventory">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                <div>
                  <FieldLabel>Retail Price ($)</FieldLabel>
                  <StyledInput required type="number" step="0.01" min="0" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} placeholder="0.00" />
                </div>
                <div>
                  <FieldLabel>Stock Available</FieldLabel>
                  <StyledInput required type="number" min="0" value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} placeholder="0" />
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
                {currentProduct ? 'Save Changes' : 'Publish Item'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  /* ── Product List ── */
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
              <h1 style={{ fontSize: 'clamp(1.9rem, 5vw, 2.6rem)', fontWeight: 800, margin: '0 0 0.25rem', letterSpacing: '-0.03em', color: 'white' }}>Catalog</h1>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem', margin: 0 }}>{products.length} items in collection</p>
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
              <Plus size={16} /> New Arrival
            </button>
          </div>

          {/* Category Filter Pills */}
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem', overflowX: 'auto', paddingBottom: '0.2rem', msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
            {categories.map(cat => {
              const isActive = filterCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  style={{
                    flexShrink: 0,
                    padding: '0.45rem 1rem',
                    borderRadius: '100px',
                    border: isActive ? '1px solid white' : '1px solid rgba(255,255,255,0.15)',
                    backgroundColor: isActive ? 'white' : 'rgba(255,255,255,0.06)',
                    color: isActive ? '#1E2A3A' : 'rgba(255,255,255,0.6)',
                    fontSize: '0.75rem', fontWeight: 600,
                    cursor: 'pointer', transition: 'all 0.2s ease',
                    backdropFilter: 'blur(10px)',
                    fontFamily: 'inherit'
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Product Cards */}
      <div style={{ backgroundColor: '#F7F3ED', borderRadius: '28px 28px 0 0', padding: 'clamp(1.2rem,3vw,2rem)', marginTop: '-1.5rem', position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
          {filteredProducts.map((product, index) => {
            const sc = getStockConfig(product.stock);
            return (
              <div
                key={product.id}
                style={{
                  backgroundColor: 'white', borderRadius: '20px',
                  padding: '1rem 1.2rem', display: 'flex', alignItems: 'center', gap: '1rem',
                  border: '1px solid rgba(0,0,0,0.04)',
                  animation: `cardEntrance 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) ${index * 0.05}s backwards`,
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.07)'; e.currentTarget.style.borderColor = 'rgba(67,97,50,0.15)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.04)'; }}
              >
                {/* Thumbnail */}
                <div style={{ width: '70px', height: '70px', borderRadius: '14px', overflow: 'hidden', flexShrink: 0, backgroundColor: '#F3F2EE' }}>
                  <img src={product.image} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.15rem' }}>
                    <span style={{ fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#706F65' }}>{product.category}</span>
                    {product.featured && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.6rem', fontWeight: 700, padding: '0.15rem 0.5rem', backgroundColor: '#FEF9C3', color: '#A16207', borderRadius: '100px' }}>
                        <Star size={9} fill="#A16207" /> Featured
                      </span>
                    )}
                  </div>
                  <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#001d04', margin: '0 0 0.35rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.title}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#436132', letterSpacing: '-0.01em' }}>${product.price.toFixed(2)}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.68rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '100px', backgroundColor: sc.bg, color: sc.color }}>
                      <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: sc.dot, flexShrink: 0 }} />
                      {sc.label}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                  <button title="Edit Product" onClick={() => handleEdit(product)} style={{ width: '36px', height: '36px', borderRadius: '12px', backgroundColor: '#F3F2EE', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background-color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#E4EDDB'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#F3F2EE'}
                  >
                    <Edit2 size={15} color="#001d04" />
                  </button>
                  <button title="Delete Product" onClick={() => setDeleteTarget(product)} style={{ width: '36px', height: '36px', borderRadius: '12px', backgroundColor: '#FEF2F2', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background-color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#FEE2E2'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#FEF2F2'}
                  >
                    <Trash2 size={15} color="#EF4444" />
                  </button>
                </div>
              </div>
            );
          })}

          {products.length === 0 && (
            <div style={{ textAlign: 'center', padding: '5rem 1.5rem', backgroundColor: 'white', borderRadius: '24px', border: '2px dashed rgba(0,0,0,0.08)' }}>
              <AlertCircle size={40} color="#D4CFC5" style={{ marginBottom: '1rem' }} />
              <h2 style={{ fontSize: '1.2rem', color: '#001d04', marginBottom: '0.4rem' }}>No products found</h2>
              <p style={{ color: '#706F65', marginBottom: '1.5rem', fontSize: '0.88rem' }}>Start by adding your first product to the catalog.</p>
              <button onClick={handleAddNew} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.8rem', backgroundColor: '#001d04', color: 'white', border: 'none', borderRadius: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.9rem' }}>
                <Plus size={16} /> Add First Product
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Delete Confirmation Modal ── */}
      {deleteTarget && (
        <div
          onClick={() => { if (!isDeleting) setDeleteTarget(null); }}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1.5rem',
            animation: 'fadeIn 0.2s ease'
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              backgroundColor: 'white', borderRadius: '24px',
              padding: '2rem', maxWidth: '380px', width: '100%',
              boxShadow: '0 25px 60px rgba(0,0,0,0.2)',
              animation: 'cardEntrance 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) backwards'
            }}
          >
            {/* Warning Icon */}
            <div style={{ width: '56px', height: '56px', borderRadius: '16px', backgroundColor: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.2rem' }}>
              <Trash2 size={24} color="#EF4444" />
            </div>

            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#001d04', textAlign: 'center', margin: '0 0 0.5rem' }}>
              Delete Product?
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#706F65', textAlign: 'center', lineHeight: 1.6, margin: '0 0 0.3rem' }}>
              You are about to permanently remove:
            </p>
            <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#001d04', textAlign: 'center', margin: '0 0 1.5rem' }}>
              "{deleteTarget.title}"
            </p>
            <p style={{ fontSize: '0.75rem', color: '#B91C1C', textAlign: 'center', margin: '0 0 1.5rem', fontWeight: 500 }}>
              This action cannot be undone. The product image will also be removed from storage.
            </p>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                style={{
                  flex: 1, padding: '0.85rem', borderRadius: '14px',
                  border: '1px solid rgba(0,0,0,0.08)', backgroundColor: 'white',
                  color: '#706F65', fontWeight: 600, fontSize: '0.88rem',
                  cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s'
                }}
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  setIsDeleting(true);
                  try {
                    await deleteProduct(deleteTarget.id);
                  } catch (err) {
                    console.error('Delete failed:', err);
                  }
                  setIsDeleting(false);
                  setDeleteTarget(null);
                }}
                disabled={isDeleting}
                style={{
                  flex: 1, padding: '0.85rem', borderRadius: '14px',
                  border: 'none', backgroundColor: '#EF4444',
                  color: 'white', fontWeight: 700, fontSize: '0.88rem',
                  cursor: isDeleting ? 'not-allowed' : 'pointer',
                  fontFamily: 'inherit', transition: 'all 0.2s',
                  opacity: isDeleting ? 0.7 : 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                }}
              >
                {isDeleting ? (
                  <>
                    <div style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={15} /> Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
