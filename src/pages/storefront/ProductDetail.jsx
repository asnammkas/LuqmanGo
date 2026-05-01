import { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useProducts } from '../../context/ProductContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../config/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { ArrowLeft, Truck, ShieldCheck, Clock, Image as ImageIcon, Heart, Minus, Plus, Star } from 'lucide-react';
import Footer from '../../components/storefront/Footer';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const ProductDetail = () => {
  const { id } = useParams();
  const { fetchProductById } = useProducts();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const toast = useToast();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  
  const isHearted = isInWishlist(id);

  useEffect(() => {
    let active = true;
    const loadProduct = async () => {
      setLoading(true);
      const data = await fetchProductById(id);
      if (active) {
        setProduct(data);
        setLoading(false);
      }
    };
    loadProduct();
    return () => { active = false; };
  }, [id, fetchProductById]);

  if (loading) {
    return (
      <div style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <LoadingSpinner size={32} label="Curating Experience..." />
      </div>
    );
  }

  if (!product) {
    return (
      <>
        <div className="container" style={{ padding: '8rem 1.5rem', textAlign: 'center' }}>
          <h2 style={{ fontWeight: 300, letterSpacing: '0.1em' }}>Product not found</h2>
          <Link to="/" style={{ color: 'var(--color-text-main)', textDecoration: 'underline', marginTop: '2rem', display: 'inline-block', fontSize: '0.9rem' }}>
            Back to Collection
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Helmet>
        <title>{product.title} | LuqmanGo</title>
        <meta name="description" content={product.description?.substring(0, 150) + "..." || `Buy ${product.title} at LuqmanGo.`} />
        <meta property="og:title" content={`${product.title} | LuqmanGo`} />
        <meta property="og:description" content={product.description?.substring(0, 150) + "..." || `Buy ${product.title} at LuqmanGo.`} />
        <meta property="og:type" content="product" />
        <meta property="og:image" content={product.image} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${product.title} | LuqmanGo`} />
      </Helmet>
      <div className="animate-fade-in" style={{ padding: '0.8rem 1.2rem 5rem', maxWidth: '1280px', width: '100%', boxSizing: 'border-box', margin: '0 auto', flex: 1 }}>
        
        {/* Editorial Header - Unified Pattern */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.2rem' }}>
          <Link 
            to="/"
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#001d04', padding: '0.3rem', marginLeft: '-0.3rem', textDecoration: 'none' }}
          >
            <ArrowLeft size={18} strokeWidth={2} />
          </Link>
          <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#001d04' }}>{product.category}</span>
        </div>
        <p style={{ fontSize: '0.85rem', color: '#706F65', lineHeight: '1.6', fontWeight: 400, marginTop: '-0.3rem', marginBottom: '2.5rem' }}>
          Selected for its uncompromising quality, sustainable sourcing, and timeless appeal.
        </p>

        <div className="product-detail-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)', gap: '2rem', alignItems: 'start' }}>
          
          {/* Left Column - Large Focused Image with Wishlist Button */}
          <div style={{ 
            position: 'relative',
            backgroundColor: '#F3F2EE', 
            borderRadius: 'var(--radius-lg)', 
            overflow: 'hidden', 
            aspectRatio: '4 / 5'
          }}>
             {product.image ? (
               <img src={product.image} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
             ) : (
               <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <ImageIcon size={48} strokeWidth={1} color="var(--color-text-muted)" />
               </div>
             )}

             {/* Discount Badge */}
             {product.compareAtPrice && product.compareAtPrice > product.price && (
               <div className="badge-discount">
                 <span style={{ fontSize: '0.6rem', opacity: 0.8 }}>SAVE</span>
                 <span>{Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}%</span>
               </div>
             )}

             {/* Wishlist Heart Button - Moved from details */}
             <button 
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product); }}
                style={{ 
                  position: 'absolute', top: '1.25rem', right: '1.25rem',
                  width: '36px', height: '36px', borderRadius: '50%',
                  backgroundColor: 'white', 
                  border: '1px solid #000000',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                  cursor: 'pointer', zIndex: 10,
                  transition: 'transform 0.2s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <Heart 
                  size={18} 
                  fill={isHearted ? '#EF4444' : 'transparent'} 
                  color={isHearted ? '#EF4444' : '#113013'} 
                  strokeWidth={isHearted ? 1 : 1.5}
                />
              </button>
          </div>

          {/* Right Column - Elegant Grouped Details */}
          <div style={{ 
            backgroundColor: '#EAE1D3', 
            borderRadius: '32px', 
            padding: '2rem 1.75rem',
            display: 'flex', 
            flexDirection: 'column',
            boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
            height: 'fit-content'
          }}>
            
            <div style={{ 
              fontSize: '0.6rem', 
              fontWeight: 700, 
              textTransform: 'uppercase', 
              letterSpacing: '0.15em', 
              color: '#706F65', 
              marginBottom: '0.6rem' 
            }}>
              Curated Selection
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <h1 style={{ 
                fontSize: '2.5rem', 
                fontWeight: 700, 
                color: '#001d04', 
                lineHeight: 1.1, 
                letterSpacing: '-0.02em',
                margin: 0
              }}>
                {product.title}
              </h1>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span style={{ fontSize: '1.2rem', fontWeight: 500, color: '#9CA3AF', textDecoration: 'line-through' }}>
                  LKR {product.compareAtPrice.toLocaleString()}
                </span>
              )}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#706F65' }}>LKR</span>
                <span style={{ fontSize: '1.8rem', fontWeight: 700, color: '#436132', letterSpacing: '-0.02em' }}>
                  {product.price ? product.price.toLocaleString() : '0'}
                </span>
              </div>
            </div>

            <div 
              style={{ 
                color: '#001d04', 
                fontSize: '0.95rem', 
                lineHeight: 1.5, 
                marginBottom: '0.8rem',
                opacity: 0.8,
                fontWeight: 300
              }}
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product.description || '') }}
            />

            {/* Total Price Display - Compact Layout */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: '0.6rem',
              marginTop: '0.5rem',
              padding: '0 0.2rem'
            }}>
              <span style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', color: '#706F65', letterSpacing: '0.1em' }}>
                Subtotal
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.2rem' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#706F65' }}>LKR</span>
                <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#001d04', letterSpacing: '-0.01em' }}>
                  {(product.price * quantity).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Actions Grid - Swapped Positions for Ergonomics */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                backgroundColor: 'white', 
                borderRadius: '12px', 
                padding: '4px',
                border: '1px solid rgba(0,0,0,0.05)',
                width: 'fit-content'
              }}>
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ background: 'none', border: 'none', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Minus size={16} />
                </button>
                <span style={{ width: '40px', textAlign: 'center', fontWeight: 600, fontSize: '1rem' }}>{quantity}</span>
                <button 
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                  style={{ background: 'none', border: 'none', width: '36px', height: '36px', cursor: quantity >= product.stock ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: quantity >= product.stock ? 0.3 : 1 }}
                >
                  <Plus size={16} />
                </button>
              </div>

              <button 
                onClick={() => {
                  addToCart(product, quantity);
                  toast.success(`${product.title} added to bag`);
                }}
                disabled={product.stock <= 0}
                className="btn"
                style={{ 
                  flexGrow: 1, 
                  height: '3.5rem', 
                  backgroundColor: product.stock <= 0 ? '#6b7a6d' : '#001d04', 
                  color: 'white', 
                  borderRadius: '12px',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  letterSpacing: '0.15em',
                  transition: 'all 0.2s ease',
                  cursor: product.stock <= 0 ? 'not-allowed' : 'pointer',
                  opacity: product.stock <= 0 ? 0.7 : 1
                }}
              >
                {product.stock <= 0 ? 'SOLD OUT' : 'ADD TO BAG'}
              </button>
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8rem', color: '#001d04' }}>
                    <Truck size={16} strokeWidth={1} />
                    <span style={{ fontWeight: 300 }}>Complimentary shipping on orders over LKR 15000</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8rem', color: '#001d04' }}>
                    <ShieldCheck size={16} strokeWidth={1} />
                    <span style={{ fontWeight: 300 }}>Secure payment processing</span>
                </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;
