import { useShop } from '../../context/ShopContext';
import ProductCard from '../../components/storefront/ProductCard';
import Footer from '../../components/storefront/Footer';
import { Link } from 'react-router-dom';
import { Heart, ArrowLeft, Trash2, ShoppingBag } from 'lucide-react';

const Wishlist = () => {
  const { wishlist, toggleWishlist, toggleCart, isInCart } = useShop();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div className="animate-fade-in" style={{ padding: '0.8rem 1.2rem 5rem', maxWidth: '500px', width: '100%', boxSizing: 'border-box', margin: '0 auto', flex: 1 }}>
        
        {/* Header - Matches Profile's editorial style */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.2rem' }}>
          <Link 
            to="/"
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#001d04', padding: '0.3rem', marginLeft: '-0.3rem', textDecoration: 'none' }}
          >
            <ArrowLeft size={18} strokeWidth={2} />
          </Link>
          <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#001d04' }}>Saved Favourites</span>
        </div>
        <p style={{ fontSize: '0.85rem', color: '#706F65', lineHeight: '1.6', fontWeight: 400, marginTop: '-0.3rem', marginBottom: '2rem' }}>
          Your personal curation of coveted pieces. {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved for later.
        </p>

        {wishlist.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '4rem 1.5rem', 
            backgroundColor: '#EAE1D3', 
            borderRadius: '24px',
            border: '1px solid rgba(0,0,0,0.02)'
          }}>
            <div style={{ 
              width: '70px', height: '70px', borderRadius: '50%', 
              backgroundColor: '#FBF5EC', margin: '0 auto 1.5rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Heart size={28} color="#706F65" strokeWidth={1.5} />
            </div>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', fontWeight: 700, color: '#001d04' }}>Your wishlist is empty</h2>
            <p style={{ color: '#706F65', marginBottom: '2rem', maxWidth: '300px', margin: '0 auto 2rem', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Save your favorite items to keep track of them and find them easily whenever you're ready to shop.
            </p>
            <Link 
              to="/" 
              style={{ 
                display: 'inline-flex', alignItems: 'center', gap: '0.8rem',
                backgroundColor: '#001d04', color: 'white',
                padding: '1rem 2rem', borderRadius: '16px',
                textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem'
              }}
            >
              Explore Collection
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {wishlist.map((product) => (
              <div 
                key={product.id} 
                style={{ 
                  backgroundColor: '#EAE1D3', borderRadius: '20px', padding: '1.2rem',
                  display: 'flex', gap: '1.2rem', alignItems: 'center',
                  border: '1px solid rgba(0,0,0,0.02)'
                }}
              >
                <Link to={`/product/${product.id}`} style={{ flexShrink: 0 }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '14px', overflow: 'hidden', backgroundColor: '#FBF5EC' }}>
                    <img src={product.image} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                </Link>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#706F65', marginBottom: '0.2rem' }}>
                    {product.category}
                  </div>
                  <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#001d04', marginBottom: '0.3rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {product.title}
                    </h4>
                  </Link>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#001d04' }}>
                    ${product.price?.toFixed(2)}
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexShrink: 0 }}>
                  {/* Quick Add to Bag */}
                  <button 
                    onClick={() => toggleCart(product)}
                    style={{ 
                      width: '32px', height: '32px', borderRadius: '50%',
                      backgroundColor: 'white', 
                      border: '1px solid #000000', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                      cursor: 'pointer',
                      transition: 'transform 0.2s ease'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    title={isInCart(product.id) ? "In your bag" : "Add to bag"}
                  >
                    <ShoppingBag 
                      size={14} 
                      strokeWidth={isInCart(product.id) ? 2.5 : 1.5} 
                      color={isInCart(product.id) ? '#3B82F6' : '#113013'} 
                    />
                  </button>

                  <button 
                    onClick={() => toggleWishlist(product)}
                    style={{ 
                      background: 'none', border: 'none', cursor: 'pointer', 
                      color: '#EF4444', padding: '0.5rem',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                    title="Remove from wishlist"
                  >
                    <Trash2 size={18} strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Wishlist;
