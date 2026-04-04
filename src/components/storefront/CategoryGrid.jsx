import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCategories } from '../../context/CategoryContext';
import { LayoutGrid } from 'lucide-react';

const CategoryGrid = () => {
  const navigate = useNavigate();
  const { categories, isCategoriesLoading } = useCategories();
  const [activeSlide, setActiveSlide] = useState(0);
  const scrollRef = useRef(null);

  const handleCategoryClick = (cat) => {
    // If it's a deals category, we might route differently, or simply filter by 'All' and show deals
    // Currently, our product system checks category name. For "Exclusive Deals", map it to "All" or similar.
    navigate(`/category/${cat.name}`);
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    const newSlide = Math.round(scrollLeft / clientWidth);
    if (newSlide !== activeSlide) {
      setActiveSlide(newSlide);
    }
  };

  // Chunk categories into groups of 6 (3 columns * 2 rows)
  const chunkedCategories = [];
  for (let i = 0; i < categories.length; i += 6) {
    chunkedCategories.push(categories.slice(i, i + 6));
  }

  if (isCategoriesLoading) {
    return (
      <section className="container" style={{ padding: '0 1.5rem 1rem', display: 'flex', justifyContent: 'center' }}>
        <div style={{ padding: '2rem', color: '#9CA3AF', fontSize: '0.9rem' }}>Loading categories...</div>
      </section>
    );
  }

  if (categories.length === 0) return null;

  return (
    <section className="container" style={{ padding: '0 1.5rem 1rem' }}>
      
      {/* Slider Container */}
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        style={{
          display: 'flex',
          overflowX: 'auto',
          width: '100%',
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none', /* Firefox */
          msOverflowStyle: 'none', /* IE/Edge */
          scrollBehavior: 'smooth',
          gap: '1.5rem', // Creates distinction between pages
        }}
      >
        {/* Hide webkit scrollbar inline style trick via standard css classes often used, but here inline: WebkitScrollbar: 'none' doesn't work, so assuming global hide or just letting touch handle it. */}
        <style>{`.hide-scroll::-webkit-scrollbar { display: none; }`}</style>
        
        {chunkedCategories.map((page, pageIndex) => (
          <div 
            key={pageIndex}
            className="hide-scroll"
            style={{
              flex: '0 0 100%',
              scrollSnapAlign: 'start',
              display: 'grid',
              gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
              gridTemplateRows: 'repeat(2, min-content)',
              gap: '12px',
              paddingBottom: '0.5rem' // Room for drop shadow
            }}
          >
            {page.map((cat, i) => (
              <div
                key={cat.id}
                onClick={() => handleCategoryClick(cat)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease',
                  animation: `cardEntrance 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) ${i * 0.04}s backwards`
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
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
                    backgroundColor: cat.isDeals ? '#FEF9C3' : '#E8E3D1',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    transition: 'box-shadow 0.2s ease, transform 0.2s ease',
                    position: 'relative'
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
                  ) : (
                    <LayoutGrid size={28} color={cat.isDeals ? "#A16207" : "#afaa9a"} />
                  )}
                  {/* Visual indicator for deals */}
                  {cat.isDeals && !cat.image && (
                     <div style={{ position: 'absolute', bottom: '8px', fontSize: '0.6rem', fontWeight: 800, color: '#A16207' }}>
                       DEALS
                     </div>
                  )}
                </div>
                <span style={{
                  marginTop: '10px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#0C2311',
                  textAlign: 'center',
                  letterSpacing: '0.01em',
                  lineHeight: 1.2,
                  whiteSpace: 'pre-line',
                }}>
                  {cat.name}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Pagination Dots */}
      {chunkedCategories.length > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '1rem' }}>
          {chunkedCategories.map((_, idx) => (
            <div 
              key={idx}
              onClick={() => {
                if (scrollRef.current) {
                  scrollRef.current.scrollTo({ left: idx * scrollRef.current.clientWidth, behavior: 'smooth' });
                }
              }}
              style={{
                width: activeSlide === idx ? '18px' : '6px',
                height: '6px',
                borderRadius: '100px',
                backgroundColor: activeSlide === idx ? '#436132' : 'rgba(0,0,0,0.15)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default CategoryGrid;
