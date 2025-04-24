// src/components/RepoList.jsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRepos, setTimeFrame } from '../redux/repoSlice';
import { fetchDetailsStart, resetDetails } from '../redux/detailsSlice';
import RepoCard from './RepoCard';

const RepoList = () => {
  const dispatch = useDispatch();
  const { repositories, loading, error, hasMore, timeFrame, page } = useSelector((s) => s.repos);
  const { loading: detailsLoading } = useSelector((s) => s.details);
  const [expanded, setExpanded] = useState(null);

  // Load on mount & when timeframe changes
  useEffect(() => {
    dispatch(fetchRepos({ reset: true }));
    dispatch(resetDetails());
    setExpanded(null);
  }, [dispatch, timeFrame]);

  // Infinite scroll
  useEffect(() => {
    if (!loading && hasMore) {
      const onScroll = () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300) {
          dispatch(fetchRepos({ page }));
        }
      };
      window.addEventListener('scroll', onScroll);
      return () => window.removeEventListener('scroll', onScroll);
    }
  }, [loading, hasMore, page, dispatch]);

  const handleTimeChange = (e) => {
    dispatch(setTimeFrame(e.target.value));
  };

  const toggleExpand = (fullName, owner, name) => {
    if (expanded === fullName) {
      setExpanded(null);
      dispatch(resetDetails());
    } else {
      setExpanded(fullName);
      dispatch(fetchDetailsStart({ owner, repo: name }));
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h4" gutterBottom sx={{ color: 'text.primary' }}>
        Most Starred Repos
      </Typography>

      <FormControl sx={{ mb: 3, minWidth: 160 }}>
        <InputLabel id="timeframe-select-label">Time Period</InputLabel>
        <Select
          labelId="timeframe-select-label"
          label="Time Period"
          value={timeFrame}
          onChange={handleTimeChange}
        >
          <MenuItem value="1w">Last Week</MenuItem>
          <MenuItem value="2w">Last 2 Weeks</MenuItem>
          <MenuItem value="1m">Last Month</MenuItem>
        </Select>
      </FormControl>

      {error && <Alert severity="error">{error}</Alert>}

      <Grid container direction="column" spacing={2}>
        {repositories.map((repo) => (
          <Grid item key={repo.id}>
            <RepoCard
              repo={repo}
              isExpanded={expanded === repo.full_name}
              onToggle={() => toggleExpand(repo.full_name, repo.owner.login, repo.name)}
              loadingDetails={detailsLoading}
            />
          </Grid>
        ))}
      </Grid>

      {loading && (
        <Box sx={{ textAlign: 'center', my: 3 }}>
          <CircularProgress />
        </Box>
      )}
      {!hasMore && !loading && (
        <Typography align="center" color="text.secondary" sx={{ mt: 3 }}>
          You’ve reached the end.
        </Typography>
      )}
    </Paper>
  );
};

export default RepoList;
