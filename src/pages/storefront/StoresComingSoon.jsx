import { Link } from 'react-router-dom';
import { Store, ArrowLeft } from 'lucide-react';
import useDocumentMeta from '../../hooks/useDocumentMeta';
import Footer from '../../components/storefront/Footer';

const StoresComingSoon = () => {
  useDocumentMeta('Stores', 'LuqmanGo physical boutiques are coming soon. Stay notified about new store locations near you.');
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', backgroundColor: 'var(--color-bg-main)' }}>
      <div className="animate-fade-in" style={{ padding: '0.8rem 1.2rem 5rem', maxWidth: '1280px', width: '100%', boxSizing: 'border-box', margin: '0 auto', flex: 1 }}>
        
        {/* Editorial Header - Unified Pattern */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.2rem' }}>
          <Link 
            to="/"
            aria-label="Back to home"
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#001d04', padding: '0.3rem', marginLeft: '-0.3rem', textDecoration: 'none' }}
          >
            <ArrowLeft size={18} strokeWidth={2} />
          </Link>
          <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#001d04' }}>Physical Boutiques</span>
        </div>
        <p style={{ fontSize: '0.85rem', color: '#706F65', lineHeight: '1.6', fontWeight: 400, marginTop: '-0.3rem', marginBottom: '2.5rem' }}>
          Our physical spaces are being meticulously crafted to offer a sensory experience of our curated collection across multiple locations.
        </p>

        <div style={{ 
          textAlign: 'center', 
          padding: '4rem 1.5rem', 
          backgroundColor: '#EAE1D3', 
          borderRadius: '24px',
          border: '1px solid rgba(0,0,0,0.02)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          maxWidth: '600px',
          margin: '3rem auto 0'
        }}>
          <div style={{ 
            width: '70px', height: '70px', borderRadius: '50%', 
            backgroundColor: '#FBF5EC', margin: '0 auto 1.5rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Store size={28} color="#706F65" strokeWidth={1.5} />
          </div>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', fontWeight: 700, color: '#001d04' }}>Coming Soon</h2>
          <p style={{ color: '#706F65', marginBottom: '2rem', maxWidth: '300px', margin: '0 auto 2rem', fontSize: '0.9rem', lineHeight: 1.6 }}>
            We are building a multi-outlet experience to bring LuqmanGo closer to your doorstep.
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
            Stay Notified
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default StoresComingSoon;
