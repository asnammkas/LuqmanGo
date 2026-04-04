import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Footer from '../../components/storefront/Footer';

const PrivacyPolicyPage = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className="animate-fade-in" style={{ padding: '0.8rem 1.2rem 4rem', maxWidth: '500px', width: '100%', boxSizing: 'border-box', margin: '0 auto', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1rem' }}>
          <Link 
            to="/"
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#001d04', padding: '0.3rem', marginLeft: '-0.3rem', textDecoration: 'none' }}
          >
            <ArrowLeft size={18} strokeWidth={2} />
          </Link>
          <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#001d04' }}>Legal & Integrity</span>
        </div>
        <p style={{ fontSize: '0.85rem', color: '#706F65', lineHeight: '1.6', fontWeight: 400, marginTop: '-0.3rem', marginBottom: '1.5rem' }}>
          Committed to transparency and your digital safety. Review our policies, terms, and how we protect your information.
        </p>

        <div style={{ backgroundColor: '#EAE1D3', borderRadius: '24px', padding: '2rem 1.5rem', color: '#001d04', border: '1px solid rgba(0,0,0,0.02)', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#706F65', letterSpacing: '0.1em', marginBottom: '1.5rem' }}>UPDATED MARCH 2024</div>
          
          {[
            { h: "Commitment to Privacy", p: "We treat your data with the same respect we treat our artisans. This policy outlines how we source, use, and protect your identity." },
            { h: "Data Sourcing", p: "We only collect information essential for your delivery experience: shipping coordination, secure gateways, and preferred metrics." },
            { h: "Zero-Leads Policy", p: "We never sell your data to third-party advertisers. Your browsing history remains private perfectly." },
            { h: "Cookie Management", p: "We use minimal, non-invasive cookies exclusively for session management and personalised browsing. No third-party trackers, ever." }
          ].map((section, idx) => (
            <div key={idx} style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.6rem', letterSpacing: '-0.01em' }}>{section.h}</h3>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.7, color: '#706F65', fontWeight: 400 }}>{section.p}</p>
            </div>
          ))}

          <div style={{ marginTop: '2.5rem', padding: '1.2rem', backgroundColor: '#FBF5EC', borderRadius: '16px' }}>
            <p style={{ fontSize: '0.8rem', color: '#706F65', margin: 0, fontStyle: 'italic', fontWeight: 500 }}>Questions? Concierge is at privacy@luqmango.com</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;
