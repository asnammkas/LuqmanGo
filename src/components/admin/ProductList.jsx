import React from 'react';
import { Plus, Edit2, Trash2, AlertCircle, Star, Search } from 'lucide-react';
import styles from '../../pages/admin/ProductManagement.module.css';

const getStockConfig = (stock) => {
  if (stock === 0)    return { label: 'Out of Stock', bg: '#FEE2E2', color: '#B91C1C', dot: '#EF4444' };
  if (stock <= 5)     return { label: `Low — ${stock}`,  bg: '#FEF9C3', color: '#A16207', dot: '#EAB308' };
  return              { label: `${stock} in stock`,     bg: '#DCFCE7', color: '#15803D', dot: '#22C55E' };
};

const ProductList = ({
  products, categories, filterCategory, setFilterCategory,
  handleAddNew, handleEdit, setDeleteTarget
}) => {
  const filteredProducts = products.filter(p => filterCategory === 'All' || p.category === filterCategory);

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1>Catalog</h1>
          <p>{products.length} items in collection</p>
        </div>
        <div className="admin-page-actions">
          <button onClick={handleAddNew} className="btn btn-primary">
            <Plus size={16} /> New Arrival
          </button>
        </div>
      </div>

      <div className="admin-controls">
        <div className="admin-search-wrapper">
          <Search size={16} />
          <input type="text" placeholder="Search catalog..." className="admin-search-input" />
        </div>
        <select 
          value={filterCategory} 
          onChange={(e) => setFilterCategory(e.target.value)} 
          className="admin-filter-select"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="admin-table-card">
        {filteredProducts.length === 0 ? (
          <div className="admin-empty-state">
            <AlertCircle size={48} color="var(--color-border)" style={{ marginBottom: '1rem' }} />
            <h2>No products found</h2>
            <p>Start by adding your first product to the catalog.</p>
            <button onClick={handleAddNew} className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
              <Plus size={16} /> Add First Product
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', padding: '1rem' }}>
            {filteredProducts.map((product, index) => {
              const sc = getStockConfig(product.stock);
              return (
                <div key={product.id} className="admin-product-row" style={{ animationDelay: `${index * 0.05}s` }}>
                  <div className="admin-product-thumb">
                    <img src={product.image} alt={product.title} />
                  </div>

                  <div className="admin-product-info">
                    <div className="admin-product-category">{product.category}</div>
                    <h3 className="admin-product-title">
                      {product.title}
                      {product.featured && (
                        <span className="admin-featured-tag">
                          <Star size={10} fill="currentColor" /> Featured
                        </span>
                      )}
                    </h3>
                    <div className="admin-product-meta">
                      <span className="admin-product-price">LKR {product.price.toFixed(2)}</span>
                      <span className="admin-product-stock">
                        <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: sc.dot }} />
                        {sc.label}
                      </span>
                    </div>
                  </div>

                  <div className="admin-product-actions">
                    <button title="Edit Product" onClick={() => handleEdit(product)} className="admin-action-btn">
                      <Edit2 size={16} />
                    </button>
                    <button title="Delete Product" onClick={() => setDeleteTarget(product)} className="admin-action-btn danger">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default ProductList;
