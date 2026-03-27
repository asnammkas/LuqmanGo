import { useParams, Link } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import { ShoppingCart, ArrowLeft, Truck, ShieldCheck, Clock, Image as ImageIcon } from 'lucide-react';
import Footer from '../../components/storefront/Footer';

const ProductDetail = () => {
  const { id } = useParams();
  const { products, addToCart } = useShop();
  
  const product = products.find(p => p.id === id);

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
    <div style={{ paddingTop: '70px' }}>
      <div className="container" style={{ padding: '4rem 1.5rem 8rem' }}>
        
        <div className="product-detail-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '5rem', alignItems: 'start' }}>
          
          {/* Left Column - Large Focused Image */}
          <div style={{ 
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
          </div>

          {/* Right Column - Elegant Typography */}
          <div style={{ display: 'flex', flexDirection: 'column', paddingTop: '1rem' }}>
            
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', textDecoration: 'none', marginBottom: '2.5rem', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              <ArrowLeft size={14} /> Back
            </Link>

            <h1 style={{ 
              fontSize: '2.4rem', 
              fontWeight: 400, 
              color: 'var(--color-text-main)', 
              lineHeight: 1.2, 
              marginBottom: '1rem',
              letterSpacing: '0.01em'
            }}>
               {product.title}
            </h1>

            <div style={{ fontSize: '1.5rem', fontWeight: 300, color: 'var(--color-text-main)', marginBottom: '2.5rem' }}>
              ${product.price ? product.price.toFixed(2) : '0.00'}
            </div>

            <div style={{ height: '1px', backgroundColor: 'var(--color-border)', marginBottom: '2.5rem' }}></div>

            <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', lineHeight: 1.8, marginBottom: '3rem' }}>
              {product.description}
            </p>

            <button 
              className="btn"
              style={{ 
                backgroundColor: 'var(--color-text-main)', 
                color: 'white', 
                height: '3.5rem', 
                borderRadius: '0', 
                fontSize: '0.8rem', 
                letterSpacing: '0.2em', 
                textTransform: 'uppercase',
                width: '100%',
                cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
                opacity: product.stock === 0 ? 0.5 : 1
              }}
              onClick={() => addToCart(product)}
              disabled={product.stock === 0}
            >
              {product.stock === 0 ? 'Out of Stock' : 'Add to Bag'}
            </button>

            <div style={{ marginTop: '3rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.85rem' }}>
                    <Truck size={18} strokeWidth={1} />
                    <span>Complimentary shipping on orders over $150</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.85rem' }}>
                    <ShieldCheck size={18} strokeWidth={1} />
                    <span>Secure payment processing</span>
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
