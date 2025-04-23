/**
 * Format a UNIX timestamp to full date string
 * @param {number} timestamp - UNIX timestamp in seconds
 * @returns {string} - Formatted date string
 */
export const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  /**
   * Format a UNIX timestamp to week start date
   * @param {number} timestamp - UNIX timestamp in seconds
   * @returns {string} - Formatted short date string
   */
  export const formatWeekStart = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  /**
   * Convert timestamp array to dates for Highcharts
   * @param {Array} data - Array containing timestamp data
   * @returns {Array} - Array of timestamps in milliseconds
   */
  export const getWeeklyTimestamps = (data) => {
    return data.map(item => item[0] * 1000); // Convert to milliseconds for Highcharts
  };
  
  /**
   * Format a date for GitHub API query
   * @param {Date} date - Date object
   * @returns {string} - Date in YYYY-MM-DD format
   */
  export const formatDateForGitHub = (date) => {
    return date.toISOString().split('T')[0];
  };