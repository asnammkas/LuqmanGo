import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, LogIn, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Footer from '../../components/storefront/Footer';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetStatus, setResetStatus] = useState({ type: '', message: '' });
  const [isResetting, setIsResetting] = useState(false);
  const { login, loginWithGoogle, resetPassword } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the redirect destination from state, defaulting to home
  const from = location.state?.from?.pathname || '/';

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!resetEmail.trim()) {
      setResetStatus({ type: 'error', message: 'Please enter your email address.' });
      return;
    }
    setIsResetting(true);
    setResetStatus({ type: '', message: '' });
    try {
      await resetPassword(resetEmail);
      setResetStatus({ type: 'success', message: 'Password reset email sent! Check your inbox.' });
      toast.success('Password reset email sent!');
    } catch (err) {
      const code = err.code;
      if (code === 'auth/user-not-found') {
        setResetStatus({ type: 'error', message: 'No account found with this email address.' });
      } else if (code === 'auth/invalid-email') {
        setResetStatus({ type: 'error', message: 'Please enter a valid email address.' });
      } else {
        setResetStatus({ type: 'error', message: 'Failed to send reset email. Please try again.' });
      }
    } finally {
      setIsResetting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setIsLoading(true);
    try {
      await loginWithGoogle();
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Google SignIn Error:', err);
      const code = err.code;
      if (code === 'auth/popup-closed-by-user') {
        // User closed the popup, don't show an error
      } else {
        setError(`Error (${code}): Google sign-in failed. Please try again.`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      toast.success('Signed in successfully!');
      navigate(from, { replace: true });
    } catch (err) {
      console.error('SignIn Error:', err);
      const code = err.code;
      if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        setError('Invalid email or password. Please try again.');
      } else if (code === 'auth/too-many-requests') {
        setError('Too many failed attempts. Please try again later.');
      } else if (code === 'auth/invalid-email') {
        setError('The email address provided is not valid.');
      } else {
        setError(`Error (${code}): Something went wrong. Please try again.`);
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
          <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#001d04' }}>Welcome Back</span>
        </div>
        <p style={{ fontSize: '0.85rem', color: '#706F65', lineHeight: '1.6', fontWeight: 400, marginTop: '-0.3rem', marginBottom: '2.5rem' }}>
          Sign in to secure your personal curation and access your exclusive arrivals.
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
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
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
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: 'var(--radius-md)', border: '2px solid var(--color-border)', backgroundColor: 'transparent', color: 'var(--color-text-main)', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s', opacity: isLoading ? 0.6 : 1 }}
                onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--color-text-muted)' }}>
                <input type="checkbox" /> Remember me
              </label>
              <button 
                type="button" 
                onClick={() => { setShowResetModal(true); setResetEmail(email); setResetStatus({ type: '', message: '' }); }}
                style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem', padding: 0 }}
              >
                Forgot Password?
              </button>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={isLoading}
              style={{ padding: '1rem', fontSize: '1.1rem', fontWeight: 700, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem', opacity: isLoading ? 0.7 : 1, cursor: isLoading ? 'not-allowed' : 'pointer' }}
            >
              <LogIn size={20} />
              {isLoading ? 'Signing in...' : 'Sign In'}
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
            Continue with Google
          </button>

          <div style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--color-secondary)', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              Create Account <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Forgot Password Modal */}
        {showResetModal && (
          <div 
            onClick={() => setShowResetModal(false)}
            style={{
              position: 'fixed', inset: 0, zIndex: 9999,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(4px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '1.5rem',
              animation: 'fadeIn 0.2s ease'
            }}
          >
            <div 
              onClick={e => e.stopPropagation()}
              style={{
                backgroundColor: 'white', borderRadius: '24px',
                padding: '2rem', maxWidth: '400px', width: '100%',
                boxShadow: '0 25px 60px rgba(0,0,0,0.2)',
              }}
            >
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#001d04', marginBottom: '0.5rem' }}>
                Reset Password
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#706F65', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Enter your email address and we'll send you a link to reset your password.
              </p>

              {resetStatus.message && (
                <div style={{ 
                  padding: '0.8rem 1rem', borderRadius: '12px', marginBottom: '1rem',
                  backgroundColor: resetStatus.type === 'success' ? '#E4EDDB' : '#FEF2F2',
                  color: resetStatus.type === 'success' ? '#436132' : '#991B1B',
                  fontSize: '0.85rem', fontWeight: 500,
                  display: 'flex', alignItems: 'center', gap: '0.5rem'
                }}>
                  <AlertCircle size={14} />
                  {resetStatus.message}
                </div>
              )}

              <form onSubmit={handleResetPassword}>
                <div style={{ position: 'relative', marginBottom: '1.2rem' }}>
                  <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '1rem', color: 'var(--color-text-muted)' }}>
                    <Mail size={18} />
                  </div>
                  <input 
                    type="email" 
                    placeholder="Email Address" 
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                    disabled={isResetting}
                    style={{ width: '100%', padding: '0.9rem 1rem 0.9rem 2.8rem', borderRadius: '12px', border: '2px solid var(--color-border)', backgroundColor: 'transparent', color: 'var(--color-text-main)', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button 
                    type="button" 
                    onClick={() => setShowResetModal(false)}
                    style={{ flex: 1, padding: '0.85rem', borderRadius: '14px', border: '1px solid rgba(0,0,0,0.08)', backgroundColor: 'white', color: '#706F65', fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer', fontFamily: 'inherit' }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={isResetting}
                    style={{ flex: 1, padding: '0.85rem', borderRadius: '14px', border: 'none', backgroundColor: '#001d04', color: 'white', fontWeight: 700, fontSize: '0.88rem', cursor: isResetting ? 'not-allowed' : 'pointer', opacity: isResetting ? 0.7 : 1, fontFamily: 'inherit' }}
                  >
                    {isResetting ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default SignIn;
