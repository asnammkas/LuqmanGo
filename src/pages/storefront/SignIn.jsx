import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, ArrowRight } from 'lucide-react';
import Footer from '../../components/storefront/Footer';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignIn = (e) => {
    e.preventDefault();
    // In a real app, this would authenticate. Here we just redirect to home.
    navigate('/');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--color-bg-main)' }}>
      <div className="container" style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 1.5rem' }}>
        
        <div style={{ width: '100%', maxWidth: '450px', backgroundColor: 'var(--color-bg-card)', borderRadius: 'var(--radius-lg)', padding: '3rem 2rem', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--color-border)' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-secondary)', marginBottom: '0.5rem' }}>Welcome Back</h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>Sign in to continue to LuqmanGo.</p>
          </div>

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
                style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: 'var(--radius-md)', border: '2px solid var(--color-border)', backgroundColor: 'transparent', color: 'var(--color-text-main)', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s' }}
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
                style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: 'var(--radius-md)', border: '2px solid var(--color-border)', backgroundColor: 'transparent', color: 'var(--color-text-main)', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s' }}
                onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--color-text-muted)' }}>
                <input type="checkbox" /> Remember me
              </label>
              <Link to="#" style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>Forgot Password?</Link>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ padding: '1rem', fontSize: '1.1rem', fontWeight: 700, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}
            >
              <LogIn size={20} />
              Sign In
            </button>
            
          </form>

          <div style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--color-secondary)', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              Create Account <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SignIn;
