import { Link } from 'react-router-dom';
import { Store, ArrowLeft } from 'lucide-react';
import Footer from '../../components/storefront/Footer';

const StoresComingSoon = () => {
  return (
    <div style={{ backgroundColor: '#FBF5EC', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className="container" style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '6rem 1.5rem',
        textAlign: 'center'
      }}>
        <div style={{ 
          backgroundColor: '#fffcf7', 
          width: '100px', 
          height: '100px', 
          borderRadius: '50%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          marginBottom: '2rem',
          boxShadow: '0 10px 30px rgba(0,0,0,0.03)'
        }}>
          <Store size={40} color="#0C2311" strokeWidth={1.2} />
        </div>

        <h1 style={{ 
          fontSize: 'clamp(2rem, 8vw, 3.5rem)', 
          fontWeight: 600, 
          color: '#0C2311', 
          letterSpacing: '-0.02em',
          marginBottom: '1rem' 
        }}>
          Stores Coming Soon
        </h1>

        <p style={{ 
          fontSize: '1.1rem', 
          lineHeight: 1.6, 
          color: '#706F65', 
          maxWidth: '500px', 
          marginBottom: '3rem',
          fontWeight: 300
        }}>
          We are building a multi-outlet experience to bring LuqmanGo closer to you. Soon, you'll be able to browse and shop from individual branch locations with ease.
        </p>

        <Link 
          to="/" 
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.8rem', 
            backgroundColor: '#0C2311', 
            color: 'white', 
            padding: '1rem 2.5rem', 
            borderRadius: 'var(--radius-md)', 
            textDecoration: 'none',
            fontSize: '0.9rem',
            fontWeight: 600,
            transition: 'transform 0.2s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <ArrowLeft size={16} /> Back to Showcase
        </Link>
      </div>
      <Footer />
    </div>
  );
};

export default StoresComingSoon;
