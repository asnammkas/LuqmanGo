import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, LogIn, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import Footer from '../../components/storefront/Footer';
import GoogleSignInButton from '../../components/storefront/GoogleSignInButton';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
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
  const trapRef = useFocusTrap(showResetModal);

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
        setError(`Something went wrong${import.meta.env.DEV ? ` (${code})` : ''}. Please try again.`);
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
      await login(email, password, rememberMe);
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
        setError(`Something went wrong${import.meta.env.DEV ? ` (${code})` : ''}. Please try again.`);
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
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                /> Remember me
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
              {isLoading ? (
                <>
                  <div style={{ width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  Sign In
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
            text="Continue with Google" 
          />

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
            role="dialog"
            aria-modal="true"
            aria-labelledby="reset-modal-title"
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
              ref={trapRef}
              onClick={e => e.stopPropagation()}
              style={{
                backgroundColor: 'white', borderRadius: '24px',
                padding: '2rem', maxWidth: '400px', width: '100%',
                boxShadow: '0 25px 60px rgba(0,0,0,0.2)',
              }}
            >
              <h3 id="reset-modal-title" style={{ fontSize: '1.15rem', fontWeight: 700, color: '#001d04', marginBottom: '0.5rem' }}>
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
