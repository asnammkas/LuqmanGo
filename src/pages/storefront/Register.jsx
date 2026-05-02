import { useState } from 'react';
import DOMPurify from 'dompurify';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, User, UserPlus, ArrowLeft, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Footer from '../../components/storefront/Footer';
import GoogleSignInButton from '../../components/storefront/GoogleSignInButton';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the redirect destination from state, defaulting to home
  const from = location.state?.from?.pathname || '/';

  const handleGoogleSignIn = async () => {
    setError('');
    setIsLoading(true);
    try {
      await loginWithGoogle();
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Google Sign-up Error:', err);
      const code = err.code;
      if (code === 'auth/popup-closed-by-user') {
        // User closed the popup, don't show an error
      } else {
        setError(`Something went wrong${import.meta.env.DEV ? ` (${code})` : ''}. Please try again.`);
      }

    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);

    try {
      await signup(DOMPurify.sanitize(name), email, password);
      navigate(from, { replace: true });
    } catch (err) {
      const code = err.code;
      if (code === 'auth/email-already-in-use') {
        setError('An account with this email already exists.');
      } else if (code === 'auth/weak-password') {
        setError('Password is too weak. Use at least 6 characters.');
      } else if (code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', backgroundColor: 'var(--color-bg-main)' }}>
      <div className="animate-fade-in" style={{ padding: '0.8rem 1.2rem 5rem', maxWidth: '500px', width: '100%', boxSizing: 'border-box', margin: '0 auto', flex: 1 }}>
        
        {/* Editorial Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.2rem' }}>
          <button 
            onClick={() => navigate(-1)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#001d04', padding: '0.3rem', marginLeft: '-0.3rem', textDecoration: 'none' }}
          >
            <ArrowLeft size={18} strokeWidth={2} />
          </button>
          <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#001d04' }}>Join the Collection</span>
        </div>
        <p style={{ fontSize: '0.85rem', color: '#706F65', lineHeight: '1.6', fontWeight: 400, marginTop: '-0.3rem', marginBottom: '2.5rem' }}>
          Create an account to secure your personal curation and experience faster checkout across our entire selection.
        </p>

        <div className="auth-container card" style={{ padding: '2rem' }}>

          {/* Error Message */}
          {error && (
            <div style={{ 
              display: 'flex', alignItems: 'center', gap: '0.6rem',
              backgroundColor: '#FEF2F2', border: '1px solid #FECACA', 
              borderRadius: '12px', padding: '0.8rem 1rem', marginBottom: '1.5rem',
              color: '#991B1B', fontSize: '0.85rem', fontWeight: 500
            }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '1rem', color: 'var(--color-text-muted)' }}>
                <User size={20} />
              </div>
              <input 
                type="text" 
                placeholder="Full Name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading}
                style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: 'var(--radius-md)', border: '2px solid var(--color-border)', backgroundColor: 'transparent', color: 'var(--color-text-main)', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s', opacity: isLoading ? 0.6 : 1 }}
                onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
              />
            </div>

            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '1rem', color: 'var(--color-text-muted)' }}>
                <Mail size={20} />
              </div>
              <input 
                type="email" 
                placeholder="Email Address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: 'var(--radius-md)', border: '2px solid var(--color-border)', backgroundColor: 'transparent', color: 'var(--color-text-main)', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s', opacity: isLoading ? 0.6 : 1 }}
                onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
              />
            </div>

            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '1rem', color: 'var(--color-text-muted)' }}>
                <Lock size={20} />
              </div>
              <input 
                type="password" 
                placeholder="Password (min. 6 characters)" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: 'var(--radius-md)', border: '2px solid var(--color-border)', backgroundColor: 'transparent', color: 'var(--color-text-main)', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s', opacity: isLoading ? 0.6 : 1 }}
                onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={isLoading}
              style={{ padding: '1rem', fontSize: '1.1rem', fontWeight: 700, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem', opacity: isLoading ? 0.7 : 1, cursor: isLoading ? 'not-allowed' : 'pointer' }}
            >
              {isLoading ? (
                <>
                  <div style={{ width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  Creating Account...
                </>
              ) : (
                <>
                  <UserPlus size={20} />
                  Create Account
                </>
              )}
            </button>
            
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', margin: '1.8rem 0', gap: '1rem' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-border)', opacity: 0.5 }}></div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#706F65', letterSpacing: '0.1em' }}>OR</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-border)', opacity: 0.5 }}></div>
          </div>

          <GoogleSignInButton 
            onClick={handleGoogleSignIn} 
            isLoading={isLoading} 
            text="Register with Google" 
          />

          <div style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
            Already have an account?{' '}
            <Link to="/signin" style={{ color: 'var(--color-secondary)', fontWeight: 700, textDecoration: 'none' }}>
              Sign In
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Register;
