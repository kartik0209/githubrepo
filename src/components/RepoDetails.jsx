import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Breadcrumbs,
  Link,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { fetchDetailsStart, setSelectedMetric, resetDetails } from '../store/detailsSlice';
import CommitChart from './CommitChart';
import ContributorChart from './ContributorChart';

/**
 * Component for displaying detailed repository information and charts
 */
const RepoDetails = () => {
  const { owner, repo } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, selectedMetric } = useSelector((state) => state.details);

  // Fetch repository details on component mount
  useEffect(() => {
    dispatch(fetchDetailsStart({ owner, repo }));
    
    // Reset details state when component unmounts
    return () => {
      dispatch(resetDetails());
    };
  }, [dispatch, owner, repo]);

  // Handle metric selection change
  const handleMetricChange = (event) => {
    dispatch(setSelectedMetric(event.target.value));
  };

  // Navigate back to repositories list
  const handleBack = () => {
    navigate('/');
  };

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
      {/* Header with breadcrumbs */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={handleBack} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Box>
          <Breadcrumbs aria-label="breadcrumb">
            <Link 
              underline="hover" 
              color="inherit" 
              onClick={handleBack} 
              sx={{ cursor: 'pointer' }}
            >
              Repositories
            </Link>
            <Typography color="text.primary">
              {owner}/{repo}
            </Typography>
          </Breadcrumbs>
          <Typography variant="h4" component="h1" sx={{ mt: 1 }}>
            {repo}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            by {owner}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Show error if present */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Show loading indicator if loading */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Metric selection dropdown */}
          <Box sx={{ mb: 3 }}>
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel id="metric-select-label">Show</InputLabel>
              <Select
                labelId="metric-select-label"
                id="metric-select"
                value={selectedMetric}
                label="Show"
                onChange={handleMetricChange}
              >
                <MenuItem value="changes">Changes (Additions + Deletions)</MenuItem>
                <MenuItem value="additions">Additions</MenuItem>
                <MenuItem value="deletions">Deletions</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Charts */}
          <Box sx={{ mb: 1 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Overall Activity
            </Typography>
            <CommitChart />
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Contributor Activity
            </Typography>
            <ContributorChart />
          </Box>
        </>
      )}
    </Paper>
  );
};

export default RepoDetails;