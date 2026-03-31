import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, UserPlus, ArrowLeft, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Footer from '../../components/storefront/Footer';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    setError('');
    setIsLoading(true);
    try {
      await loginWithGoogle();
      navigate('/');
    } catch (err) {
      console.error('Google Sign-up Error:', err);
      const code = err.code;
      if (code === 'auth/popup-closed-by-user') {
        // User closed the popup, don't show an error
      } else {
        setError(`Error (${code}): Google registration failed. Please try again.`);
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
      await signup(name, email, password);
      navigate('/');
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
          <Link 
            to="/"
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#001d04', padding: '0.3rem', marginLeft: '-0.3rem', textDecoration: 'none' }}
          >
            <ArrowLeft size={18} strokeWidth={2} />
          </Link>
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
              <UserPlus size={20} />
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
            
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', margin: '1.8rem 0', gap: '1rem' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-border)', opacity: 0.5 }}></div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#706F65', letterSpacing: '0.1em' }}>OR</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-border)', opacity: 0.5 }}></div>
          </div>

          {/* Google Sign In Button */}
          <button 
            type="button" 
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            style={{ 
              width: '100%', 
              padding: '0.9rem', 
              borderRadius: 'var(--radius-md)', 
              border: '1.5px solid var(--color-border)', 
              backgroundColor: 'white', 
              color: 'var(--color-text-main)', 
              fontSize: '1rem', 
              fontWeight: 600, 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              gap: '0.75rem', 
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              opacity: isLoading ? 0.6 : 1,
              boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
            }}
            onMouseOver={(e) => {
              if (!isLoading) {
                e.currentTarget.style.backgroundColor = '#FBF5EC';
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
                e.currentTarget.style.borderColor = 'rgba(0, 29, 4, 0.15)';
              }
            }}
            onMouseOut={(e) => {
              if (!isLoading) {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.02)';
                e.currentTarget.style.borderColor = 'var(--color-border)';
              }
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Register with Google
          </button>

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
