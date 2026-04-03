import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import useDocumentMeta from '../../hooks/useDocumentMeta';
import Footer from '../../components/storefront/Footer';

const TermsPage = () => {
  useDocumentMeta('Terms of Service', 'Review the terms and conditions governing your use of LuqmanGo services and products.');
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
          <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#001d04' }}>Terms of Service</span>
        </div>
        <p style={{ fontSize: '0.85rem', color: '#706F65', lineHeight: '1.6', fontWeight: 400, marginTop: '-0.3rem', marginBottom: '1.5rem' }}>
          The framework that governs our partnership. By using LuqmanGo, you agree to the principles outlined below.
        </p>

        <div style={{ backgroundColor: '#EAE1D3', borderRadius: '24px', padding: '2rem 1.5rem', color: '#001d04', border: '1px solid rgba(0,0,0,0.02)', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#706F65', letterSpacing: '0.1em', marginBottom: '1.5rem' }}>EFFECTIVE MARCH 2024</div>
          
          {[
            { h: "Acceptance of Terms", p: "By accessing or using LuqmanGo services, you acknowledge and agree to be bound by these terms. If you do not agree, please discontinue use of our platform." },
            { h: "Account Responsibilities", p: "You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account." },
            { h: "Intellectual Property", p: "All content, designs, and branding on LuqmanGo are protected intellectual property. Reproduction without written consent is strictly prohibited." },
            { h: "Limitation of Liability", p: "LuqmanGo shall not be liable for any indirect, incidental, or consequential damages arising from the use of our services or products." }
          ].map((section, idx) => (
            <div key={idx} style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.6rem', letterSpacing: '-0.01em' }}>{section.h}</h3>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.7, color: '#706F65', fontWeight: 400 }}>{section.p}</p>
            </div>
          ))}

          <div style={{ marginTop: '2.5rem', padding: '1.2rem', backgroundColor: '#FBF5EC', borderRadius: '16px' }}>
            <p style={{ fontSize: '0.8rem', color: '#706F65', margin: 0, fontStyle: 'italic', fontWeight: 500 }}>For legal inquiries, reach us at legal@luqmango.com</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TermsPage;
