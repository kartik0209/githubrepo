// src/utils/formatters.js

/**
 * Format a Unix timestamp to a localized date string
 * @param {number} ts - Unix timestamp in seconds
 * @returns {string} Formatted date string
 */
export const formatDate = (ts) =>
    new Date(ts * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  
  /**
   * Format number with locale-specific thousands separators
   * @param {number} num - Number to format
   * @returns {string} Formatted number
   */
  export const formatNumber = (num) => {
    return num.toLocaleString();
  };