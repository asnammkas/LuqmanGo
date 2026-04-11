import { Helmet } from 'react-helmet-async';
import { MapPin, Clock, Phone, Mail, Instagram, ArrowRight } from 'lucide-react';
import Footer from '../../components/storefront/Footer';

const Stores = () => {
  const storeLocations = [
    {
      city: "Kalmunai",
      address: "No. 42 Main Street, Kalmunai, Sri Lanka",
      hours: "Mon - Sun: 9:00 AM - 8:30 PM",
      phone: "+94 72 506 5252",
      email: "kalmunai@luqmango.com",
      status: "Primary Boutique",
      isPrimary: true
    },
    {
      city: "Colombo (Coming Soon)",
      address: "Marine Drive, Colombo 03, Sri Lanka",
      hours: "Opening Early 2026",
      phone: "Inquiries: +94 72 506 5252",
      email: "colombo@luqmango.com",
      status: "Flagship Store",
      isPrimary: false
    }
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-bg-main)' }}>
      <Helmet>
        <title>Our Boutiques | LuqmanGo</title>
        <meta name="description" content="Visit our premium boutiques across Sri Lanka. Experience curated essentials in person at LuqmanGo Kalmunai and our upcoming Colombo flagship." />
      </Helmet>

      <div className="animate-fade-in" style={{ padding: '2rem 1.2rem 6rem', maxWidth: '1280px', width: '100%', boxSizing: 'border-box', margin: '0 auto', flex: 1 }}>
        
        {/* Editorial Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem', marginTop: '2rem' }}>
           <h1 style={{ fontSize: '3rem', fontWeight: 300, letterSpacing: '0.1em', marginBottom: '1rem', color: '#0C2311' }}>Our Boutiques</h1>
           <div style={{ width: '60px', height: '1.5px', backgroundColor: '#436132', margin: '0 auto 1.5rem', opacity: 0.3 }}></div>
           <p style={{ maxWidth: '600px', margin: '0 auto', color: '#706F65', lineHeight: 1.8, fontSize: '0.95rem' }}>
             Step into a world where quality craftsmanship meets modern simplicity. Our boutiques are designed to be sanctuaries of curated essentials.
           </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
           {storeLocations.map((store, i) => (
             <div key={i} style={{ 
               backgroundColor: 'white', 
               borderRadius: '24px', 
               padding: '2.5rem',
               boxShadow: '0 10px 40px rgba(0,0,0,0.03)',
               border: store.isPrimary ? '1px solid #113013' : '1px solid rgba(0,0,0,0.05)',
               display: 'flex',
               flexDirection: 'column',
               position: 'relative',
               overflow: 'hidden'
             }}>
               {store.isPrimary && (
                 <div style={{ 
                   position: 'absolute', top: '1.5rem', right: '1.5rem', 
                   backgroundColor: '#113013', color: 'white', 
                   padding: '0.4rem 0.8rem', borderRadius: '50px', 
                   fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', 
                   letterSpacing: '0.1em' 
                 }}>
                   Open Now
                 </div>
               )}
               
               <h2 style={{ fontSize: '1.75rem', fontWeight: 400, color: '#0C2311', marginBottom: '0.5rem' }}>{store.city}</h2>
               <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#A09A8E', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '2rem' }}>
                 {store.status}
               </span>

               <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1 }}>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <MapPin size={20} color="#113013" style={{ flexShrink: 0 }} />
                    <div>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#113013', marginBottom: '0.25rem' }}>Location</h4>
                      <p style={{ fontSize: '0.9rem', color: '#706F65', lineHeight: 1.5 }}>{store.address}</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <Clock size={20} color="#113013" style={{ flexShrink: 0 }} />
                    <div>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#113013', marginBottom: '0.25rem' }}>Boutique Hours</h4>
                      <p style={{ fontSize: '0.9rem', color: '#706F65', lineHeight: 1.5 }}>{store.hours}</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <Phone size={20} color="#113013" style={{ flexShrink: 0 }} />
                    <div>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#113013', marginBottom: '0.25rem' }}>Concierge</h4>
                      <a href={`tel:${store.phone}`} style={{ fontSize: '0.9rem', color: '#706F65', textDecoration: 'none' }}>{store.phone}</a>
                    </div>
                  </div>
               </div>

               <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid #F3F2EE' }}>
                  <button 
                    disabled={!store.isPrimary}
                    style={{ 
                      width: '100%', 
                      padding: '1rem', 
                      backgroundColor: store.isPrimary ? '#113013' : 'transparent', 
                      color: store.isPrimary ? 'white' : '#706F65',
                      border: store.isPrimary ? 'none' : '1px solid #D4CFC5',
                      borderRadius: '12px',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      cursor: store.isPrimary ? 'pointer' : 'not-allowed',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {store.isPrimary ? 'Get Directions' : 'Stay Tuned'}
                    <ArrowRight size={16} />
                  </button>
               </div>
             </div>
           ))}
        </div>

        {/* Brand Mission Overlay */}
        <div style={{ 
          marginTop: '6rem', 
          backgroundColor: '#0C2311', 
          borderRadius: '32px', 
          padding: '4rem 2rem', 
          textAlign: 'center',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}>
           <div style={{ opacity: 0.1, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(circle, #5C7444 0%, transparent 70%)' }} />
           <h3 style={{ fontSize: '2rem', fontWeight: 400, marginBottom: '1.5rem', position: 'relative' }}>The LuqmanGo Experience</h3>
           <p style={{ maxWidth: '600px', margin: '0 auto 2.5rem', opacity: 0.8, lineHeight: 1.8, fontSize: '1rem', position: 'relative' }}>
             Can't make it to our Kalmunai boutique? Follow our journey for updates on our global expansion and new collection drops.
           </p>
           <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', position: 'relative' }}>
              <a href="https://instagram.com" className="btn btn-outline" style={{ borderColor: 'white', color: 'white', borderRadius: '50px', padding: '0.8rem 2rem' }}>
                <Instagram size={18} style={{ marginRight: '0.5rem' }} /> Instagram
              </a>
              <a href="mailto:concierge@luqmango.com" className="btn btn-primary" style={{ backgroundColor: '#F7F3ED', color: '#113013', borderRadius: '50px', padding: '0.8rem 2rem' }}>
                 <Mail size={18} style={{ marginRight: '0.5rem' }} /> Membership
              </a>
           </div>
        </div>

      </div>
      <Footer />
    </div>
  );
};

export default Stores;
