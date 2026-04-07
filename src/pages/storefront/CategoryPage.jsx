import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useProducts } from '../../context/ProductContext';
import { useCategories } from '../../context/CategoryContext';
import ProductCard from '../../components/storefront/ProductCard';
import Footer from '../../components/storefront/Footer';
import { SlidersHorizontal, ArrowUpDown, Check, ArrowLeft, Search as SearchIcon, XCircle } from 'lucide-react';

// Default descriptions for common categories to make them feel premium
const categoryDescriptions = {
  'Groceries': 'Our curation prioritizes the soil. We partner with independent farmers to bring you sustainable, organic, and farm-to-table produce that respects the seasons and the land.',
  'Electronics': 'Precision engineering meets modern life. Explore our curated selection of state-of-the-art consumer electronics designed to elevate your everyday routines.',
  'Dresses': 'Effortless elegance for every occasion. Discover thoughtfully crafted pieces using sustainable fabrics and timeless silhouettes that celebrate personal style.',
  'Home & Living': 'Curated essentials for the modern home. Quality craftsmanship meets simplicity in our collection of decor, ceramics, and soft furnishings.',
  'Furniture': 'Heirloom quality pieces crafted to endure. We focus on natural materials, clean lines, and functional design that anchors your living spaces.',
  'All': 'Explore our entire curated collection. Every piece has been selected for its uncompromising quality, sustainable sourcing, and timeless appeal.'
};

const CategoryPage = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search');
  const { fetchCategoryProducts, fetchMoreCategoryProducts } = useProducts();
  const { categories } = useCategories();

  // ─── Local State (independent from Home page) ───
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastCatDoc, setLastCatDoc] = useState(null);
  const [catHasMore, setCatHasMore] = useState(true);
  const [isFetchingNext, setIsFetchingNext] = useState(false);
  const [sortBy, setSortBy] = useState('default');
  const [filterBy, setFilterBy] = useState('all');
  const [showSort, setShowSort] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const observerRef = useRef();

  const activeCategory = categoryName || 'All';

  // ─── Fresh fetch when category changes ───
  useEffect(() => {
    let cancelled = false;

    const loadCategory = async () => {
      setIsLoading(true);
      setCategoryProducts([]);
      setLastCatDoc(null);
      setCatHasMore(true);

      const result = await fetchCategoryProducts(activeCategory);

      if (!cancelled) {
        setCategoryProducts(result.products);
        setLastCatDoc(result.lastDoc);
        setCatHasMore(result.hasMore);
        setIsLoading(false);
      }
    };

    loadCategory();

    return () => { cancelled = true; };
  }, [activeCategory, fetchCategoryProducts]);

  // ─── Apply local filters ───
  let displayProducts = [...categoryProducts];

  if (filterBy === 'in-stock') {
    displayProducts = displayProducts.filter(p => p.stock > 0);
  } else if (filterBy === 'featured') {
    displayProducts = displayProducts.filter(p => p.featured);
  }

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    displayProducts = displayProducts.filter(p => 
      p.title.toLowerCase().includes(q) || 
      p.category.toLowerCase().includes(q) ||
      (p.description && p.description.toLowerCase().includes(q))
    );
  }

  if (sortBy === 'price-low') {
    displayProducts = [...displayProducts].sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    displayProducts = [...displayProducts].sort((a, b) => b.price - a.price);
  } else if (sortBy === 'newest') {
    displayProducts = [...displayProducts].reverse();
  }

  // ─── Infinite Scroll Observer ───
  useEffect(() => {
    if (!catHasMore || isFetchingNext || isLoading) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && catHasMore && !isFetchingNext) {
        setIsFetchingNext(true);

        fetchMoreCategoryProducts(activeCategory, lastCatDoc).then((result) => {
          if (result.products.length > 0) {
            setCategoryProducts(prev => {
              const existingIds = new Set(prev.map(p => p.id));
              const uniqueNew = result.products.filter(item => !existingIds.has(item.id));
              return [...prev, ...uniqueNew];
            });
            setLastCatDoc(result.lastDoc);
            setCatHasMore(result.hasMore);
          } else {
            setCatHasMore(false);
          }
          setIsFetchingNext(false);
        });
      }
    }, { rootMargin: '200px' });

    const node = observerRef.current;
    if (node) {
        observer.observe(node);
    }

    return () => {
        if (node) observer.unobserve(node);
    };
  }, [catHasMore, isFetchingNext, isLoading, lastCatDoc, activeCategory, fetchMoreCategoryProducts]);

  const currentCatObj = categories?.find(c => c.name === activeCategory);
  const description = currentCatObj?.description || categoryDescriptions[activeCategory] || 'Explore our thoughtfully curated collection focusing on quality craftsmanship and timeless design.';

  const sortOptions = [
    { value: 'default', label: 'Recommended' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest Arrivals' },
  ];

  const filterOptions = [
    { value: 'all', label: 'All Items' },
    { value: 'in-stock', label: 'Available Now' },
    { value: 'featured', label: 'Featured Pieces' },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Helmet>
        <title>{activeCategory} | LuqmanGo</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={`${activeCategory} | LuqmanGo`} />
        <meta property="og:description" content={description} />
      </Helmet>
      <div className="animate-fade-in" style={{ padding: '0.8rem 1.2rem 5rem', maxWidth: '1280px', width: '100%', boxSizing: 'border-box', margin: '0 auto', flex: 1 }}>
        
        {/* Editorial Header */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.4rem', 
          marginBottom: '1.2rem',
          animation: 'cardEntrance 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) backwards'
        }}>
          <button 
            onClick={() => navigate(-1)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#001d04', padding: '0.3rem', marginLeft: '-0.3rem', textDecoration: 'none' }}
          >
            <ArrowLeft size={18} strokeWidth={2} />
          </button>
          {searchQuery ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
               <SearchIcon size={18} />
               <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#001d04' }}>Search Results</span>
            </div>
          ) : (
            <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#001d04' }}>{activeCategory}</span>
          )}
        </div>
        <p style={{ 
          fontSize: '0.85rem', 
          color: '#706F65', 
          lineHeight: '1.6', 
          fontWeight: 400, 
          marginTop: '-0.3rem', 
          marginBottom: '1.5rem',
          animation: 'cardEntrance 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) 0.05s backwards'
        }}>
          {searchQuery ? `Showing matches for "${searchQuery}" across ${activeCategory === 'All' ? 'the whole store' : activeCategory}.` : description}
        </p>

        {/* Filters Row */}
        <div style={{ 
          display: 'flex', 
          gap: '12px',
          marginBottom: '1rem',
          borderBottom: '1px solid var(--color-border)',
          paddingBottom: '0.8rem',
          position: 'relative',
          animation: 'cardEntrance 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) 0.1s backwards'
        }}>
          {/* Filter Button */}
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => { setShowFilter(!showFilter); setShowSort(false); }}
              style={{ 
                display: 'flex', alignItems: 'center', gap: '8px',
                backgroundColor: filterBy !== 'all' ? '#001d04' : '#F2E7D2', 
                border: 'none', padding: '0.75rem 1.25rem',
                borderRadius: 'var(--radius-md)', fontSize: '0.8rem', fontWeight: 600,
                cursor: 'pointer', color: filterBy !== 'all' ? 'white' : '#333',
                transition: 'all 0.2s ease',
              }}
            >
              <SlidersHorizontal size={14} /> Filter {filterBy !== 'all' && '•'}
            </button>
            {showFilter && (
              <div style={{
                position: 'absolute', top: '110%', left: 0, zIndex: 20,
                backgroundColor: 'white', borderRadius: '16px', padding: '0.5rem',
                boxShadow: '0 10px 40px rgba(0,0,0,0.12)', border: '1px solid rgba(0,0,0,0.05)',
                minWidth: '180px', animation: 'fadeIn 0.2s ease'
              }}>
                {filterOptions.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => { setFilterBy(opt.value); setShowFilter(false); }}
                    style={{
                      width: '100%', padding: '0.7rem 1rem', borderRadius: '10px',
                      border: 'none', background: filterBy === opt.value ? '#F2E7D2' : 'transparent',
                      textAlign: 'left', cursor: 'pointer', fontSize: '0.85rem',
                      fontWeight: filterBy === opt.value ? 700 : 400, color: '#001d04',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                    }}
                  >
                    {opt.label}
                    {filterBy === opt.value && <Check size={14} strokeWidth={3} />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sort Button */}
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => { setShowSort(!showSort); setShowFilter(false); }}
              style={{ 
                display: 'flex', alignItems: 'center', gap: '8px',
                backgroundColor: sortBy !== 'default' ? '#001d04' : '#F2E7D2', 
                border: 'none', padding: '0.75rem 1.25rem',
                borderRadius: 'var(--radius-md)', fontSize: '0.8rem', fontWeight: 600,
                cursor: 'pointer', color: sortBy !== 'default' ? 'white' : '#333',
                transition: 'all 0.2s ease',
              }}
            >
              <ArrowUpDown size={14} /> Sort {sortBy !== 'default' && '•'}
            </button>
            {showSort && (
              <div style={{
                position: 'absolute', top: '110%', left: 0, zIndex: 20,
                backgroundColor: 'white', borderRadius: '16px', padding: '0.5rem',
                boxShadow: '0 10px 40px rgba(0,0,0,0.12)', border: '1px solid rgba(0,0,0,0.05)',
                minWidth: '200px', animation: 'fadeIn 0.2s ease'
              }}>
                {sortOptions.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => { setSortBy(opt.value); setShowSort(false); }}
                    style={{
                      width: '100%', padding: '0.7rem 1rem', borderRadius: '10px',
                      border: 'none', background: sortBy === opt.value ? '#F2E7D2' : 'transparent',
                      textAlign: 'left', cursor: 'pointer', fontSize: '0.85rem',
                      fontWeight: sortBy === opt.value ? 700 : 400, color: '#001d04',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                    }}
                  >
                    {opt.label}
                    {sortBy === opt.value && <Check size={14} strokeWidth={3} />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Product Grid */}
        {isLoading ? (
            <div className="product-grid">
               {[1,2,3,4,5,6,7,8].map(i => (
                  <div key={i} style={{ aspectRatio: '4/5', backgroundColor: '#F3F2EE', borderRadius: 'var(--radius-lg)', animation: 'pulse 1.5s ease-in-out infinite' }} />
               ))}
               <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }`}</style>
            </div>
        ) : displayProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '6rem 1rem' }}>
               <XCircle size={40} strokeWidth={1} style={{ color: '#D4CFC5', marginBottom: '1rem' }} />
               <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#001d04' }}>
                 {searchQuery ? 'No matches found' : 'No products found'}
               </h3>
               <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', fontSize: '0.9rem' }}>
                 {searchQuery 
                   ? `We couldn't find any items matching "${searchQuery}".` 
                   : "We couldn't find any items matching your filters."}
               </p>
               <button 
                 onClick={() => { setFilterBy('all'); setSortBy('default'); if (searchQuery) navigate(`/category/${activeCategory}`); }}
                 className="btn btn-outline" 
                 style={{ padding: '0.8rem 2rem', cursor: 'pointer', borderRadius: '12px' }}
               >
                 {searchQuery ? 'Clear Search' : 'Clear Filters'}
               </button>
            </div>
        ) : (
            <>
              <div className="product-grid">
                {displayProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              
              {/* Infinite Scroll Sentinel & Subtle Loader */}
              <div ref={observerRef} style={{ height: '40px', margin: '2rem 0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {isFetchingNext && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#706F65', opacity: 0.8 }}>
                        <div style={{ width: '14px', height: '14px', border: '2px solid rgba(17,48,19,0.1)', borderTopColor: '#113013', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                        <span style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Discovering more...</span>
                    </div>
                )}
              </div>
            </>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default CategoryPage;
