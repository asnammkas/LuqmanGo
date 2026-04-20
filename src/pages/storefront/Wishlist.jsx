import { useState, useEffect } from 'react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { useProducts } from '../../context/ProductContext';
import { useToast } from '../../context/ToastContext';
import ProductCard from '../../components/storefront/ProductCard';
import Footer from '../../components/storefront/Footer';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ArrowLeft, Trash2, ShoppingBag } from 'lucide-react';

const Wishlist = () => {
  const { wishlist } = useWishlist();
  const { fetchProductById } = useProducts();
  const { toggleCart, isInCart } = useCart();
  const toast = useToast();
  const navigate = useNavigate();

  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const loadProducts = async () => {
      setIsLoading(true);
      if (wishlist.length === 0) {
        if (active) {
          setWishlistProducts([]);
          setIsLoading(false);
        }
        return;
      }

      const promises = wishlist.map(id => fetchProductById(id));
      const results = await Promise.all(promises);
      
      if (active) {
        setWishlistProducts(results.filter(p => !!p));
        setIsLoading(false);
      }
    };

    loadProducts();
    return () => { active = false; };
  }, [wishlist, fetchProductById]);

  const handleMoveAllToBag = () => {
    let movedCount = 0;
    wishlistProducts.forEach(product => {
      if (!isInCart(product.id)) {
        toggleCart(product);
        movedCount++;
      }
    });
    if (movedCount > 0) {
      toast.success(`Success! Added ${movedCount} ${movedCount === 1 ? 'item' : 'items'} to bag`);
    } else {
      toast.info('Items are already in your bag');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div className="animate-fade-in" style={{ 
        padding: '0.8rem 1.2rem 5rem', 
        maxWidth: '1280px', 
        width: '100%', 
        boxSizing: 'border-box', 
        margin: '0 auto', 
        flex: 1 
      }}>
        
        {/* Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <button 
              onClick={() => navigate(-1)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#001d04', padding: '0.3rem', marginLeft: '-0.3rem', textDecoration: 'none' }}
            >
              <ArrowLeft size={18} strokeWidth={2.5} />
            </button>
            <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#001d04', letterSpacing: '0.02em' }}>Saved Favourites</span>
          </div>
          
          {wishlistProducts.length > 0 && (
            <button 
              onClick={handleMoveAllToBag}
              style={{ 
                backgroundColor: '#001d04', 
                color: 'white', 
                border: 'none', 
                padding: '0.6rem 1rem', 
                borderRadius: '100px', 
                fontSize: '0.7rem', 
                fontWeight: 700, 
                letterSpacing: '0.1em', 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                boxShadow: '0 4px 15px rgba(0,29,4,0.15)',
                transition: 'transform 0.2s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              MOVE ALL TO BAG
            </button>
          )}
        </div>

        <p style={{ fontSize: '0.85rem', color: '#706F65', lineHeight: '1.6', fontWeight: 400, marginTop: '-0.3rem', marginBottom: '2rem' }}>
          Your personal curation of coveted pieces. {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'} saved for later.
        </p>

        {isLoading ? (
          <div style={{ height: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <LoadingSpinner size={32} label="Loading favorites..." />
          </div>
        ) : wishlistProducts.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '5rem 2rem', 
            backgroundColor: '#EAE1D3', 
            borderRadius: '32px',
            border: '1px solid rgba(0,0,0,0.02)',
            boxShadow: '0 15px 40px rgba(0,0,0,0.03)'
          }}>
            <div style={{ 
              width: '80px', height: '80px', borderRadius: '50%', 
              backgroundColor: 'white', margin: '0 auto 2rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 25px rgba(0,0,0,0.05)'
            }}>
              <Heart size={32} color="#D4CFC5" strokeWidth={1} />
            </div>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '0.8rem', fontWeight: 700, color: '#001d04', letterSpacing: '-0.01em' }}>Your wishlist is empty</h2>
            <p style={{ color: '#706F65', marginBottom: '2.5rem', maxWidth: '320px', margin: '0 auto 2.5rem', fontSize: '0.95rem', lineHeight: 1.6 }}>
              Save your favorite items to keep track of them and find them easily whenever you're ready to shop.
            </p>
            <Link 
              to="/" 
              style={{ 
                display: 'inline-flex', alignItems: 'center', gap: '0.8rem',
                backgroundColor: '#001d04', color: 'white',
                padding: '1.1rem 2.5rem', borderRadius: '16px',
                textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem',
                letterSpacing: '0.1em', boxShadow: '0 10px 25px rgba(0,29,4,0.15)'
              }}
            >
              EXPLORE COLLECTION
            </Link>
          </div>
        ) : (
          <div className="product-grid">
            {wishlistProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Wishlist;
