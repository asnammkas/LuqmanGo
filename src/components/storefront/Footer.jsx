import { MapPin, Phone, Mail, Instagram, Facebook, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{ 
      backgroundColor: '#FBF5EC', 
      color: '#2C2C2C', 
      padding: '3rem 1.5rem 7rem',
      marginTop: 'auto',
    }}>
      <div className="container" style={{ maxWidth: '600px', margin: '0 auto' }}>

        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ 
            fontSize: '1.3rem', fontWeight: 400, letterSpacing: '0.35em', 
            textTransform: 'uppercase', marginBottom: '0.8rem', color: '#0C2311' 
          }}>
            LuqmanGo
          </h2>
          <p style={{ color: '#706F65', fontSize: '0.82rem', lineHeight: 1.7, maxWidth: '320px', margin: '0 auto' }}>
            Curated essentials for the modern home. Quality craftsmanship meets simplicity.
          </p>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, #D4CFC5, transparent)', margin: '1.5rem 0' }} />

        {/* Quick Links + Contact — side by side on mobile */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '1.5rem',
          marginBottom: '2rem',
        }}>
          {/* Shop Links */}
          <div>
            <h4 style={{ 
              fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', 
              letterSpacing: '0.12em', marginBottom: '1rem', color: '#0C2311' 
            }}>
              Shop
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.82rem' }}>
              <Link to="/" style={{ color: '#706F65', textDecoration: 'none' }}>All Collection</Link>
              <Link to="/" style={{ color: '#706F65', textDecoration: 'none' }}>Electronics</Link>
              <Link to="/" style={{ color: '#706F65', textDecoration: 'none' }}>Home & Living</Link>
              <Link to="/" style={{ color: '#706F65', textDecoration: 'none' }}>Dresses</Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ 
              fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', 
              letterSpacing: '0.12em', marginBottom: '1rem', color: '#0C2311' 
            }}>
              Contact
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.82rem', color: '#706F65' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                <MapPin size={13} style={{ flexShrink: 0, marginTop: '2px' }} /> 
                <span>Kalmunai, Sri Lanka</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Phone size={13} style={{ flexShrink: 0 }} /> 
                <span>072 506 5252</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Mail size={13} style={{ flexShrink: 0 }} /> 
                <span>info@luqmango.lk</span>
              </div>
            </div>
          </div>
        </div>

        {/* Social Icons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <a href="#" style={{ color: '#0C2311', transition: 'opacity 0.2s' }} aria-label="Instagram">
            <Instagram size={18} />
          </a>
          <a href="#" style={{ color: '#0C2311', transition: 'opacity 0.2s' }} aria-label="Facebook">
            <Facebook size={18} />
          </a>
          <a href="#" style={{ color: '#0C2311', transition: 'opacity 0.2s' }} aria-label="Twitter">
            <Twitter size={18} />
          </a>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, #D4CFC5, transparent)', marginBottom: '1.2rem' }} />

        {/* Bottom Bar */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          gap: '0.5rem',
          fontSize: '0.7rem',
          color: '#A09A8E',
        }}>
          <div>© 2026 LuqmanGo. All Rights Reserved.</div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
             <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy</a>
             <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
