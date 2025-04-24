// src/App.jsx
import React from 'react';
import { AppBar, Toolbar, Typography, Box, Container } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import RepoList from './components/RepoList';

const App = () => (
  <>
    <AppBar position="sticky">
      <Toolbar>
        <GitHubIcon sx={{ color: '#ffffff', mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#ffffff' }}>
          GitHub Repo Explorer
        </Typography>
      </Toolbar>
    </AppBar>
    <Box sx={{ bgcolor: 'background.default', pt: 3, pb: 6, minHeight: '100vh' }}>
      <Container maxWidth="lg">
        <RepoList />
      </Container>
    </Box>
  </>
);

export default App;
