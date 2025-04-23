import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  Chip,
  Stack,
  Divider,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

/**
 * Component for displaying an individual repository card
 * @param {Object} props - Component props
 * @param {Object} props.repo - Repository data
 */
const RepoItem = ({ repo }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/repo/${repo.owner.login}/${repo.name}`);
  };

  return (
    <Card 
      sx={{ 
        mb: 2, 
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 3,
        }
      }}
      onClick={handleClick}
      elevation={1}
    >
      <CardContent>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
          <Avatar 
            src={repo.owner.avatar_url} 
            alt={repo.owner.login}
            sx={{ width: 56, height: 56 }}
          />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" component="div" sx={{ wordBreak: 'break-word' }}>
              {repo.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              by {repo.owner.login}
            </Typography>
          </Box>
        </Stack>

        <Divider sx={{ mb: 2 }} />
        
        <Typography variant="body1" sx={{ mb: 2, minHeight: '60px' }}>
          {repo.description || 'No description available'}
        </Typography>

        <Stack direction="row" spacing={2} sx={{ justifyContent: 'flex-start' }}>
          <Chip 
            icon={<StarIcon />} 
            label={repo.stargazers_count.toLocaleString()} 
            color="primary" 
            size="small"
          />
          <Chip 
            icon={<ErrorOutlineIcon />} 
            label={`${repo.open_issues_count.toLocaleString()} issues`} 
            size="small"
            color="secondary"
          />
        </Stack>
      </CardContent>
    </Card>
  );
};

export default RepoItem;