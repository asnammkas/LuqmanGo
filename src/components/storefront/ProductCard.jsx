import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import { ShoppingCart, Image as ImageIcon } from 'lucide-react';

const ProductCard = ({ product }) => {
  const { addToCart } = useShop();
  const [imgError, setImgError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="animate-fade-in" 
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%', 
        backgroundColor: 'transparent',
        transition: 'all 0.4s ease',
        cursor: 'pointer'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link 
        to={`/product/${product.id}`} 
        style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, textDecoration: 'none', color: 'inherit' }}
      >
        {/* Image Container with Large Rounded Corners */}
        <div style={{ 
          position: 'relative', 
          aspectRatio: '4 / 5', 
          overflow: 'hidden', 
          borderRadius: 'var(--radius-lg)',
          backgroundColor: '#F3F2EE'
        }}>
          {!imgError ? (
            <img 
              src={product.image} 
              alt={product.title} 
              onError={() => setImgError(true)}
              style={{ 
                width: '100%', height: '100%', objectFit: 'cover', 
                transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                transform: isHovered ? 'scale(1.05)' : 'scale(1)'
              }} 
            />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <ImageIcon size={32} strokeWidth={1} color="var(--color-text-muted)" />
            </div>
          )}

          {/* New/Limited Badge */}
          {product.featured && (
            <div className="badge-limited">Limited</div>
          )}

          {/* Minimal Add to Cart Icon button */}
          <button 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(product); }}
            style={{ 
              position: 'absolute', bottom: '1rem', right: '1rem',
              width: '36px', height: '36px', borderRadius: '50%',
              backgroundColor: 'white', border: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
              opacity: isHovered ? 1 : 0,
              transform: isHovered ? 'translateY(0)' : 'translateY(10px)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              zIndex: 10
            }}
          >
            <ShoppingCart size={14} strokeWidth={1.5} color="var(--color-text-main)" />
          </button>
        </div>

        {/* Info Section - Left aligned as per reference */}
        <div style={{ 
          padding: '1rem 0', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'flex-start',
          textAlign: 'left' 
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'baseline', gap: '0.5rem' }}>
            <h3 style={{ 
              fontSize: '1rem', 
              fontWeight: 500, 
              color: 'var(--color-text-main)', 
              margin: 0,
              letterSpacing: '-0.01em',
              lineHeight: 1.3
            }}>
              {product.title}
            </h3>
            <span style={{ 
              fontSize: '1rem', 
              fontWeight: 400, 
              color: 'var(--color-text-main)' 
            }}>
              ${Math.round(product.price)}
            </span>
          </div>
          
          <span style={{ 
            fontSize: '0.7rem', 
            fontWeight: 600, 
            color: 'var(--color-text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginTop: '0.4rem'
          }}>
            {product.category}
          </span>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
