import { ArrowLeft, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const ProfileHelp = () => {
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in" style={{ padding: '0.8rem 1.2rem 5rem', maxWidth: '1280px', margin: '0 auto', minHeight: '100vh', backgroundColor: 'var(--color-bg-main)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.2rem' }}>
        <button 
          onClick={() => navigate('/profile')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#001d04', padding: '0.3rem', marginLeft: '-0.3rem' }}
        >
          <ArrowLeft size={18} strokeWidth={2} />
        </button>
        <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#001d04' }}>Curator Support</span>
      </div>
      <p style={{ fontSize: '0.85rem', color: '#706F65', lineHeight: '1.6', fontWeight: 400, marginTop: '-0.3rem', marginBottom: '2.5rem' }}>
        Your direct line to the LuqmanGo concierge. We’re here 24/7 to ensure your journey is effortless and sustainable.
      </p>
      
      <div style={{ marginBottom: '2rem' }}>
         <div style={{ backgroundColor: '#EAE1D3', borderRadius: '16px', padding: '1rem 1.2rem', display: 'flex', alignItems: 'center', gap: '0.8rem', border: '1px solid rgba(0,0,0,0.03)' }}>
            <Link to="#" style={{ color: '#D4CFC5' }}><ChevronRight size={18} style={{ transform: 'rotate(90deg)' }} /></Link>
            <input type="text" placeholder="Search for guidance..." style={{ border: 'none', width: '100%', fontSize: '0.95rem', outline: 'none', color: '#001d04', backgroundColor: 'transparent' }} />
         </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2.5rem' }}>
        {[
          { label: 'Orders', count: '12 articles' },
          { label: 'Returns', count: '8 articles' },
          { label: 'Shipping', count: '5 articles' },
          { label: 'Account', count: '10 articles' }
        ].map((cat, idx) => (
          <div key={idx} style={{ backgroundColor: 'white', padding: '1.5rem 1.2rem', borderRadius: '20px', cursor: 'pointer', transition: 'transform 0.2s', border: '1px solid rgba(0,0,0,0.03)', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
             <h4 style={{ fontWeight: 700, color: '#001d04', marginBottom: '0.2rem', fontSize: '1rem' }}>{cat.label}</h4>
             <p style={{ fontSize: '0.7rem', color: '#706F65', fontWeight: 500 }}>{cat.count}</p>
          </div>
        ))}
      </div>

      <div style={{ backgroundColor: '#001d04', borderRadius: '32px', padding: '2.2rem 1.8rem', color: '#F7F3ED', textAlign: 'center', boxShadow: '0 15px 35px rgba(0,29,4,0.15)' }}>
         <h4 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.8rem', color: '#FFFFFF' }}>Need direct assistance?</h4>
         <p style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '1.8rem', fontWeight: 400, color: '#F7F3ED', lineHeight: 1.5 }}>Our concierge team is available 24/7 for our gold members.</p>
         
         <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
           <button className="btn" style={{ backgroundColor: '#FFFFFF', color: '#001d04', width: '100%', borderRadius: '14px', padding: '1rem', fontWeight: 700, fontSize: '0.9rem', border: 'none', cursor: 'pointer' }}>
             Connect via Live Chat
           </button>
           
           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
             <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" style={{ textDecoration: 'none', backgroundColor: 'rgba(255,255,255,0.15)', color: '#FFFFFF', borderRadius: '14px', padding: '0.85rem', fontWeight: 700, fontSize: '0.8rem', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
               WhatsApp
             </a>
             <a href="mailto:curator@luqmango.com" style={{ textDecoration: 'none', backgroundColor: 'rgba(255,255,255,0.15)', color: '#FFFFFF', borderRadius: '14px', padding: '0.85rem', fontWeight: 700, fontSize: '0.8rem', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
               Email Us
             </a>
           </div>
         </div>
      </div>
    </div>
  );
};

export default ProfileHelp;
