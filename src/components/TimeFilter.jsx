import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { setTimeFrame } from '../store/repoSlice';

/**
 * Component for selecting time frame for repository search
 */
const TimeFilter = () => {
  const dispatch = useDispatch();
  const timeFrame = useSelector((state) => state.repos.timeFrame);

  const handleChange = (event, newTimeFrame) => {
    // Only change if a value is selected (prevent no selection)
    if (newTimeFrame !== null) {
      dispatch(setTimeFrame(newTimeFrame));
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="body1" sx={{ mb: 1 }}>
        Show repositories created in the last:
      </Typography>
      <ToggleButtonGroup
        value={timeFrame}
        exclusive
        onChange={handleChange}
        aria-label="time frame"
        color="primary"
      >
        <ToggleButton value="1w" aria-label="1 week">
          1 Week
        </ToggleButton>
        <ToggleButton value="2w" aria-label="2 weeks">
          2 Weeks
        </ToggleButton>
        <ToggleButton value="1m" aria-label="1 month">
          1 Month
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};

export default TimeFilter;