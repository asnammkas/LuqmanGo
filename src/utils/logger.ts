import * as Sentry from "@sentry/react";

/**
 * Centralized logging utility for LuqmanGo.
 * Integrates with Sentry for real-time error tracking and outputs 
 * structured JSON logs for Google Cloud Logging in production.
 */

const isDevelopment = import.meta.env.MODE === 'development';
const isProd = import.meta.env.MODE === 'production';

interface ErrorReportPayload {
  message: string;
  error?: any;
  stack?: string;
  timestamp: string;
  url: string;
}

export const logger = {
  /**
   * Logs general information.
   */
  info: (message: string, context: Record<string, any> = {}) => {
    if (isProd) {
      console.info(JSON.stringify({ severity: 'INFO', message, context, timestamp: new Date().toISOString() }));
    } else {
      console.info(`%c[INFO] ${message}`, 'color: #00bcd4', context);
    }
  },

  /**
   * Logs warnings.
   */
  warn: (message: string, context: Record<string, any> = {}) => {
    if (isProd) {
      console.warn(JSON.stringify({ severity: 'WARNING', message, context, timestamp: new Date().toISOString() }));
    } else {
      console.warn(`%c[WARN] ${message}`, 'color: #ff9800', context);
    }
  },

  /**
   * Logs critical errors. These are tracked in Sentry in production.
   */
  error: (message: string, errorObj: any = null, context: Record<string, any> = {}) => {
    if (isProd) {
      const parsedError = errorObj instanceof Error 
        ? { message: errorObj.message, name: errorObj.name, stack: errorObj.stack }
        : errorObj;

      console.error(JSON.stringify({ 
        severity: 'ERROR', 
        message, 
        error: parsedError,
        context,
        timestamp: new Date().toISOString() 
      }));

      // Sentry Integration
      Sentry.captureException(errorObj || new Error(message), {
        extra: { customMessage: message, ...context }
      });
    } else {
      console.error(`%c[ERROR] ${message}`, 'color: #f44336; font-weight: bold', errorObj, context);
    }
  },

  /**
   * Track custom analytics events.
   */
  trackEvent: (eventName: string, data: Record<string, any> = {}) => {
    if (isDevelopment) {
      console.debug(`[Analytics Event]: ${eventName}`, data);
    }
    // In production, this would call Firebase Analytics
  }
};
