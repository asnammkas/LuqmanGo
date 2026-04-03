import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import useDocumentMeta from '../../hooks/useDocumentMeta';
import Footer from '../../components/storefront/Footer';

const DeliveryPolicyPage = () => {
  useDocumentMeta('Delivery Policy', 'Learn about LuqmanGo shipping timelines, tracking, returns, and our commitment to sustainable logistics.');
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className="animate-fade-in" style={{ padding: '0.8rem 1.2rem 4rem', maxWidth: '500px', width: '100%', boxSizing: 'border-box', margin: '0 auto', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1rem' }}>
          <Link 
            to="/"
            aria-label="Back to home"
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#001d04', padding: '0.3rem', marginLeft: '-0.3rem', textDecoration: 'none' }}
          >
            <ArrowLeft size={18} strokeWidth={2} />
          </Link>
          <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#001d04' }}>Delivery Policy</span>
        </div>
        <p style={{ fontSize: '0.85rem', color: '#706F65', lineHeight: '1.6', fontWeight: 400, marginTop: '-0.3rem', marginBottom: '1.5rem' }}>
          How we bring your curated selections to your doorstep, sustainably and reliably.
        </p>

        <div style={{ backgroundColor: '#EAE1D3', borderRadius: '24px', padding: '2rem 1.5rem', color: '#001d04', border: '1px solid rgba(0,0,0,0.02)', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#706F65', letterSpacing: '0.1em', marginBottom: '1.5rem' }}>SHIPPING STANDARDS</div>
          
          {[
            { h: "Delivery Timeline", p: "Standard delivery takes 3–7 business days depending on your location. Express delivery options are available for select areas within 24–48 hours." },
            { h: "Shipping Fees", p: "We offer free standard shipping on all orders above ₹500. Orders below this threshold carry a flat ₹49 delivery fee to maintain our sustainable logistics network." },
            { h: "Order Tracking", p: "Once your order is dispatched, you will receive a tracking ID via WhatsApp and email. Real-time updates are available through your LuqmanGo account dashboard." },
            { h: "Returns & Refunds", p: "We accept returns within 7 days of delivery for unused items in original packaging. Refunds are processed within 5–7 business days to your original payment method." }
          ].map((section, idx) => (
            <div key={idx} style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.6rem', letterSpacing: '-0.01em' }}>{section.h}</h3>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.7, color: '#706F65', fontWeight: 400 }}>{section.p}</p>
            </div>
          ))}

          <div style={{ marginTop: '2.5rem', padding: '1.2rem', backgroundColor: '#FBF5EC', borderRadius: '16px' }}>
            <p style={{ fontSize: '0.8rem', color: '#706F65', margin: 0, fontStyle: 'italic', fontWeight: 500 }}>Delivery questions? Reach our logistics team at delivery@luqmango.com</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DeliveryPolicyPage;
