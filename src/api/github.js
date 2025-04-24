import axios from 'axios';

const githubApi = axios.create({
  baseURL: 'https://api.github.com',
  headers: { Accept: 'application/vnd.github.v3+json' }
});

githubApi.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      if (error.response.status === 403 && error.response.headers['x-ratelimit-remaining'] === '0') {
        const resetTime = new Date(error.response.headers['x-ratelimit-reset'] * 1000);
        error.message = `GitHub API rate limit exceeded. Reset at ${resetTime.toLocaleTimeString()}`;
      } else if (error.response.status === 404) {
        error.message = 'Repository not found. Please check the owner and repository name.';
      }
    }
    return Promise.reject(error);
  }
);

export function getSinceDate(timeFrame) {
  const now = new Date();
  if (timeFrame === '1w') now.setDate(now.getDate() - 7);
  else if (timeFrame === '2w') now.setDate(now.getDate() - 14);
  else now.setMonth(now.getMonth() - 1);
  return now.toISOString().split('T')[0];
}

export const githubService = {
  searchRepositories: (timeFrame, page = 1, perPage = 30) => {
    const since = getSinceDate(timeFrame);
    return githubApi.get('/search/repositories', {
      params: { q: `created:>${since}`, sort: 'stars', order: 'desc', page, per_page: perPage }
    });
  },
  getCodeFrequency: (owner, repo) => githubApi.get(`/repos/${owner}/${repo}/stats/code_frequency`),
  getCommitActivity: (owner, repo) => githubApi.get(`/repos/${owner}/${repo}/stats/commit_activity`),
  getContributors: (owner, repo) => githubApi.get(`/repos/${owner}/${repo}/stats/contributors`)
};

export default githubService;
