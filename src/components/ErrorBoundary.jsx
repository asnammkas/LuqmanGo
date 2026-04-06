import { Component } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { logger } from '../utils/logger';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    // Log to console in development
    logger.error('[ErrorBoundary] Caught error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleGoHome = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="animate-fade-in"
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#F7F3ED',
            padding: '2rem',
          }}
        >
          <div
            style={{
              maxWidth: '480px',
              width: '100%',
              textAlign: 'center',
              padding: '3rem 2rem',
            }}
          >
            {/* Error Icon */}
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: '#FDE8E8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 2rem',
                animation: 'pulse-glow 3s infinite',
              }}
            >
              <AlertTriangle size={36} color="#EF4444" strokeWidth={1.5} />
            </div>

            {/* Title */}
            <h1
              style={{
                fontSize: '1.6rem',
                fontWeight: 700,
                color: '#001d04',
                marginBottom: '0.6rem',
                letterSpacing: '-0.02em',
              }}
            >
              Something went wrong
            </h1>

            {/* Description */}
            <p
              style={{
                fontSize: '0.9rem',
                color: '#706F65',
                lineHeight: 1.6,
                marginBottom: '2rem',
                fontWeight: 400,
              }}
            >
              We encountered an unexpected issue while rendering this page.
              Don't worry — your data is safe. Try refreshing, or head back home.
            </p>

            {/* Error Details (collapsible) */}
            {this.state.error && (
              <details
                style={{
                  textAlign: 'left',
                  backgroundColor: '#EAE1D3',
                  borderRadius: '16px',
                  padding: '1rem 1.2rem',
                  marginBottom: '2rem',
                  fontSize: '0.75rem',
                  color: '#706F65',
                  cursor: 'pointer',
                  border: '1px solid rgba(0,0,0,0.04)',
                }}
              >
                <summary
                  style={{
                    fontWeight: 700,
                    fontSize: '0.7rem',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: '#001d04',
                    marginBottom: '0.5rem',
                    outline: 'none',
                  }}
                >
                  Technical Details
                </summary>
                <pre
                  style={{
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    fontFamily: 'monospace',
                    fontSize: '0.72rem',
                    lineHeight: 1.5,
                    marginTop: '0.8rem',
                    padding: '0.8rem',
                    backgroundColor: '#FBF5EC',
                    borderRadius: '10px',
                    maxHeight: '200px',
                    overflow: 'auto',
                  }}
                >
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack && (
                    <>
                      {'\n\nComponent Stack:'}
                      {this.state.errorInfo.componentStack}
                    </>
                  )}
                </pre>
              </details>
            )}

            {/* Action Buttons */}
            <div
              style={{
                display: 'flex',
                gap: '0.8rem',
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <button
                onClick={this.handleReset}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.85rem 1.8rem',
                  backgroundColor: '#001d04',
                  color: 'white',
                  border: 'none',
                  borderRadius: '14px',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'all 0.2s',
                  boxShadow: '0 8px 25px rgba(0,29,4,0.12)',
                }}
              >
                <RefreshCw size={16} /> Try Again
              </button>

              <button
                onClick={this.handleGoHome}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.85rem 1.8rem',
                  backgroundColor: 'white',
                  color: '#001d04',
                  border: '1px solid rgba(0,0,0,0.08)',
                  borderRadius: '14px',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'all 0.2s',
                }}
              >
                <Home size={16} /> Go Home
              </button>
            </div>

            {/* Brand signature */}
            <div
              style={{
                marginTop: '3rem',
                fontSize: '0.6rem',
                fontWeight: 800,
                letterSpacing: '0.2em',
                color: '#C5BBB0',
                textTransform: 'uppercase',
              }}
            >
              LuqmanGo · Premium Utility
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
