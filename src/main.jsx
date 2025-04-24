import React from 'react';
import { createRoot } from 'react-dom/client';       
import { Provider } from 'react-redux';
import { ThemeProvider, CssBaseline } from '@mui/material';
import store from './store';
import theme from './Theme';
import App from './App';


const container = document.getElementById('root');


const root = createRoot(container);

root.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </Provider>
);
