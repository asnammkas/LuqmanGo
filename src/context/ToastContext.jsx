import { createContext, useContext, useState, useCallback, useRef } from 'react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

const TOAST_ICONS = {
  success: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M6 10.5L8.5 13L14 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  error: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M7 7L13 13M13 7L7 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  info: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M10 9V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="10" cy="6.5" r="0.75" fill="currentColor"/>
    </svg>
  ),
  warning: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 2L19 18H1L10 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M10 8V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="10" cy="15" r="0.75" fill="currentColor"/>
    </svg>
  ),
};

const TOAST_STYLES = {
  success: { bg: '#E4EDDB', color: '#1B5E20', border: 'rgba(67,97,50,0.15)', progressColor: '#436132' },
  error:   { bg: '#FDE8E8', color: '#991B1B', border: 'rgba(239,68,68,0.15)', progressColor: '#EF4444' },
  info:    { bg: '#EAE1D3', color: '#001d04', border: 'rgba(0,29,4,0.1)',     progressColor: '#706F65' },
  warning: { bg: '#FEF9C3', color: '#854D0E', border: 'rgba(234,179,8,0.2)',  progressColor: '#EAB308' },
};

const Toast = ({ toast, onDismiss }) => {
  const style = TOAST_STYLES[toast.type] || TOAST_STYLES.info;

  return (
    <div
      className={`toast-item toast-${toast.exiting ? 'exit' : 'enter'}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.9rem 1.1rem',
        borderRadius: '16px',
        backgroundColor: style.bg,
        color: style.color,
        border: `1px solid ${style.border}`,
        boxShadow: '0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)',
        backdropFilter: 'blur(12px)',
        minWidth: '280px',
        maxWidth: '420px',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        fontFamily: 'inherit',
      }}
      onClick={() => onDismiss(toast.id)}
    >
      {/* Icon */}
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
        {TOAST_ICONS[toast.type] || TOAST_ICONS.info}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {toast.title && (
          <div style={{ fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.15rem', letterSpacing: '-0.01em' }}>
            {toast.title}
          </div>
        )}
        <div style={{ fontSize: '0.8rem', fontWeight: 500, lineHeight: 1.4, opacity: 0.85 }}>
          {toast.message}
        </div>
      </div>

      {/* Close button */}
      <button
        onClick={(e) => { e.stopPropagation(); onDismiss(toast.id); }}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: style.color, opacity: 0.4, padding: '2px',
          display: 'flex', alignItems: 'center', flexShrink: 0,
          transition: 'opacity 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
        onMouseLeave={e => e.currentTarget.style.opacity = '0.4'}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M3 3L11 11M11 3L3 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>

      {/* Auto-dismiss progress bar */}
      <div
        className="toast-progress"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: '2.5px',
          backgroundColor: style.progressColor,
          opacity: 0.35,
          borderRadius: '0 0 16px 16px',
          animation: `toastProgress ${toast.duration || 4000}ms linear forwards`,
        }}
      />
    </div>
  );
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t));
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 300);
  }, []);

  const toast = useCallback(({ type = 'info', title, message, duration = 4000 }) => {
    const id = ++idRef.current;
    setToasts(prev => [...prev, { id, type, title, message, duration, exiting: false }]);

    if (duration > 0) {
      setTimeout(() => dismiss(id), duration);
    }

    return id;
  }, [dismiss]);

  // Convenience methods
  const success = useCallback((message, title) => toast({ type: 'success', title, message }), [toast]);
  const error   = useCallback((message, title) => toast({ type: 'error', title, message, duration: 6000 }), [toast]);
  const info    = useCallback((message, title) => toast({ type: 'info', title, message }), [toast]);
  const warning = useCallback((message, title) => toast({ type: 'warning', title, message, duration: 5000 }), [toast]);

  return (
    <ToastContext.Provider value={{ toast, success, error, info, warning, dismiss }}>
      {children}

      {/* Toast Container - Fixed position */}
      <div
        style={{
          position: 'fixed',
          top: '1rem',
          right: '1rem',
          zIndex: 99999,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.6rem',
          pointerEvents: 'none',
        }}
      >
        {toasts.map(t => (
          <div key={t.id} style={{ pointerEvents: 'auto' }}>
            <Toast toast={t} onDismiss={dismiss} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
