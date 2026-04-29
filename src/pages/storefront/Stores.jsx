import { Helmet } from 'react-helmet-async';
import { Store, Mail, Instagram } from 'lucide-react';
import Footer from '../../components/storefront/Footer';

const Stores = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-bg-main)' }}>
      <Helmet>
        <title>Stores | LuqmanGo</title>
        <meta name="description" content="Discover unique independent stores and brands selling on LuqmanGo. Our seller directory is launching soon." />
      </Helmet>

      <div className="animate-fade-in" style={{ padding: '2rem 1.2rem 4rem', maxWidth: '1280px', width: '100%', boxSizing: 'border-box', margin: '0 auto', flex: 1 }}>
        
        {/* Editorial Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem', marginTop: '1rem' }}>
           <h1 style={{ fontSize: '3rem', fontWeight: 300, letterSpacing: '0.1em', marginBottom: '1rem', color: '#0C2311' }}>Our Stores</h1>
           <div style={{ width: '60px', height: '1.5px', backgroundColor: '#436132', margin: '0 auto 1.5rem', opacity: 0.3 }}></div>
           <p style={{ maxWidth: '600px', margin: '0 auto', color: '#706F65', lineHeight: 1.8, fontSize: '0.95rem' }}>
             Discover a curated collection of independent brands and unique sellers. Shop directly from our growing community of stores all in one place.
           </p>
        </div>

        {/* Coming Soon Announcement */}
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '24px', 
          padding: '3rem 2rem',
          boxShadow: '0 10px 40px rgba(0,0,0,0.03)',
          border: '1px solid rgba(0,0,0,0.05)',
          textAlign: 'center',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <Store size={48} color="#C5D1B8" style={{ margin: '0 auto 1.5rem' }} />
          <h2 style={{ fontSize: '2rem', fontWeight: 400, color: '#0C2311', marginBottom: '1rem' }}>Store Directory Coming Soon</h2>
          <p style={{ fontSize: '1.05rem', color: '#706F65', lineHeight: 1.6, maxWidth: '500px', margin: '0 auto' }}>
            We are currently onboarding incredible new sellers and partner stores to our platform. 
            Soon, you'll be able to explore and shop from a diverse marketplace of brands.
          </p>
        </div>

        {/* Brand Mission Overlay */}
        <div style={{ 
          marginTop: '3rem', 
          backgroundColor: '#0C2311', 
          borderRadius: '32px', 
          padding: '3rem 2rem', 
          textAlign: 'center',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          maxWidth: '800px',
          margin: '3rem auto 0'
        }}>
           <div style={{ opacity: 0.1, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(circle, #5C7444 0%, transparent 70%)' }} />
           <h3 style={{ fontSize: '2rem', fontWeight: 400, marginBottom: '1.5rem', position: 'relative', color: 'white' }}>Become a Seller</h3>
           <p style={{ maxWidth: '600px', margin: '0 auto 2.5rem', opacity: 0.8, lineHeight: 1.8, fontSize: '1rem', position: 'relative' }}>
             Are you a brand or creator looking to reach a wider audience? Join LuqmanGo as a partner store and start selling with us.
           </p>
           <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', position: 'relative' }}>
              <a href="mailto:partners@luqmango.com" className="btn btn-primary" style={{ backgroundColor: '#F7F3ED', color: '#113013', borderRadius: '50px', padding: '0.8rem 2rem' }}>
                 <Mail size={18} style={{ marginRight: '0.5rem' }} /> Partner with us
              </a>
           </div>
        </div>

      </div>
      <Footer />
    </div>
  );
};

export default Stores;
