/**
 * Centralized logging utility for LuqmanGo.
 * In a real production environment, this would integrate with Firebase Crashlytics,
 * Sentry, Datadog, or another application performance monitoring (APM) tool.
 * 
 * For now, it provides a unified development interface that suppresses extraneous 
 * logs outside of development mode and formats error outputs securely.
 */

const isDevelopment = import.meta.env.MODE === 'development';

export const logger = {
  /**
   * Logs general information. Suppressed in production.
   */
  info: (message, ...args) => {
    if (isDevelopment) {
      console.info(`[LuqmanGo INFO]: ${message}`, ...args);
    }
  },

  /**
   * Logs warnings (e.g., deprecated usage, transient failures).
   */
  warn: (message, ...args) => {
    if (isDevelopment) {
      console.warn(`[LuqmanGo WARN]: ${message}`, ...args);
    } else {
      // In production, you might sample these or send to an APM
    }
  },

  /**
   * Logs critical errors. These should ALWAYS be tracked in production.
   */
  error: (message, errorObj = null) => {
    if (isDevelopment) {
      console.error(`[LuqmanGo ERROR]: ${message}`);
      if (errorObj) {
        console.error(errorObj);
      }
    } else {
      // PROD: Send to Crashlytics / Sentry
      // Example: Sentry.captureException(errorObj, { extra: { context: message } });
      
      // Fallback for current deployment to ensure errors are still visible in browser tools if needed
      console.error(`[Error Tracking]: Encountered a critical issue. Please contact support if this persists.`);
    }
  },

  /**
   * Optional custom metric tracker
   */
  trackEvent: (eventName, data = {}) => {
    if (isDevelopment) {
      console.debug(`[Analytics Event]: ${eventName}`, data);
    }
    // PROD: logEvent(analytics, eventName, data);
  }
};
