import React from 'react';
import { Plus, Edit2, Trash2, AlertCircle, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
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
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerGlow} />
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
            }}>
              <Plus size={16} /> New Arrival
            </button>
          </div>

          {/* Category Filter */}
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem', overflowX: 'auto', paddingBottom: '0.2rem', msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
            {categories.map(cat => {
              const isActive = filterCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`${styles.filterPill} ${isActive ? styles.filterPillActive : styles.filterPillInactive}`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Product Cards */}
      <div className={styles.listBody}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
          {filteredProducts.map((product, index) => {
            const sc = getStockConfig(product.stock);
            return (
              <div key={product.id} className={styles.productCard} style={{ animationDelay: `${index * 0.05}s` }}>
                <div style={{ width: '70px', height: '70px', borderRadius: '14px', overflow: 'hidden', flexShrink: 0, backgroundColor: '#F3F2EE' }}>
                  <img src={product.image} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>

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
                    <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#436132', letterSpacing: '-0.01em' }}>LKR {product.price.toFixed(2)}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.68rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '100px', backgroundColor: sc.bg, color: sc.color }}>
                      <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: sc.dot, flexShrink: 0 }} />
                      {sc.label}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                  <button title="Edit Product" onClick={() => handleEdit(product)} className={`${styles.actionButton} ${styles.editButton}`}>
                    <Edit2 size={15} color="#001d04" />
                  </button>
                  <button title="Delete Product" onClick={() => setDeleteTarget(product)} className={`${styles.actionButton} ${styles.deleteButton}`}>
                    <Trash2 size={15} color="#EF4444" />
                  </button>
                </div>
              </div>
            );
          })}

          {products.length === 0 && (
            <div style={{ textAlign: 'center', padding: '5rem 1.5rem', backgroundColor: 'white', borderRadius: '24px', border: '2px dashed rgba(0,0,0,0.08)' }}>
              <AlertCircle size={40} color="#D4CFC5" style={{ marginBottom: '1rem' }} />
              <h2 style={{ fontSize: '1.2rem', color: '#001d04', margin: '0 0 0.4rem' }}>No products found</h2>
              <p style={{ color: '#706F65', marginBottom: '1.5rem', fontSize: '0.88rem' }}>Start by adding your first product to the catalog.</p>
              <button onClick={handleAddNew} className={styles.btnPrimary} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.8rem' }}>
                <Plus size={16} /> Add First Product
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductList;
