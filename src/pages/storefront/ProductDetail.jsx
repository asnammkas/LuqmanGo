import { useParams, Link } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import { ShoppingCart, ArrowLeft, Truck, ShieldCheck, Clock } from 'lucide-react';
import Footer from '../../components/storefront/Footer';

const ProductDetail = () => {
  const { id } = useParams();
  const { products, addToCart } = useShop();
  
  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <h2>Product not found</h2>
        <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>
          Back to Store
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="container" style={{ padding: '2rem 1.5rem 4rem' }}>
        
        {/* Back Button */}
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', textDecoration: 'none', marginBottom: '2rem', fontWeight: 600 }}>
          <ArrowLeft size={18} /> Back to Products
        </Link>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
          
          {/* Left Column - Image Placeholder */}
          <div style={{ backgroundColor: '#F8F8F8', borderRadius: 'var(--radius-lg)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
             <img src={product.image} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover', maxHeight: '500px' }} />
          </div>

          {/* Right Column - Details */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            
            {/* Category Breadcrumb */}
            <span style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>
              {product.category}
            </span>

            {/* Title */}
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-secondary)', lineHeight: 1.1, marginBottom: '1rem' }}>
              {product.title}
            </h1>

            {/* Price */}
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '1.5rem' }}>
              ${product.price.toFixed(2)}
            </div>

            {/* Description */}
            <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              {product.description}
            </p>

            {/* Stock & Add to Cart */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '3rem', padding: '1.5rem 0', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Availability</span>
                {product.stock > 0 ? (
                  <span style={{ color: '#43A047', fontWeight: 700, fontSize: '1.1rem' }}>In Stock ({product.stock})</span>
                ) : (
                  <span style={{ color: '#E53935', fontWeight: 700, fontSize: '1.1rem' }}>Out of Stock</span>
                )}
              </div>

              <button 
                className="btn btn-primary"
                style={{ 
                  flexGrow: 1, height: '3.5rem', fontSize: '1.1rem', display: 'flex', justifyContent: 'center', gap: '0.75rem',
                  opacity: product.stock === 0 ? 0.5 : 1, cursor: product.stock === 0 ? 'not-allowed' : 'pointer'
                }}
                onClick={() => addToCart(product)}
                disabled={product.stock === 0}
              >
                <ShoppingCart size={22} />
                Add to Cart
              </button>
            </div>

            {/* Trust Badges / Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--color-text-main)' }}>
                <Truck size={24} color="var(--color-primary)" />
                <div>
                  <div style={{ fontWeight: 700 }}>Fast Delivery</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Delivery within 1-2 business days in Kalmunai area.</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--color-text-main)' }}>
                <ShieldCheck size={24} color="var(--color-primary)" />
                <div>
                  <div style={{ fontWeight: 700 }}>Quality Assured</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>We guarantee the quality of all our products.</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--color-text-main)' }}>
                <Clock size={24} color="var(--color-primary)" />
                <div>
                  <div style={{ fontWeight: 700 }}>Customer Support</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Available 9AM - 8PM, 7 days a week.</div>
                </div>
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
