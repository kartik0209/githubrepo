/**
 * GitHub API service
 * Handles all API requests to GitHub endpoints
 */

const BASE_URL = 'https://api.github.com';

/**
 * Calculate date string based on time frame
 * @param {string} timeFrame - Time frame (1w, 2w, 1m)
 * @returns {string} - ISO date string
 */
const getDateStringForTimeFrame = (timeFrame) => {
  const today = new Date();
  let daysToSubtract;
  
  switch(timeFrame) {
    case '1w':
      daysToSubtract = 7;
      break;
    case '2w':
      daysToSubtract = 14;
      break;
    case '1m':
    default:
      daysToSubtract = 30;
      break;
  }
  
  const pastDate = new Date(today);
  pastDate.setDate(today.getDate() - daysToSubtract);
  return pastDate.toISOString().split('T')[0];
};

/**
 * Fetch repositories created in the specified time frame
 * @param {string} timeFrame - Time frame (1w, 2w, 1m)
 * @param {number} page - Page number for pagination
 * @returns {Promise} - Promise resolving to repository data
 */
export const fetchRepositories = async (timeFrame, page = 1) => {
  const dateString = getDateStringForTimeFrame(timeFrame);
  const url = `${BASE_URL}/search/repositories?q=created:>${dateString}&sort=stars&order=desc&page=${page}&per_page=30`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 403) {
        throw new Error('API rate limit exceeded. Please try again later.');
      }
      throw new Error('Failed to fetch repositories');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching repositories:', error);
    throw error;
  }
};

/**
 * Fetch code frequency statistics (additions/deletions per week)
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @returns {Promise} - Promise resolving to code frequency data
 */
export const fetchCodeFrequency = async (owner, repo) => {
  const url = `${BASE_URL}/repos/${owner}/${repo}/stats/code_frequency`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 202) {
        // GitHub is computing the stats, try again after a delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        return fetchCodeFrequency(owner, repo);
      }
      
      if (response.status === 403) {
        throw new Error('API rate limit exceeded. Please try again later.');
      }
      
      throw new Error('Failed to fetch code frequency stats');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching code frequency:', error);
    throw error;
  }
};

/**
 * Fetch commit activity statistics (commits per week)
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @returns {Promise} - Promise resolving to commit activity data
 */
export const fetchCommitActivity = async (owner, repo) => {
  const url = `${BASE_URL}/repos/${owner}/${repo}/stats/commit_activity`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 202) {
        // GitHub is computing the stats, try again after a delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        return fetchCommitActivity(owner, repo);
      }
      
      if (response.status === 403) {
        throw new Error('API rate limit exceeded. Please try again later.');
      }
      
      throw new Error('Failed to fetch commit activity stats');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching commit activity:', error);
    throw error;
  }
};

/**
 * Fetch contributors statistics
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @returns {Promise} - Promise resolving to contributors data
 */
export const fetchContributors = async (owner, repo) => {
  const url = `${BASE_URL}/repos/${owner}/${repo}/stats/contributors`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 202) {
        // GitHub is computing the stats, try again after a delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        return fetchContributors(owner, repo);
      }
      
      if (response.status === 403) {
        throw new Error('API rate limit exceeded. Please try again later.');
      }
      
      throw new Error('Failed to fetch contributors stats');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching contributors:', error);
    throw error;
  }
};