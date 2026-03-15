import { MapPin, Phone, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer>
      {/* Find Us Section */}
      <section style={{ backgroundColor: 'var(--color-bg-card)', padding: '3rem 0', borderTop: '1px solid var(--color-border)' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Find us in Kalmunai</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-text-main)' }}>
                <MapPin size={18} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                <span>Kalmunai, Sri Lanka</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-text-main)' }}>
                <Phone size={18} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                <span>072 506 5252</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-text-main)' }}>
                <Mail size={18} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                <span>info@luqmango.lk</span>
              </div>
            </div>
          </div>
          {/* Map Placeholder */}
          <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', height: '220px', border: '1px solid var(--color-border)' }}>
            <iframe
              title="Kalmunai Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31603.11697271862!2d81.80000000000001!3d7.416666999999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae51f22e06b7c45%3A0x1234567890abcdef!2sKalmunai!5e0!3m2!1sen!2slk!4v1600000000000!5m2!1sen!2slk"
              width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Delivery Areas Ribbon */}
      <div style={{ backgroundColor: 'var(--color-primary)', padding: '0.6rem 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <MapPin size={16} color="white" />
          <span style={{ color: 'white', fontWeight: 600, fontSize: '0.85rem' }}>Delivery Areas: </span>
          <span style={{ color: 'white', fontSize: '0.85rem' }}>Kalmunai, Sainthamaruthu, Karaitheevu, Akkaraipattu & surrounding areas</span>
        </div>
      </div>

      {/* Bottom Footer */}
      <div style={{ backgroundColor: 'var(--color-secondary)', padding: '1.5rem 0' }}>
        <div className="container footer-bottom" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ color: 'white', fontWeight: 700, marginBottom: '0.25rem' }}>LuqmanGo</div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem' }}>Kalmunai, Sri Lanka</div>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <a href="#" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem' }}>Privacy Policy</a>
            <a href="#" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem' }}>Terms of Service</a>
            <a href="#" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem' }}>About Us</a>
            <a href="#" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem' }}>Contact Us</a>
          </div>
          <a href="https://wa.me/94725065252" target="_blank" rel="noreferrer" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1.25rem',
            backgroundColor: '#25D366', color: 'white', borderRadius: 'var(--radius-md)', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none'
          }}>
            WhatsApp Order
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
