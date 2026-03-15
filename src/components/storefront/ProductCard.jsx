import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import { ShoppingCart, Image as ImageIcon } from 'lucide-react';

const ProductCard = ({ product }) => {
  const { addToCart } = useShop();
  const [imgError, setImgError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Detect touch device on mount
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  const showOverlay = isTouchDevice || isHovered;

  return (
    <div 
      className="card card-hover animate-fade-in" 
      style={{ display: 'flex', flexDirection: 'column', height: '100%', border: 'none', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link 
        to={`/product/${product.id}`} 
        style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, textDecoration: 'none', color: 'inherit' }}
      >
        {/* Image Container */}
        <div style={{ position: 'relative', aspectRatio: '1 / 1', overflow: 'hidden', backgroundColor: '#F8F8F8' }}>
          {!imgError ? (
            <img 
              src={product.image} 
              alt={product.title} 
              onError={() => setImgError(true)}
              style={{ 
                width: '100%', height: '100%', objectFit: 'cover', 
                transition: 'transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)',
                transform: isHovered ? 'scale(1.08)' : 'scale(1)'
              }} 
            />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>
              <ImageIcon size={48} opacity={0.2} style={{ marginBottom: '0.5rem' }} />
              <span style={{ fontSize: '0.75rem' }}>Image Unavailable</span>
            </div>
          )}

          {/* Featured Badge */}
          {product.featured && (
            <div style={{ 
              position: 'absolute', top: '12px', left: '12px',
              backgroundColor: 'var(--color-secondary)', color: 'white',
              padding: '0.3rem 0.75rem', borderRadius: '999px',
              fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase'
            }}>
              Featured
            </div>
          )}

          {/* Quick Add Overlay — hover on desktop, always visible on mobile */}
          {!isTouchDevice && (
            <div style={{ 
              position: 'absolute', bottom: 0, left: 0, right: 0,
              padding: '0.75rem',
              background: 'linear-gradient(transparent, rgba(0,0,0,0.4))',
              display: 'flex', justifyContent: 'center',
              transform: isHovered ? 'translateY(0)' : 'translateY(100%)',
              transition: 'transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
              opacity: isHovered ? 1 : 0
            }}>
              <button 
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(product); }}
                disabled={product.stock === 0}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  border: 'none', borderRadius: '999px',
                  padding: '0.6rem 1.5rem',
                  backgroundColor: 'white', color: 'var(--color-secondary)',
                  fontWeight: 700, fontSize: '0.8rem', fontFamily: 'inherit',
                  cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
                  opacity: product.stock === 0 ? 0.6 : 1,
                  transition: 'all 0.2s',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}
              >
                <ShoppingCart size={14} />
                {product.stock === 0 ? 'Sold Out' : 'Add to Cart'}
              </button>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div style={{ padding: isTouchDevice ? '0.75rem 0.75rem 1rem' : '1rem 1rem 1.25rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          {/* Category Label */}
          <span style={{ fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-primary-hover)', marginBottom: '0.3rem' }}>
            {product.category}
          </span>
          
          {/* Title */}
          <h3 style={{ fontSize: isTouchDevice ? '0.85rem' : '0.95rem', margin: 0, fontWeight: 600, color: 'var(--color-text-main)', lineHeight: 1.4, marginBottom: '0.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {product.title}
          </h3>
          
          {/* Price + Stock */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
            <span style={{ fontWeight: 800, fontSize: isTouchDevice ? '1rem' : '1.1rem', color: 'var(--color-secondary)' }}>
              ${product.price.toFixed(2)}
            </span>
            <span style={{ fontSize: '0.65rem', fontWeight: 500, color: product.stock > 0 ? '#10B981' : '#EF4444' }}>
              {product.stock > 0 ? 'In Stock' : 'Sold Out'}
            </span>
          </div>

          {/* Mobile Add to Cart — always visible on touch devices */}
          {isTouchDevice && (
            <button 
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(product); }}
              disabled={product.stock === 0}
              className="btn-premium"
              style={{ 
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                border: 'none', borderRadius: '999px',
                padding: '0.5rem 0.75rem',
                fontWeight: 700, fontSize: '0.75rem', fontFamily: 'inherit',
                cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
                opacity: product.stock === 0 ? 0.6 : 1,
                marginTop: '0.6rem', width: '100%'
              }}
            >
              <ShoppingCart size={13} />
              {product.stock === 0 ? 'Sold Out' : 'Add to Cart'}
            </button>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
