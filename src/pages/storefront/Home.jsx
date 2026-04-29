import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useProducts } from '../../context/ProductContext';
import { useBanners } from '../../context/BannerContext';
import ProductCard from '../../components/storefront/ProductCard';
import CategoryGrid from '../../components/storefront/CategoryGrid';
import Footer from '../../components/storefront/Footer';
import { HeroSkeleton, ProductGridSkeleton } from '../../components/ui/Skeleton';
import { Loader, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

const Home = () => {
  const { featuredProducts, isProductsLoading: isFeaturedLoading, productsError, fetchCategoryProducts, fetchMoreCategoryProducts } = useProducts();
  const { banners: promotionalBanners, isBannersLoading } = useBanners();
  
  const [gridProducts, setGridProducts] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [isFetchingNext, setIsFetchingNext] = useState(false);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const observerRef = useRef();

  // Initial Fetch for Grid
  useEffect(() => {
    const loadInitial = async () => {
      const res = await fetchCategoryProducts('All', 6);
      setGridProducts(res.products || []);
      setLastDoc(res.lastDoc);
      setHasMore(res.hasMore);
      setIsLoadingInitial(false);
    };
    loadInitial();
  }, [fetchCategoryProducts]);

  const displayGridProducts = gridProducts; // Show all products in the grid

  // Infinite Scroll Observer Implementation
  useEffect(() => {
    if (!hasMore || isLoadingInitial || isFetchingNext) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !isFetchingNext) {
        setIsFetchingNext(true);
        // Add a premium 400ms visual delay for the "Curating more..." loader
        setTimeout(() => {
          fetchMoreCategoryProducts('All', lastDoc, 6).then(res => {
            if (res.products && res.products.length > 0) {
              setGridProducts(prev => {
                const newItems = res.products.filter(p => !prev.some(ext => ext.id === p.id));
                return [...prev, ...newItems];
              });
              setLastDoc(res.lastDoc);
              setHasMore(res.hasMore);
            } else {
              setHasMore(false);
            }
            setIsFetchingNext(false);
          });
        }, 400);
      }
    }, { rootMargin: '200px' });

    const node = observerRef.current;
    if (node) {
        observer.observe(node);
    }

    return () => {
        if (node) observer.unobserve(node);
    };
  }, [hasMore, isLoadingInitial, isFetchingNext, lastDoc, fetchMoreCategoryProducts]);

  const [currentSlide, setCurrentSlide] = useState(0);
  const transitionRef = useRef(false);

  const goToSlide = useCallback((index) => {
    if (transitionRef.current) return;
    transitionRef.current = true;
    setCurrentSlide(index);
    setTimeout(() => { transitionRef.current = false; }, 600);
  }, []);

  // Auto-swipe every 4 seconds
  useEffect(() => {
    if (promotionalBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % promotionalBanners.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [promotionalBanners.length]);

  const currentHero = promotionalBanners[currentSlide];

  return (
    <div>
      <Helmet>
        <title>Home | LuqmanGo</title>
        <meta name="description" content="Discover premium curated items at LuqmanGo." />
        <meta property="og:title" content="Home | LuqmanGo" />
        <meta property="og:description" content="Discover premium curated items at LuqmanGo." />
      </Helmet>
      {/* Hero Carousel with Floating Effect */}
      <section className="container" style={{ padding: '0.5rem 1.5rem 2rem' }}>
        {isFeaturedLoading ? (
            <HeroSkeleton />
        ) : promotionalBanners.length > 0 ? (
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
                {promotionalBanners.map((banner, index) => (
                  <div
                    key={banner.id}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      opacity: index === currentSlide ? 1 : 0,
                      transition: 'opacity 0.6s ease-in-out',
                      pointerEvents: index === currentSlide ? 'auto' : 'none',
                    }}
                  >
                    <img 
                      src={banner.image} 
                      alt={banner.title} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  </div>
                ))}

                {/* Clickable Overlay */}
                <Link 
                  to={currentHero?.link || '/'}
                  style={{ 
                      position: 'absolute', inset: 0, 
                      display: 'flex', flexDirection: 'column', 
                      alignItems: 'center', justifyContent: 'flex-end',
                      padding: '2rem',
                      background: 'linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 40%)',
                      textDecoration: 'none'
                  }}
                />

                {/* Dot Indicators */}
                {promotionalBanners.length > 1 && (
                  <div style={{
                    position: 'absolute',
                    bottom: '12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: '6px',
                    zIndex: 2,
                  }}>
                    {promotionalBanners.map((_, i) => (
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
        ) : null}
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
        ) : isLoadingInitial ? (
          <ProductGridSkeleton count={4} />
        ) : (
          <>
            <div className="product-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '3rem 2rem' }}>
              {displayGridProducts.map(product => (
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
