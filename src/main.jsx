// src/main.jsx
import React from 'react';
import { createRoot } from 'react-dom/client';        // note the '/client'
import { Provider } from 'react-redux';
import { ThemeProvider, CssBaseline } from '@mui/material';
import store from './store';
import theme from './Theme';
import App from './App';

// 1. Grab your root DOM node
const container = document.getElementById('root');

// 2. Create a root
const root = createRoot(container);

// 3. Render your app
root.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </Provider>
);
