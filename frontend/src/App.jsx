import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import ChatInterface from './components/chat/ChatInterface';

/**
 * Root application component
 */
const App = () => {
  // Create a MUI theme object with custom colors and settings
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

  // Return the JSX that will be rendered
  return (
    <ThemeProvider theme={theme}>      {/* Provides theme context to all child components */}
      <CssBaseline />                  {/* Normalizes CSS across browsers */}
      <ChatInterface />                {/* chatGPT clone component */}
    </ThemeProvider>
  );
};

export default App;