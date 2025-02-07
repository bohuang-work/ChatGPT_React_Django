import PropTypes from 'prop-types';
import { Box, TextField, Paper } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import IconButton from '../common/IconButton';

/**
 * Chat input component with submit button
 */
const ChatInput = ({ value, onChange, onSubmit }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) {
      onSubmit();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim()) {
        onSubmit();
      }
    }
  };

  return (
    <Paper 
      component="form" 
      onSubmit={handleSubmit}
      sx={{ 
        p: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        bgcolor: 'white',
      }}
    >
      <TextField
        fullWidth
        multiline
        maxRows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        variant="outlined"
        size="small"
        sx={{ flexGrow: 1 }}
      />
      <Box sx={{ display: 'flex', gap: 1 }}>
        <IconButton
          type="submit"
          title="Send message"
          disabled={!value.trim()}
          onClick={handleSubmit}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Paper>
  );
};

ChatInput.propTypes = {
  value: PropTypes.string.isRequired,       // Input field value
  onChange: PropTypes.func.isRequired,      // Input change handler
  onSubmit: PropTypes.func.isRequired,      // Form submission handler
};

export default ChatInput; 