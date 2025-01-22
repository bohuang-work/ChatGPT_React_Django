import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import ChatInterface from './components/ChatInterface';

/**
 * Main App component that provides theming and layout
 * @component
 */
const App = () => {
  // Create a theme instance
  const theme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#1976d2',
      },
      background: {
        default: '#f0f2f5',
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ChatInterface />
    </ThemeProvider>
  );
};

export default App;
