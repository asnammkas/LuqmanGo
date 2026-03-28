import { useParams, Link } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import ProductCard from '../../components/storefront/ProductCard';
import Footer from '../../components/storefront/Footer';
import { SlidersHorizontal, ArrowUpDown } from 'lucide-react';

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
  const { products, isProductsLoading, productsError } = useShop();

  // If navigating to "All" or a specific category
  const activeCategory = categoryName || 'All';
  
  // Filter products based on URL param
  const categoryProducts = activeCategory === 'All' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  const description = categoryDescriptions[activeCategory] || 'Explore our thoughtfully curated collection focusing on quality craftsmanship and timeless design.';

  return (
    <div>
      <div className="container" style={{ padding: '1.5rem 1.5rem 2rem' }}>
        
        {/* Editorial Header */}
        <div style={{ marginBottom: '3rem', maxWidth: '800px' }}>
          <h4 style={{ 
            fontSize: '0.7rem', 
            fontWeight: 600, 
            letterSpacing: '0.15em', 
            textTransform: 'uppercase', 
            color: 'var(--color-text-sage)',
            marginBottom: '0.5rem'
          }}>
            {activeCategory === 'All' ? 'The Collection' : 'Selected Collection'}
          </h4>
          
          <h1 style={{ 
            fontSize: 'clamp(2.5rem, 6vw, 4rem)', 
            fontWeight: 600, 
            color: 'var(--color-text-main)', 
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            marginBottom: '1.5rem'
          }}>
            {activeCategory}
          </h1>
          
          <p style={{ 
            fontSize: '1.1rem', 
            lineHeight: 1.6, 
            color: 'var(--color-text-muted)',
            fontWeight: 300,
            maxWidth: '650px'
          }}>
            {description}
          </p>
        </div>

        {/* Filters Row */}
        <div style={{ 
          display: 'flex', 
          gap: '12px',
          marginBottom: '3rem',
          borderBottom: '1px solid var(--color-border)',
          paddingBottom: '2rem'
        }}>
          <button style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            backgroundColor: '#F2E7D2', 
            border: 'none', 
            padding: '0.75rem 1.25rem',
            borderRadius: 'var(--radius-md)', 
            fontSize: '0.8rem', 
            fontWeight: 600,
            cursor: 'pointer', 
            color: '#333',
            transition: 'all 0.2s ease',
          }}>
            <SlidersHorizontal size={14} /> Filter
          </button>
          <button style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            backgroundColor: '#F2E7D2', 
            border: 'none', 
            padding: '0.75rem 1.25rem',
            borderRadius: 'var(--radius-md)', 
            fontSize: '0.8rem', 
            fontWeight: 600,
            cursor: 'pointer', 
            color: '#333',
            transition: 'all 0.2s ease',
          }}>
            <ArrowUpDown size={14} /> Sort
          </button>
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
               <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>No products found</h3>
               <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>We couldn't find any items in this collection.</p>
               <Link to="/" className="btn btn-outline" style={{ padding: '0.8rem 2rem' }}>Back to Home</Link>
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
