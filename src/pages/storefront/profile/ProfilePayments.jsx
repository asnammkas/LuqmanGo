import { ArrowLeft, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProfilePayments = () => {
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
        <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#001d04' }}>Payments</span>
      </div>
      <p style={{ fontSize: '0.85rem', color: '#706F65', lineHeight: '1.6', fontWeight: 400, marginTop: '-0.3rem', marginBottom: '2.5rem', maxWidth: '700px' }}>
        Securely manage your preferred payment methods. Your financial integrity is our primary commitment.
      </p>
      <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#EAE1D3', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
          <CreditCard size={32} color="#706F65" />
        </div>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#001d04', marginBottom: '0.6rem' }}>Payment Integration Coming Soon</h3>
        <p style={{ fontSize: '0.88rem', color: '#706F65', lineHeight: 1.6, maxWidth: '400px', margin: '0 auto 2rem' }}>
          We're building a secure, seamless payment experience. For now, orders are confirmed via WhatsApp.
        </p>
      </div>
    </div>
  );
};

export default ProfilePayments;
