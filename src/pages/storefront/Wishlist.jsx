import { useShop } from '../../context/ShopContext';
import ProductCard from '../../components/storefront/ProductCard';
import Footer from '../../components/storefront/Footer';
import { Link } from 'react-router-dom';
import { Heart, ArrowLeft } from 'lucide-react';

const Wishlist = () => {
  const { wishlist } = useShop();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className="container" style={{ padding: '4rem 1.5rem 6rem', flex: 1 }}>
        
        {/* Header */}
        <div style={{ marginBottom: '3rem' }}>
            <h1 style={{ 
              fontSize: 'clamp(2rem, 6vw, 3rem)', 
              fontWeight: 600, 
              color: 'var(--color-text-main)', 
              marginBottom: '1rem',
              letterSpacing: '-0.02em'
            }}>
              Your Wishlist
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', fontWeight: 300 }}>
              {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved for later
            </p>
        </div>

        {wishlist.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '5rem 1rem', 
            backgroundColor: 'var(--color-bg-card)', 
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)'
          }}>
            <div style={{ 
              width: '80px', height: '80px', borderRadius: '50%', 
              backgroundColor: 'var(--color-bg-main)', margin: '0 auto 1.5rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Heart size={32} color="var(--color-text-muted)" strokeWidth={1} />
            </div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 500 }}>Your wishlist is empty</h2>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '2.5rem', maxWidth: '400px', margin: '0 auto 2.5rem' }}>
              Save your favorite items to keep track of them and find them easily whenever you're ready to shop.
            </p>
            <Link 
              to="/" 
              style={{ 
                display: 'inline-flex', alignItems: 'center', gap: '0.8rem',
                backgroundColor: 'var(--color-text-main)', color: 'white',
                padding: '1rem 2rem', borderRadius: 'var(--radius-md)',
                textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem'
              }}
            >
              <ArrowLeft size={16} /> Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="product-grid">
            {wishlist.map((product) => (
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
