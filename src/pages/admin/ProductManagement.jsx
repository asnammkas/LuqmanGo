import { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { Plus, Edit2, Trash2, ArrowLeft } from 'lucide-react';
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
      <div className="container animate-fade-in" style={{ padding: '3rem 1.5rem', maxWidth: '800px' }}>
        <button className="btn btn-outline" style={{ marginBottom: '2rem' }} onClick={() => setIsEditing(false)}>
          <ArrowLeft size={18} /> Back to List
        </button>
        <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>{currentProduct ? 'Edit Product' : 'Add New Product'}</h2>
        
        <form onSubmit={handleSubmit} className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="admin-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <label className="label">Product Title</label>
              <input required type="text" className="input" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>
            <div>
              <label className="label">Category</label>
              <input required type="text" className="input" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
            </div>
          </div>
          
          <div className="admin-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <label className="label">Price ($)</label>
              <input required type="number" step="0.01" min="0" className="input" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
            </div>
            <div>
              <label className="label">Stock Quantity</label>
              <input required type="number" min="0" className="input" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
            </div>
          </div>

          <div>
            <label className="label">Image URL</label>
            <input required type="url" className="input" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} placeholder="https://images.unsplash.com/..." />
          </div>

          <div>
            <label className="label">Description</label>
            <textarea required className="input" rows="4" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input type="checkbox" checked={formData.featured} onChange={e => setFormData({...formData, featured: e.target.checked})} style={{ width: '1.2rem', height: '1.2rem' }} />
            <span style={{ fontWeight: 500 }}>Feature this product on homepage</span>
          </label>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
             <button type="button" className="btn btn-outline" onClick={() => setIsEditing(false)}>Cancel</button>
             <button type="submit" className="btn btn-primary">Save Product</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1.5rem' }}>
      <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
           <Link to="/admin" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', marginBottom: '1rem', fontSize: '0.875rem' }}>
             <ArrowLeft size={16} /> Back to Dashboard
           </Link>
           <h1 style={{ fontSize: '2.5rem' }}>Product Management</h1>
        </div>
        <button className="btn btn-primary" onClick={handleAddNew}>
          <Plus size={18} /> Add New Product
        </button>
      </div>

      <div className="card admin-table-container" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-main)' }}>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Image</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Title</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Category</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Price</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Stock</th>
              <th style={{ padding: 'rem 1.5rem', fontWeight: 600, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} style={{ borderBottom: '1px solid var(--color-border)', transition: 'background-color 0.2s', ':hover': { backgroundColor: 'var(--color-bg-main)' } }}>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <img src={product.image} alt={product.title} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '4px' }} />
                </td>
                <td style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>
                  {product.title}
                  {product.featured && <span className="badge badge-primary" style={{ marginLeft: '0.5rem', fontSize: '0.65rem' }}>Featured</span>}
                </td>
                <td style={{ padding: '1rem 1.5rem', color: 'var(--color-text-muted)' }}>{product.category}</td>
                <td style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>${product.price.toFixed(2)}</td>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <span style={{ color: product.stock > 0 ? 'inherit' : '#ef4444' }}>{product.stock}</span>
                </td>
                <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                     <button className="btn-icon" onClick={() => handleEdit(product)}>
                       <Edit2 size={18} />
                     </button>
                     <button className="btn-icon" style={{ color: '#ef4444' }} onClick={() => {
                       if (window.confirm('Are you sure you want to delete this product?')) deleteProduct(product.id);
                     }}>
                       <Trash2 size={18} />
                     </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductManagement;
