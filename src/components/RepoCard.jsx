import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  Divider,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import CommitChart from './CommitChart';
import ContributorChart from './ContributorChart';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedMetric } from '../redux/detailsSlice';

const RepoCard = ({ repo, isExpanded, onToggle, loadingDetails }) => {
  const dispatch = useDispatch();
  const { selectedMetric } = useSelector((state) => state.details);

  const handleMetricChange = (e) => {
    // Prevent the card from collapsing when changing the dropdown
    dispatch(setSelectedMetric(e.target.value));
  };

  return (
    <Card onClick={onToggle} sx={{ cursor: 'pointer' }} elevation={1}>
      <CardContent>
        {/* Header: avatar, name, description, stats */}
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar src={repo.owner.avatar_url} alt={repo.owner.login} />
          <Box flexGrow={1}>
            <Typography variant="h6">{repo.name}</Typography>
            <Typography color="text.secondary" sx={{ mb: 1 }}>
              {repo.description || 'No description available'}
            </Typography>
            <Typography variant="body2">
              ⭐ {repo.stargazers_count.toLocaleString()} &nbsp;|&nbsp; 🐞 {repo.open_issues_count.toLocaleString()}
            </Typography>
          </Box>
        </Box>

        {/* Expanded content: only show when expanded */}
        {isExpanded && (
          <Box mt={2}>
            <Divider sx={{ mb: 2 }} />

            {/* Loading state */}
            {loadingDetails ? (
              <Box textAlign="center">
                <CircularProgress size={24} />
              </Box>
            ) : (
              <>
                {/* Dropdown: stop click propagation to keep card open */}
                <Box sx={{ mb: 2, maxWidth: 240 }} onClick={(e) => e.stopPropagation()}>
                  <FormControl fullWidth>
                    <InputLabel id="metric-select-label">Show</InputLabel>
                    <Select
                      labelId="metric-select-label"
                      id="metric-select"
                      value={selectedMetric}
                      label="Show"
                      onChange={handleMetricChange}
                    >
                      <MenuItem value="changes">Changes (Adds + Dels)</MenuItem>
                      <MenuItem value="additions">Additions</MenuItem>
                      <MenuItem value="deletions">Deletions</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                {/* Commit Activity Chart */}
                <Typography variant="subtitle1" gutterBottom>
                  Overall Commit Activity
                </Typography>
                {/* Stop propagation so charts don't collapse the card on click */}
                <Box onClick={(e) => e.stopPropagation()}>
                  <CommitChart />
                </Box>

                {/* Contributor Activity Chart */}
                <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
                  Contributor Activity
                </Typography>
                <Box onClick={(e) => e.stopPropagation()}>
                  <ContributorChart />
                </Box>
              </>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default RepoCard;
