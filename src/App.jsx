import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, Container, AppBar, Toolbar, Typography, Box } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import RepoList from './components/RepoList';
import RepoDetails from './components/RepoDetails';

const App = () => {
  return (
    <Router>
      <CssBaseline />
      <AppBar position="sticky">
        <Toolbar>
          <GitHubIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            GitHub Repository Explorer
          </Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pt: 3, pb: 6 }}>
        <Container>
          <Routes>
            <Route path="/" element={<RepoList />} />
            <Route path="/repo/:owner/:repo" element={<RepoDetails />} /> 
          </Routes>
        </Container>
      </Box>
    </Router>
  );
};

export default App;