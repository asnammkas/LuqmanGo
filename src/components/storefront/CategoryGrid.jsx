import { useShop } from '../../context/ShopContext';

const categories = [
  {
    name: 'Grocery',
    category: 'Groceries',
    image: '/images/cat-grocery.png',
  },
  {
    name: 'Electronics',
    category: 'Electronics',
    image: '/images/cat-electronics.png',
  },
  {
    name: 'Dress',
    category: 'Dresses',
    image: '/images/cat-dress.png',
  },
  {
    name: 'Home-Living',
    category: 'Home & Living',
    image: '/images/cat-home-living.png',
  },
  {
    name: 'Beauty and\nCosmetics',
    category: 'Beauty',
    image: '/images/cat-beauty.png',
  },
  {
    name: 'Exclusive Deals',
    category: 'All',
    isDeals: true,
    image: '/images/cat-exclusive-deals.png',
  },
];

// ExclusiveDealsSvg removed in favor of cat-exclusive-deals.png

const CategoryGrid = () => {
  const { setActiveCategory } = useShop();

  const handleCategoryClick = (cat) => {
    setActiveCategory(cat.category);
    // Scroll to the product grid
    const productsSection = document.querySelector('.product-grid');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="container" style={{ padding: '0 1.5rem 2rem' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '12px',
      }}>
        {categories.map((cat) => (
          <div
            key={cat.name}
            onClick={() => handleCategoryClick(cat)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
              transition: 'transform 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div
              style={{
                width: '100%',
                aspectRatio: '1',
                borderRadius: '18px',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#E8E3D1',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                transition: 'box-shadow 0.2s ease, transform 0.2s ease',
              }}
            >
              {cat.image ? (
                <img
                  src={cat.image}
                  alt={cat.name}
                  style={{
                    width: '108%',
                    height: '108%',
                    objectFit: 'cover',
                    objectPosition: 'center',
                    mixBlendMode: 'multiply',
                  }}
                />
              ) : null}
            </div>
            <span style={{
              marginTop: '8px',
              fontSize: '0.72rem',
              fontWeight: 500,
              color: '#0C2311',
              textAlign: 'center',
              letterSpacing: '0.02em',
              lineHeight: 1.3,
              whiteSpace: 'pre-line',
            }}>
              {cat.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;
