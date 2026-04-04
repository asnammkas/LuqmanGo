import { useState } from 'react';
import { useParams, Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
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
  const { products, isProductsLoading, productsError } = useShop();
  const [sortBy, setSortBy] = useState('default');
  const [filterBy, setFilterBy] = useState('all');
  const [showSort, setShowSort] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  // If navigating to "All" or a specific category
  const activeCategory = categoryName || 'All';
  
  // Filter products based on URL param
  let categoryProducts = activeCategory === 'All' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  // Apply filter
  if (filterBy === 'in-stock') {
    categoryProducts = categoryProducts.filter(p => p.stock > 0);
  } else if (filterBy === 'featured') {
    categoryProducts = categoryProducts.filter(p => p.featured);
  }

  // Apply search filtering
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    categoryProducts = categoryProducts.filter(p => 
      p.title.toLowerCase().includes(q) || 
      p.category.toLowerCase().includes(q) ||
      (p.description && p.description.toLowerCase().includes(q))
    );
  }

  // Apply sorting
  if (sortBy === 'price-low') {
    categoryProducts = [...categoryProducts].sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    categoryProducts = [...categoryProducts].sort((a, b) => b.price - a.price);
  } else if (sortBy === 'newest') {
    categoryProducts = [...categoryProducts].reverse();
  }

  const description = categoryDescriptions[activeCategory] || 'Explore our thoughtfully curated collection focusing on quality craftsmanship and timeless design.';

  const sortOptions = [
    { value: 'default', label: 'Default' },
    { value: 'price-low', label: 'Price: Low → High' },
    { value: 'price-high', label: 'Price: High → Low' },
    { value: 'newest', label: 'Newest First' },
  ];

  const filterOptions = [
    { value: 'all', label: 'All Items' },
    { value: 'in-stock', label: 'In Stock' },
    { value: 'featured', label: 'Featured Only' },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div className="animate-fade-in" style={{ padding: '0.8rem 1.2rem 5rem', maxWidth: '1280px', width: '100%', boxSizing: 'border-box', margin: '0 auto', flex: 1 }}>
        
        {/* Editorial Header - Unified Pattern */}
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
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                backgroundColor: filterBy !== 'all' ? '#001d04' : '#F2E7D2', 
                border: 'none', 
                padding: '0.75rem 1.25rem',
                borderRadius: 'var(--radius-md)', 
                fontSize: '0.8rem', 
                fontWeight: 600,
                cursor: 'pointer', 
                color: filterBy !== 'all' ? 'white' : '#333',
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
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                backgroundColor: sortBy !== 'default' ? '#001d04' : '#F2E7D2', 
                border: 'none', 
                padding: '0.75rem 1.25rem',
                borderRadius: 'var(--radius-md)', 
                fontSize: '0.8rem', 
                fontWeight: 600,
                cursor: 'pointer', 
                color: sortBy !== 'default' ? 'white' : '#333',
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
        {productsError ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
             <p color="red">{productsError}</p>
          </div>
        ) : isProductsLoading ? (
            <div className="product-grid">
               {[1,2,3,4,5,6,7,8].map(i => (
                  <div key={i} style={{ aspectRatio: '4/5', backgroundColor: '#F3F2EE', borderRadius: 'var(--radius-lg)' }} className="animate-pulse" />
               ))}
            </div>
        ) : categoryProducts.length === 0 ? (
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
            <div className="product-grid">
                {categoryProducts.map((product) => (
                   <ProductCard key={product.id} product={product} />
                ))}
            </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default CategoryPage;
