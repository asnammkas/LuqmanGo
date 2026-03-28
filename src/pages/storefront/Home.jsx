import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import ProductCard from '../../components/storefront/ProductCard';
import CategoryGrid from '../../components/storefront/CategoryGrid';
import Footer from '../../components/storefront/Footer';
import { Loader } from 'lucide-react';

const Home = () => {
  const { products, isProductsLoading, productsError, activeCategory } = useShop();

  // Get featured/hero products for the carousel (up to 5)
  const heroProducts = products.filter(p => p.featured).length > 0 
    ? products.filter(p => p.featured).slice(0, 5)
    : products.slice(0, 5);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToSlide = useCallback((index) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 600);
  }, [isTransitioning]);

  // Auto-swipe every 4 seconds
  useEffect(() => {
    if (heroProducts.length <= 1 || isProductsLoading) return;
    const interval = setInterval(() => {
      goToSlide((currentSlide + 1) % heroProducts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [currentSlide, heroProducts.length, isProductsLoading, goToSlide]);

  const currentHero = heroProducts[currentSlide];

  const allGridProducts = products.filter(p => !heroProducts.some(h => h.id === p.id));
  const gridProducts = activeCategory === 'All' 
    ? allGridProducts 
    : allGridProducts.filter(p => p.category === activeCategory);

  return (
    <div style={{ paddingTop: '24px' }}>
      {/* Hero Carousel with Floating Effect */}
      <section className="container" style={{ padding: '0.5rem 1.5rem 0.5rem' }}>
        {isProductsLoading ? (
            <div style={{ 
              width: '100%', height: '15vh', maxHeight: '130px',
              backgroundColor: '#F3F2EE', borderRadius: '20px', 
              display: 'flex', alignItems: 'center', justifyContent: 'center' 
            }}>
                <Loader className="spinner" size={32} color="var(--color-text-muted)" />
            </div>
        ) : (
            <div style={{ 
              position: 'relative', 
              width: '100%', 
              height: '15vh', 
              maxHeight: '130px', 
              overflow: 'hidden', 
              borderRadius: '20px',
              boxShadow: '0 8px 30px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
            }}>
                {/* Slides */}
                {heroProducts.map((product, index) => (
                  <div
                    key={product.id}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      opacity: index === currentSlide ? 1 : 0,
                      transition: 'opacity 0.6s ease-in-out',
                      pointerEvents: index === currentSlide ? 'auto' : 'none',
                    }}
                  >
                    <img 
                      src={product.image} 
                      alt={product.title} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  </div>
                ))}

                {/* Overlay with text */}
                <div style={{ 
                    position: 'absolute', inset: 0, 
                    display: 'flex', flexDirection: 'column', 
                    alignItems: 'center', justifyContent: 'flex-end',
                    padding: '2rem',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.05) 50%, transparent)',
                }}>
                    <h2 style={{ 
                      color: 'white', fontSize: '0.9rem', fontWeight: 300, 
                      letterSpacing: '0.06em', textTransform: 'uppercase', 
                      marginBottom: '0.4rem', textAlign: 'center',
                      textShadow: '0 1px 4px rgba(0,0,0,0.3)',
                    }}>
                        {currentHero?.title || 'The Collection'}
                    </h2>
                    <Link 
                      to={`/product/${currentHero?.id}`} 
                      className="btn" 
                      style={{ 
                        backgroundColor: 'white', color: '#0C2311', 
                        padding: '0.4rem 1.2rem', borderRadius: '50px', 
                        fontSize: '0.65rem', letterSpacing: '0.12em', 
                        textTransform: 'uppercase', fontWeight: 600,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        textDecoration: 'none',
                        transition: 'transform 0.2s ease',
                      }}
                    >
                        Explore Now
                    </Link>
                </div>

                {/* Dot Indicators */}
                {heroProducts.length > 1 && (
                  <div style={{
                    position: 'absolute',
                    bottom: '8px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: '6px',
                    zIndex: 2,
                  }}>
                    {heroProducts.map((_, i) => (
                      <div
                        key={i}
                        onClick={() => goToSlide(i)}
                        style={{
                          width: i === currentSlide ? '20px' : '6px',
                          height: '6px',
                          borderRadius: '3px',
                          backgroundColor: i === currentSlide ? 'white' : 'rgba(255,255,255,0.5)',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                        }}
                      />
                    ))}
                  </div>
                )}
            </div>
        )}
      </section>

      {/* Category Filter Grid */}
      <CategoryGrid />

      {/* Product Grid */}
      <section className="container" style={{ padding: '2rem 1.5rem 6rem' }}>
        <div style={{ textAlign: 'left', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 500, letterSpacing: '0.01em', color: 'var(--color-text-main)' }}>
              {activeCategory === 'All' ? 'Recent Arrivals' : activeCategory}
            </h2>
        </div>

        {productsError ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <p color="red">{productsError}</p>
          </div>
        ) : isProductsLoading ? (
          <div className="product-grid">
            {[1,2,3,4].map(i => (
                <div key={i} style={{ aspectRatio: '4/5', backgroundColor: '#F3F2EE', borderRadius: 'var(--radius-lg)' }} />
            ))}
          </div>
        ) : (
          <div className="product-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '3rem 2rem' }}>
            {gridProducts.map(product => (
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
