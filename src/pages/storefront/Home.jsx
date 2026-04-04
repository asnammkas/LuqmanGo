import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';
import ProductCard from '../../components/storefront/ProductCard';
import CategoryGrid from '../../components/storefront/CategoryGrid';
import Footer from '../../components/storefront/Footer';
import { HeroSkeleton, ProductGridSkeleton } from '../../components/Skeletons';
import { Loader, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

const Home = () => {
  const { products, featuredProducts, isProductsLoading, productsError } = useProducts();
  const [visibleCount, setVisibleCount] = useState(6);
  const [isFetchingNext, setIsFetchingNext] = useState(false);
  const observerRef = useRef();



  // Use the dedicated featuredProducts stream for the Hero Carousel
  const heroProducts = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 5);

  const allGridProducts = products.filter(p => !heroProducts.some(h => h.id === p.id));
  const hasMore = visibleCount < allGridProducts.length;
  const gridProducts = allGridProducts.slice(0, visibleCount);

  // Infinite Scroll Observer Implementation
  useEffect(() => {
    if (!hasMore || isProductsLoading || isFetchingNext) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !isFetchingNext) {
        setIsFetchingNext(true);
        // Add a premium 400ms visual delay for the "Curating more..." loader
        setTimeout(() => {
          setVisibleCount(prev => prev + 6);
          setIsFetchingNext(false);
        }, 400);
      }
    }, { rootMargin: '200px' });

    if (observerRef.current) {
        observer.observe(observerRef.current);
    }

    return () => {
        if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [hasMore, isProductsLoading, isFetchingNext]);

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


  return (
    <div>
      {/* Hero Carousel with Floating Effect */}
      <section className="container" style={{ padding: '0.5rem 1.5rem 2rem' }}>
        {isProductsLoading ? (
            <HeroSkeleton />
        ) : (
            <div style={{ 
              position: 'relative', 
              width: '100%', 
              height: '55vh', 
              maxHeight: '500px', 
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
                      color: 'white', fontSize: '1.6rem', fontWeight: 300, 
                      letterSpacing: '0.08em', textTransform: 'uppercase', 
                      marginBottom: '0.8rem', textAlign: 'center',
                      textShadow: '0 1px 4px rgba(0,0,0,0.3)',
                    }}>
                        {currentHero?.title || 'The Collection'}
                    </h2>
                    <Link 
                      to={`/product/${currentHero?.id}`} 
                      className="btn" 
                      style={{ 
                        backgroundColor: 'white', color: '#0C2311', 
                        padding: '0.8rem 2rem', borderRadius: '50px', 
                        fontSize: '0.75rem', letterSpacing: '0.15em', 
                        textTransform: 'uppercase', fontWeight: 600,
                        boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
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
                    bottom: '12px',
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
      <section className="container" style={{ padding: '0.8rem 1.5rem 6rem' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          marginBottom: '2rem',
        }}>
            <h2 style={{ 
              fontSize: 'clamp(0.9rem, 4vw, 1.2rem)', 
              fontWeight: 300, 
              letterSpacing: '0.12em', 
              color: 'var(--color-text-main)',
              margin: 0,
              textTransform: 'uppercase'
            }}>
              Recent Arrivals
            </h2>
        </div>

        {productsError ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <p color="red">{productsError}</p>
          </div>
        ) : isProductsLoading ? (
          <ProductGridSkeleton count={4} />
        ) : (
          <>
            <div className="product-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '3rem 2rem' }}>
              {gridProducts.map(product => (
                 <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Infinite Scroll Sentinel & Subtle Loader */}
            <div ref={observerRef} style={{ height: '40px', margin: '4rem 0 2rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              {isFetchingNext && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#706F65', opacity: 0.8 }}>
                      <div style={{ width: '14px', height: '14px', border: '2px solid rgba(17,48,19,0.1)', borderTopColor: '#113013', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                      <span style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Curating more...</span>
                  </div>
              )}
            </div>
          </>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default Home;
