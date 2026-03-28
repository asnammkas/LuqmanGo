import { MapPin, Phone, Mail, Instagram, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{ 
      backgroundColor: '#EAE1D3', 
      color: '#2C2C2C', 
      padding: '3rem 1.5rem 7rem',
      marginTop: 'auto',
    }}>
      <div className="container" style={{ maxWidth: '600px', margin: '0 auto' }}>

        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ 
            fontSize: '1.3rem', fontWeight: 400, letterSpacing: '0.35em', 
            textTransform: 'none', marginBottom: '0.8rem', color: '#0C2311' 
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
              <Link to="/category/All" style={{ color: '#706F65', textDecoration: 'none' }}>All Collection</Link>
              <Link to="/category/Electronics" style={{ color: '#706F65', textDecoration: 'none' }}>Electronics</Link>
              <Link to="/category/Home & Living" style={{ color: '#706F65', textDecoration: 'none' }}>Home & Living</Link>
              <Link to="/category/Dresses" style={{ color: '#706F65', textDecoration: 'none' }}>Dresses</Link>
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
                <span>luqmangolk@gmail.com</span>
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
          <a href="https://wa.me/94725065252" target="_blank" rel="noopener noreferrer" style={{ color: '#0C2311', transition: 'opacity 0.2s' }} aria-label="WhatsApp">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
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
