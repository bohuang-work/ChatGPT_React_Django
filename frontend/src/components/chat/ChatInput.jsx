import PropTypes from 'prop-types';
import { Box, TextField, Paper } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloudOutlinedIcon from '@mui/icons-material/CloudOutlined';
import IconButton from '../common/IconButton';

/**
 * Chat input component with weather function button
 */
const ChatInput = ({ input, onInputChange, onSubmit, onWeatherClick }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSubmit(input);
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 2,
        borderRadius: 2,
        bgcolor: 'white',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)'
      }}
    >
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            size="small"
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder="Type your message here..."
            variant="outlined"
            autoComplete="off"
          />
          <IconButton
            title={!input.trim() ? "Please enter a message" : "Send message"}
            onClick={handleSubmit}
            disabled={!input.trim()}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </form>
      
      <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-start' }}>
        <IconButton
          title="Ask about weather"
          onClick={onWeatherClick}
          sx={{ 
            border: '1px solid #e5e5e5',
            borderRadius: 1,
            p: 0.5,
            '&:hover': {
              bgcolor: '#f7f7f8'
            }
          }}
        >
          <CloudOutlinedIcon fontSize="small" />
        </IconButton>
      </Box>
    </Paper>
  );
};

ChatInput.propTypes = {
  input: PropTypes.string.isRequired,
  onInputChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onWeatherClick: PropTypes.func.isRequired
};

export default ChatInput; 