import React, { useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box, 
  Typography, 
  CircularProgress, 
  Alert, 
  Grid, 
  Paper,
  Divider
} from '@mui/material';
import { fetchRepositoriesStart } from '../store/repoSlice';
import RepoItem from './RepoItem';
import TimeFilter from './TimeFilter';

/**
 * Component for displaying the list of repositories
 */
const RepoList = () => {
  const dispatch = useDispatch();
  const { repositories, loading, error, hasMore, timeFrame } = useSelector((state) => state.repos);
  const observer = useRef();

  // Initial data fetch on component mount
  useEffect(() => {
    dispatch(fetchRepositoriesStart({ reset: true }));
  }, [dispatch]);

  // Set up intersection observer for infinite scrolling
  const lastRepoRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          dispatch(fetchRepositoriesStart({}));
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, dispatch]
  );

  // Get the time period label for display
  const getTimePeriodLabel = () => {
    switch(timeFrame) {
      case '1w': return 'Last Week';
      case '2w': return 'Last 2 Weeks';
      case '1m': 
      default: return 'Last Month';
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Most Starred GitHub Repositories
      </Typography>
      <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
        {getTimePeriodLabel()}
      </Typography>
      
      <TimeFilter />
      
      <Divider sx={{ my: 3 }} />
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={2}>
        {repositories.map((repo, index) => {
          if (repositories.length === index + 1) {
            return (
              <Grid item xs={12} key={repo.id}>
                <div ref={lastRepoRef}>
                  <RepoItem repo={repo} />
                </div>
              </Grid>
            );
          } else {
            return (
              <Grid item xs={12} key={repo.id}>
                <RepoItem repo={repo} />
              </Grid>
            );
          }
        })}
      </Grid>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && repositories.length === 0 && !error && (
        <Typography variant="body1" sx={{ textAlign: 'center', py: 4 }}>
          No repositories found.
        </Typography>
      )}

      {!hasMore && repositories.length > 0 && !loading && (
        <Typography variant="body2" sx={{ textAlign: 'center', my: 3, color: 'text.secondary' }}>
          You've reached the end of the list.
        </Typography>
      )}
    </Paper>
  );
};

export default RepoList;