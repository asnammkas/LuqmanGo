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
  const { fetchProductById, submitReview } = useProducts();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { currentUser } = useAuth();
  const toast = useToast();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  
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

  useEffect(() => {
    if (!id) return;
    const q = query(collection(db, 'products', id, 'reviews'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setReviews(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return toast.error("Please sign in to leave a review.");
    setIsSubmittingReview(true);
    try {
      await submitReview(id, reviewForm.rating, reviewForm.comment, currentUser.displayName);
      toast.success("Review submitted successfully!");
      setReviewForm({ rating: 5, comment: '' });
    } catch (err) {
      toast.error(err.message || "Failed to submit review");
    } finally {
      setIsSubmittingReview(false);
    }
  };

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
              {product.reviewCount > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', backgroundColor: 'rgba(0,0,0,0.04)', padding: '0.3rem 0.6rem', borderRadius: '20px' }}>
                  <Star size={14} fill="#EAB308" color="#EAB308" />
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#113013' }}>{product.rating}</span>
                  <span style={{ fontSize: '0.75rem', color: '#706F65', marginLeft: '0.2rem' }}>({product.reviewCount})</span>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#706F65' }}>LKR</span>
              <span style={{ fontSize: '1.8rem', fontWeight: 700, color: '#436132', letterSpacing: '-0.02em' }}>
                {product.price ? product.price.toLocaleString() : '0'}
              </span>
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

        {/* Reviews Section */}
        <div style={{ marginTop: '5rem', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
            <div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#001d04', marginBottom: '0.4rem', letterSpacing: '-0.01em' }}>Customer Reviews</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ display: 'flex', gap: '2px' }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star key={star} size={16} fill={star <= Math.round(product.rating || 0) ? "#EAB308" : "transparent"} color={star <= Math.round(product.rating || 0) ? "#EAB308" : "#ccc"} />
                  ))}
                </div>
                <span style={{ fontSize: '0.9rem', color: '#706F65' }}>
                  {product.reviewCount ? `Based on ${product.reviewCount} review${product.reviewCount !== 1 ? 's' : ''}` : 'No reviews yet'}
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 2fr)', gap: '4rem', alignItems: 'start' }}>
            {/* Review Form */}
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#001d04', marginBottom: '1.5rem' }}>Write a Review</h3>
              {currentUser ? (
                <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#706F65', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Rating</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, transition: 'transform 0.1s' }}
                          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                          <Star size={28} fill={star <= reviewForm.rating ? "#EAB308" : "transparent"} color={star <= reviewForm.rating ? "#EAB308" : "#ccc"} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#706F65', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Comment</label>
                    <textarea 
                      required
                      rows={4}
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                      placeholder="Share your experience with this product..."
                      style={{ 
                        width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', 
                        fontFamily: 'inherit', resize: 'vertical', outline: 'none', transition: 'border-color 0.2s',
                        boxSizing: 'border-box'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#00C853'}
                      onBlur={(e) => e.target.style.borderColor = 'rgba(0,0,0,0.1)'}
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={isSubmittingReview}
                    className="btn"
                    style={{ 
                      padding: '1rem', backgroundColor: '#001d04', color: 'white', borderRadius: '12px', 
                      fontWeight: 600, border: 'none', cursor: isSubmittingReview ? 'not-allowed' : 'pointer',
                      opacity: isSubmittingReview ? 0.7 : 1, transition: 'all 0.2s'
                    }}
                  >
                    {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              ) : (
                <div style={{ padding: '2.5rem 1.5rem', textAlign: 'center', backgroundColor: '#F3F2EE', borderRadius: '16px' }}>
                  <p style={{ fontSize: '0.95rem', color: '#113013', marginBottom: '1.2rem', lineHeight: 1.5 }}>
                    Please sign in to share your experience with this product.
                  </p>
                  <Link to="/signin" className="btn" style={{ padding: '0.8rem 1.5rem', backgroundColor: '#001d04', color: 'white', borderRadius: '10px', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}>
                    Sign In
                  </Link>
                </div>
              )}
            </div>

            {/* Reviews List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {reviews.length === 0 ? (
                <div style={{ padding: '3rem', textAlign: 'center', backgroundColor: '#F7F3ED', borderRadius: '24px', border: '1px dashed rgba(0,0,0,0.1)' }}>
                  <Star size={32} color="#ccc" style={{ marginBottom: '1rem' }} />
                  <p style={{ color: '#706F65', fontSize: '1rem' }}>No reviews yet. Be the first to review this product!</p>
                </div>
              ) : (
                reviews.map(review => (
                  <div key={review.id} style={{ padding: '1.5rem', backgroundColor: 'white', borderRadius: '20px', border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem' }}>
                      <div>
                        <h4 style={{ margin: '0 0 0.2rem', fontSize: '1rem', fontWeight: 600, color: '#113013' }}>{review.userName}</h4>
                        <div style={{ display: 'flex', gap: '2px' }}>
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star key={star} size={14} fill={star <= review.rating ? "#EAB308" : "transparent"} color={star <= review.rating ? "#EAB308" : "#ccc"} />
                          ))}
                        </div>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: '#999' }}>
                        {review.createdAt?.toDate ? review.createdAt.toDate().toLocaleDateString() : 'Just now'}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#4A4A4A', lineHeight: 1.6 }}>
                      {DOMPurify.sanitize(review.comment)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;
