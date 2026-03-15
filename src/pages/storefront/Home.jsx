import { useShop } from '../../context/ShopContext';
import ProductCard from '../../components/storefront/ProductCard';
import HeroSlideshow from '../../components/storefront/HeroSlideshow';
import Footer from '../../components/storefront/Footer';
import { Zap, ShoppingBag, Leaf, Baby, Loader } from 'lucide-react';

const categoryPills = [
  { label: 'Super Deals', icon: Zap, color: '#E53935', category: 'All' },
  { label: 'Electronics', icon: ShoppingBag, color: 'var(--color-secondary)', category: 'Electronics' },
  { label: 'Groceries', icon: Leaf, color: '#43A047', category: 'Groceries' },
  { label: 'Dresses', icon: Baby, color: '#8E24AA', category: 'Dresses' },
];

const Home = () => {
  const { products, searchQuery, activeCategory, setActiveCategory, isCategoryLoading, isProductsLoading, productsError } = useShop();

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredProducts = products.filter(p => p.featured);

  return (
    <div>
      {/* Hero Banner */}
      <section style={{ width: '100%' }}>
        <HeroSlideshow />
      </section>

      {/* Category Pills */}
      <section className="container" style={{ padding: '2rem 1.5rem 0' }}>
        <div className="category-pills" style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
          {categoryPills.map(pill => {
            const Icon = pill.icon;
            const isActive = activeCategory === pill.category;
            return (
              <button
                key={pill.label}
                onClick={() => setActiveCategory(pill.category)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.6rem 1.25rem', borderRadius: '999px',
                  border: isActive ? '2px solid var(--color-secondary)' : '1px solid var(--color-border)', 
                  backgroundColor: isActive ? 'var(--color-secondary)' : 'transparent',
                  cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit',
                  fontWeight: 600, fontSize: '0.8rem', 
                  color: isActive ? 'white' : 'var(--color-text-muted)',
                  transition: 'all 0.25s ease',
                }}
              >
                <Icon size={16} style={{ color: isActive ? 'white' : pill.color }} />
                {pill.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Featured Products */}
      {!isProductsLoading && !searchQuery && activeCategory === 'All' && !isCategoryLoading && (
        <section id="featured" className="container" style={{ padding: '2.5rem 1.5rem 0' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.3rem', margin: 0, fontWeight: 700, letterSpacing: '-0.02em' }}>Featured</h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', cursor: 'pointer', fontWeight: 500 }}>View all →</span>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '1rem', scrollSnapType: 'x mandatory' }} className="category-pills">
            {featuredProducts.map(product => (
              <div key={product.id} className="featured-item-scroll" style={{ scrollSnapAlign: 'start', flexShrink: 0 }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* All Products / Filtered Results */}
      <section id="products" className="container" style={{ padding: '2rem 1.5rem 3rem', minHeight: '400px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.5rem', margin: 0, fontWeight: 700 }}>
            {searchQuery ? 'Search Results' : activeCategory === 'All' ? 'All Products' : activeCategory}
          </h2>
          {!isCategoryLoading && (
            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
              {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'}
            </span>
          )}
        </div>

        {productsError ? (
          <div className="card" style={{ padding: '3rem 2rem', border: '1px solid #FECACA', backgroundColor: '#FEF2F2', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#DC2626' }}>Database Connection Error</h3>
            <p style={{ color: '#991B1B', marginBottom: '1.5rem', maxWidth: '600px', margin: '0 auto 1.5rem auto' }}>{productsError}</p>
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: 'var(--radius-md)', textAlign: 'left', display: 'inline-block', border: '1px solid #FCA5A5' }}>
              <strong style={{ display: 'block', marginBottom: '0.5rem', color: '#7F1D1D' }}>How to fix this:</strong>
              <ol style={{ color: '#991B1B', paddingLeft: '1.5rem', margin: 0, fontSize: '0.9rem', lineHeight: 1.6 }}>
                <li>Go to the <a href="https://console.firebase.google.com/" target="_blank" rel="noreferrer" style={{ textDecoration: 'underline', fontWeight: 600 }}>Firebase Console</a></li>
                <li>Ensure you have clicked <strong>"Create Database"</strong> inside the Firestore Database menu.</li>
                <li>Go to the <strong>Rules</strong> tab and temporarily set them to `allow read, write: if true;` while in development.</li>
              </ol>
            </div>
          </div>
        ) : isProductsLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '6rem 0', color: 'var(--color-primary)' }}>
            <Loader size={48} className="spinner" style={{ animation: 'spin 1s linear infinite', marginBottom: '1rem' }} />
            <span style={{ fontWeight: 600, color: 'var(--color-text-main)', fontSize: '1.2rem' }}>Connecting to Cloud...</span>
          </div>
        ) : isCategoryLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 0', color: 'var(--color-primary)' }}>
            <Loader size={40} className="spinner" style={{ animation: 'spin 1s linear infinite', marginBottom: '1rem' }} />
            <span style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>Loading {activeCategory}...</span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 2rem', backgroundColor: 'var(--color-bg-card)', borderRadius: 'var(--radius-lg)' }}>
             <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No products found</h3>
             <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Try a different search or category.</p>
          </div>
        ) : (
          <div className="product-grid">
            {filteredProducts.map(product => (
               <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default Home;
