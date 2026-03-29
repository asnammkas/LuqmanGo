import { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { Plus, Edit2, Trash2, ArrowLeft, Image as ImageIcon, LayoutGrid, DollarSign, Package, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProductManagement = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useShop();
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [formData, setFormData] = useState({
    title: '', price: '', category: '', description: '', image: '', stock: '', featured: false
  });

  const handleEdit = (product) => {
    setCurrentProduct(product);
    setFormData({ ...product, price: product.price.toString(), stock: product.stock.toString() });
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setCurrentProduct(null);
    setFormData({ title: '', price: '', category: '', description: '', image: '', stock: '', featured: false });
    setIsEditing(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock, 10),
    };

    if (currentProduct) {
      updateProduct(currentProduct.id, productData);
    } else {
      addProduct(productData);
    }
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="animate-fade-in" style={{ padding: '3rem 1.5rem', maxWidth: '850px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <button 
            className="btn btn-outline" 
            style={{ borderRadius: '12px', padding: '0.6rem 1.2rem', gap: '0.5rem', display: 'flex', alignItems: 'center' }} 
            onClick={() => setIsEditing(false)}
          >
            <ArrowLeft size={18} /> Back to Catalog
          </button>
          <div style={{ textAlign: 'right' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#001d04', margin: 0 }}>
              {currentProduct ? 'Edit Product' : 'Add New Item'}
            </h2>
            <p style={{ color: '#706F65', fontSize: '0.9rem', margin: '0.2rem 0 0' }}>Catalog Entry #{currentProduct?.id?.substring(0,8) || 'New'}</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Section 1: General Information */}
          <div style={{ backgroundColor: '#EAE1D3', borderRadius: '32px', padding: '2.5rem', boxShadow: '0 10px 40px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <LayoutGrid size={20} color="#001d04" />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#001d04', margin: 0 }}>General Details</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label className="label" style={{ fontSize: '0.8rem', color: '#706F65', marginBottom: '0.5rem', display: 'block', fontWeight: 600 }}>PRODUCT TITLE</label>
                <input required type="text" className="input" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} style={{ backgroundColor: 'white', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '12px', padding: '1.2rem', width: '100%' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <label className="label" style={{ fontSize: '0.8rem', color: '#706F65', marginBottom: '0.5rem', display: 'block', fontWeight: 600 }}>CATEGORY</label>
                  <input required type="text" className="input" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} style={{ backgroundColor: 'white', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '12px', padding: '1.2rem', width: '100%' }} placeholder="e.g. Living Room, Decor" />
                </div>
                <div>
                  <label className="label" style={{ fontSize: '0.8rem', color: '#706F65', marginBottom: '0.5rem', display: 'block', fontWeight: 600 }}>STATUS</label>
                  <div style={{ height: '3.8rem', display: 'flex', alignItems: 'center', padding: '0 1.2rem', backgroundColor: 'white', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '12px' }}>
                     <label style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer', fontSize: '0.9rem', width: '100%' }}>
                        <input type="checkbox" checked={formData.featured} onChange={e => setFormData({...formData, featured: e.target.checked})} style={{ width: '1.2rem', height: '1.2rem', accentColor: '#001d04' }} />
                        <span>Feature on Homepage</span>
                      </label>
                  </div>
                </div>
              </div>
              <div>
                <label className="label" style={{ fontSize: '0.8rem', color: '#706F65', marginBottom: '0.5rem', display: 'block', fontWeight: 600 }}>PRODUCT DESCRIPTION</label>
                <textarea required className="input" rows="4" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{ backgroundColor: 'white', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '12px', padding: '1.2rem', resize: 'none', width: '100%' }}></textarea>
              </div>
            </div>
          </div>

          {/* Section 2: Pricing & Inventory */}
          <div style={{ backgroundColor: '#EAE1D3', borderRadius: '32px', padding: '2.5rem', boxShadow: '0 10px 40px rgba(0,0,0,0.02)' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <DollarSign size={20} color="#001d04" />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#001d04', margin: 0 }}>Pricing & Inventory</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label className="label" style={{ fontSize: '0.8rem', color: '#706F65', marginBottom: '0.5rem', display: 'block', fontWeight: 600 }}>RETAIL PRICE ($)</label>
                <input required type="number" step="0.01" min="0" className="input" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} style={{ backgroundColor: 'white', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '12px', padding: '1.2rem', width: '100%' }} />
              </div>
              <div>
                <label className="label" style={{ fontSize: '0.8rem', color: '#706F65', marginBottom: '0.5rem', display: 'block', fontWeight: 600 }}>STOCK AVAILABLE</label>
                <input required type="number" min="0" className="input" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} style={{ backgroundColor: 'white', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '12px', padding: '1.2rem', width: '100%' }} />
              </div>
            </div>
          </div>

          {/* Section 3: Media Management */}
          <div style={{ backgroundColor: '#EAE1D3', borderRadius: '32px', padding: '2.5rem', boxShadow: '0 10px 40px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ImageIcon size={20} color="#001d04" />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#001d04', margin: 0 }}>Product Media</h3>
            </div>

            <div>
              <label className="label" style={{ fontSize: '0.8rem', color: '#706F65', marginBottom: '0.1rem', display: 'block', fontWeight: 600 }}>IMAGE SOURCE</label>
              {/* Future Dropzone Area */}
              <div style={{ 
                border: '2px dashed rgba(0,29,4,0.1)', 
                borderRadius: '16px', 
                padding: '1.5rem', 
                backgroundColor: 'rgba(255,255,255,0.4)',
                textAlign: 'center',
                marginBottom: '1rem'
              }}>
                {formData.image ? (
                   <img src={formData.image} alt="Preview" style={{ height: '120px', borderRadius: '8px', objectFit: 'cover' }} />
                ) : (
                   <div style={{ color: '#706F65', opacity: 0.6 }}>
                      <ImageIcon size={32} style={{ margin: '0 auto 0.5rem' }} />
                      <p style={{ fontSize: '0.85rem', margin: 0 }}>Image Preview</p>
                   </div>
                )}
              </div>
              <input 
                required type="url" className="input" 
                value={formData.image} 
                onChange={e => setFormData({...formData, image: e.target.value})} 
                placeholder="Product image URL (https://...)" 
                style={{ backgroundColor: 'white', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '12px', padding: '1.2rem', width: '100%' }} 
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1.2rem', marginTop: '1rem', marginBottom: '4rem' }}>
             <button type="button" className="btn" style={{ color: '#001d04', fontWeight: 600, padding: '1rem 2rem', background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setIsEditing(false)}>Discard</button>
             <button type="submit" className="btn" style={{ backgroundColor: '#001d04', color: 'white', padding: '1rem 3rem', borderRadius: '16px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
               {currentProduct ? 'Apply Updates' : 'Publish Product'}
             </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ padding: '4rem 1.5rem', maxWidth: '1000px' }}>
      <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem' }}>
        <div>
           <Link to="/admin" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#706F65', marginBottom: '1rem', fontSize: '0.85rem', fontWeight: 500, textDecoration: 'none' }}>
             <ArrowLeft size={16} /> Dashboard
           </Link>
           <h1 style={{ fontSize: '3rem', fontWeight: 700, color: '#001d04', letterSpacing: '-0.02em', lineHeight: 1, margin: 0 }}>Catalog</h1>
           <p style={{ color: '#706F65', marginTop: '0.75rem', fontSize: '1.05rem', margin: '0.75rem 0 0' }}>{products.length} Items found in collection</p>
        </div>
        <button className="btn" style={{ backgroundColor: '#001d04', color: 'white', borderRadius: '16px', padding: '1rem 2rem', fontWeight: 600, gap: '0.5rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={handleAddNew}>
          <Plus size={20} /> New Arrival
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {products.map(product => (
          <div 
            key={product.id} 
            className="card admin-product-row"
            style={{ 
              display: 'flex', alignItems: 'center', padding: '1rem 1.5rem', gap: '2rem',
              backgroundColor: 'white', border: '1px solid var(--color-border)', borderRadius: '24px',
              transition: 'all 0.3s ease'
            }}
          >
            <div style={{ width: '80px', height: '80px', borderRadius: '16px', overflow: 'hidden', flexShrink: 0, backgroundColor: '#F3F2EE' }}>
               <img src={product.image} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            
            <div style={{ flexGrow: 1 }}>
               <div style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#706F65', marginBottom: '0.2rem' }}>
                 {product.category}
               </div>
               <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#001d04', margin: 0 }}>
                 {product.title}
                 {product.featured && <span style={{ marginLeft: '1rem', padding: '0.2rem 0.5rem', backgroundColor: '#FBF5EC', color: '#706F65', fontSize: '0.6rem', borderRadius: '8px', fontWeight: 700 }}>FEATURED</span>}
               </h3>
               <div style={{ display: 'flex', gap: '2rem', marginTop: '0.5rem', color: '#706F65', fontSize: '0.85rem' }}>
                  <span style={{ fontWeight: 600, color: '#001d04' }}>${product.price.toFixed(2)}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Package size={14} /> {product.stock} in stock
                  </span>
               </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
               <button 
                title="Edit Product"
                className="btn-icon" 
                style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#F3F2EE', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
                onClick={() => handleEdit(product)}
               >
                 <Edit2 size={18} color="#001d04" />
               </button>
               <button 
                title="Delete Product"
                className="btn-icon" 
                style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#F3F2EE', color: '#ef4444', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
                onClick={() => {
                  if (window.confirm('Remove this product permanently?')) deleteProduct(product.id);
                }}
               >
                 <Trash2 size={18} />
               </button>
            </div>
          </div>
        ))}

        {products.length === 0 && (
          <div style={{ textAlign: 'center', padding: '6rem', backgroundColor: 'white', borderRadius: '32px', border: '2px dashed var(--color-border)' }}>
             <AlertCircle size={48} color="#D4CFC5" style={{ margin: '0 auto 1.5rem' }} />
             <h2 style={{ fontSize: '1.5rem', color: '#001d04', marginBottom: '0.5rem', margin: '0 0 0.5rem' }}>No products found</h2>
             <p style={{ color: '#706F65', margin: 0 }}>Start by adding your first product to the catalog.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductManagement;

