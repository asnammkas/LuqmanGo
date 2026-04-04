import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search, ShoppingBag } from 'lucide-react';

const NotFound = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '2rem',
      backgroundColor: '#F7F3ED',
      textAlign: 'center'
    }}>
      {/* Ambient Background Gradient */}
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80vw',
        height: '80vw',
        background: 'radial-gradient(circle, rgba(0, 29, 4, 0.03) 0%, transparent 70%)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Large 404 text with Luqman signature style */}
        <h1 style={{ 
          fontSize: 'clamp(6rem, 20vw, 12rem)', 
          margin: 0, 
          fontWeight: 900, 
          color: 'rgba(0, 29, 4, 0.05)',
          letterSpacing: '-0.05em',
          lineHeight: 1
        }}>
          404
        </h1>

        <div style={{ marginTop: '-2rem' }}>
          <h2 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 700, 
            color: '#001d04', 
            marginBottom: '1rem',
            letterSpacing: '-0.02em'
          }}>
            Lost in the archive.
          </h2>
          <p style={{ 
            color: '#706F65', 
            maxWidth: '400px', 
            margin: '0 auto 3rem',
            fontSize: '1.1rem',
            lineHeight: 1.6
          }}>
            The page you are looking for has been moved or curated out of our current collection.
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
          <Link 
            to="/" 
            className="btn btn-primary" 
            style={{ 
              padding: '1.2rem 3rem', 
              fontSize: '1rem', 
              fontWeight: 700, 
              borderRadius: '50px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.8rem',
              width: 'fit-content'
            }}
          >
            <Home size={20} />
            Continue Shopping
          </Link>

          <Link 
            to="/category/All" 
            style={{ 
              color: '#706F65', 
              textDecoration: 'none', 
              fontSize: '0.9rem', 
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginTop: '1rem',
              padding: '0.5rem 1rem'
            }}
          >
            <Search size={16} />
            Explore Full Collection
          </Link>
        </div>
      </div>

      {/* Aesthetic Footer Detail */}
      <div style={{ position: 'absolute', bottom: '5vh', opacity: 0.3 }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.4em', color: '#001d04' }}>
          LUQMANGO ECO-SYSTE&M
        </div>
      </div>
    </div>
  );
};

export default NotFound;
