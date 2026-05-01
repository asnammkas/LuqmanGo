import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';
import { formatCurrency } from '../../utils/formatters';
import { ShoppingBag, Image as ImageIcon, Heart, Star } from 'lucide-react';

const ProductCard = ({ product }) => {
  const { toggleCart, isInCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const toast = useToast();
  const [imgError, setImgError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const isHearted = isInWishlist(product.id);
  const isBagged = isInCart(product.id);

  return (
    <div 
      className="card" 
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
          backgroundColor: '#F3F2EE',
          border: '1px solid rgba(0,0,0,0.08)'
        }}>
          {!imgError ? (
            <img 
              src={product.image} 
              alt={product.title} 
              loading="lazy"
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

          {/* Discount Badge */}
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <div className="badge-discount">
              <span style={{ fontSize: '0.6rem', opacity: 0.8 }}>SAVE</span>
              <span>{Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}%</span>
            </div>
          )}

          {/* Wishlist Heart Button */}
          <button 
            aria-label={isHearted ? "Remove from wishlist" : "Add to wishlist"}
            onClick={(e) => { 
              e.preventDefault(); e.stopPropagation(); 
              toggleWishlist(product);
              if (!isHearted) {
                toast.success(`${product.title} saved to wishlist`);
              } else {
                toast.info(`Removed from wishlist`);
              }
            }}
            style={{ 
              position: 'absolute', top: '0.75rem', right: '0.75rem',
              width: '32px', height: '32px', borderRadius: '50%',
              backgroundColor: 'white', 
              border: '1px solid #000000', 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              cursor: 'pointer', zIndex: 10,
              transition: 'transform 0.2s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <Heart 
              size={15} 
              fill={isHearted ? '#EF4444' : 'transparent'} 
              color={isHearted ? '#EF4444' : '#113013'} 
              strokeWidth={isHearted ? 1 : 1.5}
            />
          </button>

          {/* Quick Add to Bag button */}
          <button 
            aria-label={isBagged ? "Remove from cart" : "Add to cart"}
            onClick={(e) => { 
              e.preventDefault(); e.stopPropagation(); 
              toggleCart(product);
              if (!isBagged) {
                toast.success(`${product.title} added to bag`);
              } else {
                toast.info(`Removed from bag`);
              }
            }}
            style={{ 
              position: 'absolute', bottom: '0.75rem', right: '0.75rem',
              width: '32px', height: '32px', borderRadius: '50%',
              backgroundColor: 'white', 
              border: '1px solid #000000', 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              cursor: 'pointer', zIndex: 10,
              transition: 'transform 0.2s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <ShoppingBag 
              size={14} 
              strokeWidth={isBagged ? 2.5 : 1.5} 
              fill="none" 
              color={isBagged ? '#3B82F6' : '#113013'} 
            />
          </button>
        </div>

        {/* Info Section - Left aligned as per reference */}
        <div style={{ 
          padding: '0.8rem 0.4rem', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'flex-start',
          textAlign: 'left' 
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'flex-start', gap: '0.4rem' }}>
            <h3 style={{ 
              fontSize: '0.95rem', 
              fontWeight: 500, 
              color: '#001d04', 
              margin: 0,
              letterSpacing: '-0.01em',
              lineHeight: 1.4,
              width: '100%',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {product.title}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#9CA3AF', textDecoration: 'line-through', lineHeight: 1 }}>
                  {formatCurrency(product.compareAtPrice)}
                </span>
              )}
              <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#436132', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                {formatCurrency(product.price)}
              </span>
            </div>
          </div>
          
          <span style={{ 
            fontSize: '0.65rem', 
            fontWeight: 700, 
            color: '#587541',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            marginTop: '0.6rem'
          }}>
            {product.category}
          </span>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
