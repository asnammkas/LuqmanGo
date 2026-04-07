import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';
import { Search, X, ArrowRight, ShoppingBag, Tag } from 'lucide-react';

const SearchOverlay = ({ isOpen, onClose }) => {
  const { searchCatalog, fetchSearchCatalog } = useProducts();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Focus input and fetch data on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
      if (!searchCatalog) {
        setTimeout(() => setIsLoading(true), 0);
        fetchSearchCatalog().finally(() => setTimeout(() => setIsLoading(false), 0));
      }
    } else {
      document.body.style.overflow = 'unset';
      setTimeout(() => setSearchQuery(''), 0);
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen, searchCatalog, fetchSearchCatalog]);

  // Fuzzy search logic
  useEffect(() => {
    if (!searchQuery.trim() || !searchCatalog) {
      setTimeout(() => setResults([]), 0);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = searchCatalog.filter(p => 
      p.title.toLowerCase().includes(query) || 
      p.category.toLowerCase().includes(query) ||
      (p.description && p.description.toLowerCase().includes(query))
    ).slice(0, 6); // Limit results for UI clarity

    setTimeout(() => setResults(filtered), 0);
  }, [searchQuery, searchCatalog]);

  if (!isOpen) return null;

  const handleResultClick = (id) => {
    navigate(`/product/${id}`);
    onClose();
  };

  return (
    <div 
      role="dialog" 
      aria-modal="true"
      aria-label="Search Catalog"
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        backgroundColor: 'rgba(247, 243, 237, 0.98)',
        backdropFilter: 'blur(10px)',
        display: 'flex', flexDirection: 'column',
        animation: 'overlayFadeIn 0.3s ease-out'
      }}>
      <style>{`
        @keyframes overlayFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes resultEntrance { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
      
      {/* Header with Search Input */}
      <div style={{ padding: '0.75rem 1.5rem', maxWidth: '800px', width: '100%', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0' }}>
          <button aria-label="Close search" onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem', color: '#113013' }}>
            <X size={32} strokeWidth={1.5} />
          </button>
        </div>

        <div style={{ position: 'relative', marginBottom: '2rem' }}>
          <Search size={28} strokeWidth={1.5} style={{ position: 'absolute', left: '0', top: '50%', transform: 'translateY(-50%)', color: '#00C853' }} />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search our catalog..."
            style={{
              width: '100%', border: 'none', borderBottom: '2px solid rgba(0, 200, 83, 0.2)',
              backgroundColor: 'transparent', padding: '1.5rem 0 1.5rem 3.5rem',
              fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', fontWeight: 300, color: '#113013',
              outline: 'none', fontFamily: 'inherit', transition: 'border-color 0.3s ease'
            }}
            onFocus={(e) => e.target.style.borderBottomColor = '#00C853'}
            onBlur={(e) => e.target.style.borderBottomColor = 'rgba(0, 200, 83, 0.2)'}
          />
        </div>

        {/* Results List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
          {results.length > 0 ? (
            results.map((product, idx) => (
              <button
                key={product.id}
                onClick={() => handleResultClick(product.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '1.5rem',
                  padding: '1rem', borderRadius: '16px', backgroundColor: 'white',
                  cursor: 'pointer', transition: 'all 0.2s ease',
                  border: '1px solid rgba(0,0,0,0.03)',
                  textAlign: 'left',
                  animation: `resultEntrance 0.4s ease-out ${idx * 0.05}s backwards`
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.05)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ width: '60px', height: '60px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0, backgroundColor: '#E8E3D1' }}>
                  <img src={product.image} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 0.2rem', fontSize: '1rem', fontWeight: 600, color: '#113013' }}>{product.title}</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#706F65', fontSize: '0.8rem' }}>
                    <Tag size={12} /> {product.category}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.15rem', justifyContent: 'flex-end' }}>
                    <span style={{ fontSize: '0.6rem', fontWeight: 700, color: '#706F65' }}>LKR</span>
                    <span style={{ fontSize: '1rem', fontWeight: 700, color: '#00C853', letterSpacing: '-0.01em' }}>
                      {product.price?.toLocaleString()}
                    </span>
                  </div>
                  <ArrowRight size={16} color="#706F65" style={{ marginTop: '0.4rem' }} />
                </div>
              </button>
            ))
          ) : isLoading ? (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: '#706F65' }}>
              <div style={{ width: '24px', height: '24px', border: '2px solid rgba(0, 200, 83, 0.2)', borderTopColor: '#00C853', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
              <p style={{ fontSize: '0.9rem' }}>Loading catalog...</p>
            </div>
          ) : searchQuery.trim() !== '' ? (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: '#706F65' }}>
              <div style={{ marginBottom: '1rem', opacity: 0.5 }}><Search size={48} strokeWidth={1} style={{ margin: '0 auto' }} /></div>
              <p style={{ fontSize: '1.1rem' }}>No products found for "<strong>{searchQuery}</strong>"</p>
              <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Try searching for categories like "Electronics" or "Groceries"</p>
            </div>
          ) : (
            <div style={{ marginTop: '2rem' }}>
              <h5 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#706F65', marginBottom: '1.2rem' }}>Trending Categories</h5>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem' }}>
                {['Electronics', 'Groceries', 'Dresses', 'Home & Living'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => { setSearchQuery(cat); }}
                    style={{
                      padding: '0.6rem 1.2rem', borderRadius: '100px', border: '1px solid rgba(0,0,0,0.1)',
                      backgroundColor: 'transparent', cursor: 'pointer', fontSize: '0.85rem', color: '#113013',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#113013'; e.currentTarget.style.color = 'white'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#113013'; }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;
