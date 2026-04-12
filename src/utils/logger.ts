import * as Sentry from "@sentry/react";

/**
 * Centralized logging utility for LuqmanGo.
 * Integrates with Sentry for real-time error tracking.
 */

const isDevelopment = import.meta.env.MODE === 'development';

interface ErrorReportPayload {
  message: string;
  error: any;
  stack?: string;
  timestamp: string;
  url: string;
}

export const logger = {
  /**
   * Logs general information. Suppressed in production.
   */
  info: (message: string, ...args: any[]) => {
    if (isDevelopment) {
      console.info(`[LuqmanGo INFO]: ${message}`, ...args);
    }
  },

  /**
   * Logs warnings.
   */
  warn: (message: string, ...args: any[]) => {
    if (isDevelopment) {
      console.warn(`[LuqmanGo WARN]: ${message}`, ...args);
    }
  },

  /**
   * Logs critical errors. These are tracked in Sentry in production.
   */
  error: (message: string, errorObj: any = null) => {
    if (isDevelopment) {
      console.error(`[LuqmanGo ERROR]: ${message}`);
      if (errorObj) {
        console.error(errorObj);
      }
    } else {
      // PROD: Sentry Integration
      Sentry.captureException(errorObj || new Error(message), {
        extra: { customMessage: message }
      });

      const reportPayload: ErrorReportPayload = {
        message,
        error: errorObj?.message || errorObj,
        stack: errorObj?.stack,
        timestamp: new Date().toISOString(),
        url: window.location.href
      };

      console.error(`[LuqmanGo PROD ERROR]:`, reportPayload);
    }
  },

  /**
   * Track custom analytics events.
   */
  trackEvent: (eventName: string, data: Record<string, any> = {}) => {
    if (isDevelopment) {
      console.debug(`[Analytics Event]: ${eventName}`, data);
    }
    // In production, this would call Firebase Analytics:
    // logEvent(analytics, eventName, data);
  }
};
