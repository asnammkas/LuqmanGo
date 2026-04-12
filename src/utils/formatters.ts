/**
 * Core application formatters localized for Sri Lanka (LKR, Date/Time).
 */

/**
 * Formats a number into a localized Sri Lankan Rupee (LKR) string.
 * @param {number} amount - The numeric amount.
 * @returns {string} - The formatted currency string, e.g., "LKR 1,500.00"
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Formats a generic date string/object into a localized string format.
 * Defaults to "DD MMM YYYY, hh:mm AM/PM" (e.g. 12 Apr 2026, 04:30 PM).
 * 
 * @param {Date | string | number | any} dateInput - The Firebase Timestamp, Date object, or date string.
 * @returns {string} - Formatted localized date string.
 */
export const formatDate = (dateInput: any): string => {
  if (!dateInput) return '';

  let dateObj: Date;

  // Handle Firebase Timestamps cleanly if passed
  if (typeof dateInput === 'object' && dateInput.toDate) {
    dateObj = dateInput.toDate();
  } else {
    dateObj = new Date(dateInput);
  }

  // Fallback for invalid dates
  if (isNaN(dateObj.getTime())) {
    return String(dateInput);
  }

  return new Intl.DateTimeFormat('en-LK', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Colombo'
  }).format(dateObj);
};
