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
    image: null,
    svg: true,
  },
];

const ExclusiveDealsSvg = () => (
  <svg viewBox="0 0 240 240" fill="none" stroke="#0C2311" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '75%', height: '75%' }}>
    {/* === GIFT BOX — 3D Perspective === */}
    {/* Front face */}
    <path d="M50 105 L50 190 L155 190 L155 105" />
    {/* Top face (lid) — 3D */}
    <path d="M40 92 L40 105 L155 105 L175 92 Z" />
    {/* Right side face — 3D depth */}
    <path d="M155 105 L175 92 L175 178 L155 190" />
    {/* Top lid surface */}
    <path d="M40 92 L60 78 L175 78 L175 92 Z" strokeWidth="1.8" />
    {/* Right lid edge */}
    <path d="M175 78 L175 92" />

    {/* === RIBBONS on box === */}
    {/* Vertical ribbon front */}
    <line x1="102" y1="105" x2="102" y2="190" strokeWidth="1.5" />
    <line x1="110" y1="105" x2="110" y2="190" strokeWidth="1.5" />
    {/* Vertical ribbon on lid */}
    <line x1="102" y1="92" x2="110" y2="78" strokeWidth="1.5" />
    <line x1="110" y1="92" x2="118" y2="78" strokeWidth="1.5" />
    {/* Horizontal ribbon */}
    <line x1="50" y1="145" x2="155" y2="145" strokeWidth="1.5" />
    <line x1="155" y1="145" x2="175" y2="133" strokeWidth="1.5" />

    {/* === BOW — Large decorative === */}
    {/* Left loop */}
    <path d="M106 78 Q75 55 65 35 Q60 25 70 22 Q82 20 90 32 Q98 48 106 65" strokeWidth="2.2" />
    <path d="M106 78 Q85 60 78 40" strokeWidth="1.2" opacity="0.5" />
    {/* Right loop */}
    <path d="M114 78 Q140 55 148 35 Q153 25 143 22 Q131 20 124 32 Q116 48 114 65" strokeWidth="2.2" />
    <path d="M114 78 Q130 60 135 40" strokeWidth="1.2" opacity="0.5" />
    {/* Top left smaller loop */}
    <path d="M106 65 Q92 42 88 30 Q95 28 100 38 Q104 50 106 60" strokeWidth="1.8" />
    {/* Top right smaller loop */}
    <path d="M114 65 Q125 42 128 30 Q121 28 117 38 Q114 50 114 60" strokeWidth="1.8" />
    {/* Center knot */}
    <ellipse cx="110" cy="72" rx="8" ry="7" strokeWidth="2.2" />
    {/* Ribbon tails */}
    <path d="M100 78 Q95 90 88 96" strokeWidth="2" />
    <path d="M120 78 Q125 90 132 96" strokeWidth="2" />

    {/* === DEAL TAG === */}
    {/* String from box to tag */}
    <path d="M155 150 Q165 145 170 148 Q178 152 175 158" strokeWidth="1.5" />
    {/* Tag body — rounded */}
    <path d="M162 155 L200 142 Q208 140 210 148 L210 172 Q208 180 200 178 L162 185 Q155 183 155 175 L155 165 Q155 157 162 155 Z" strokeWidth="2" />
    {/* Tag hole */}
    <circle cx="170" cy="155" r="3.5" fill="#E8E3D1" strokeWidth="1.8" />
    {/* "Deal" text */}
    <text x="173" y="170" fontSize="16" fill="#0C2311" stroke="none" fontWeight="700" fontFamily="Georgia, serif" letterSpacing="0.5">Deal</text>

    {/* === REFLECTION === */}
    <line x1="60" y1="198" x2="165" y2="198" strokeWidth="0.8" opacity="0.2" />
    <line x1="70" y1="202" x2="155" y2="202" strokeWidth="0.5" opacity="0.1" />
  </svg>
);

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
              ) : cat.svg ? (
                <ExclusiveDealsSvg />
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
