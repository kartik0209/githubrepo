// src/api/github.js
import axios from 'axios';

// Create an axios instance with default configuration
const githubApi = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    'Accept': 'application/vnd.github.v3+json'
  }
});

// Add API key if available
if (import.meta.env.VITE_GITHUB_API_KEY) {
  githubApi.interceptors.request.use(config => {
    config.headers.Authorization = `token ${import.meta.env.VITE_GITHUB_API_KEY}`;
    return config;
  });
}

// Handle rate limiting and errors
githubApi.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // GitHub API rate limit handling
      if (error.response.status === 403 && error.response.headers['x-ratelimit-remaining'] === '0') {
        const resetTime = new Date(error.response.headers['x-ratelimit-reset'] * 1000);
        error.message = `GitHub API rate limit exceeded. Reset at ${resetTime.toLocaleTimeString()}`;
      }
      // For 404 errors
      else if (error.response.status === 404) {
        error.message = 'Repository not found. Please check the owner and repository name.';
      }
    }
    return Promise.reject(error);
  }
);

// Helper to compute GitHub "created:>YYYY-MM-DD" param
export function getSinceDate(timeFrame) {
  const now = new Date();
  if (timeFrame === '1w') now.setDate(now.getDate() - 7);
  else if (timeFrame === '2w') now.setDate(now.getDate() - 14);
  else now.setMonth(now.getMonth() - 1);
  return now.toISOString().split('T')[0];
}

export const githubService = {
  /**
   * Search for repositories based on creation date and sorted by stars
   */
  searchRepositories: (timeFrame, page = 1, perPage = 30) => {
    const since = getSinceDate(timeFrame);
    return githubApi.get('/search/repositories', {
      params: {
        q: `created:>${since}`,
        sort: 'stars',
        order: 'desc',
        page,
        per_page: perPage,
      }
    });
  },

  /**
   * Get repository code frequency stats
   */
  getCodeFrequency: (owner, repo) => {
    return githubApi.get(`/repos/${owner}/${repo}/stats/code_frequency`);
  },

  /**
   * Get repository commit activity
   */
  getCommitActivity: (owner, repo) => {
    return githubApi.get(`/repos/${owner}/${repo}/stats/commit_activity`);
  },

  /**
   * Get repository contributors statistics
   */
  getContributors: (owner, repo) => {
    return githubApi.get(`/repos/${owner}/${repo}/stats/contributors`);
  }
};

export default githubService;