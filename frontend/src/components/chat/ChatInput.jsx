import PropTypes from 'prop-types';
import { Box, TextField, Paper } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloudOutlinedIcon from '@mui/icons-material/CloudOutlined';
import IconButton from '../common/IconButton';

/**
 * ChatInput Component
 * 
 * A component that renders a chat input interface with:
 * - Text input field for messages
 * - Send button (disabled when input is empty)
 * - Weather query button
 * 
 * Structure:
 * - Paper container (main wrapper)
 *    - Form element
 *      - Text input
 *      - Send button
 *    - Weather button (below the form)
 * 
 * @component
 * @param {Object} props
 * @param {string} props.input - Current input value
 * @param {function} props.onInputChange - Handler for input changes
 * @param {function} props.onSubmit - Handler for form submission
 * @param {function} props.onWeatherClick - Handler for weather button click
 */
const ChatInput = ({ input, onInputChange, onSubmit, onWeatherClick }) => {
  /**
   * Handles form submission
   * Prevents default form behavior and validates input before submission
   * 
   * @param {Event} e - Form submission event
   */
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
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      }}
    >
      {/* Message Input Form */}
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {/* Text Input Field */}
          <TextField
            fullWidth
            size="small"
            value={input}
            onChange={e => onInputChange(e.target.value)}
            placeholder="Type your message here..."
            variant="outlined"
            autoComplete="off"
          />
          {/* Send Button */}
          <IconButton
            title={!input.trim() ? 'Please enter a message' : 'Send message'}
            onClick={handleSubmit}
            disabled={!input.trim()}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </form>

      {/* Weather Query Button */}
      <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-start' }}>
        <IconButton
          title="Ask about weather"
          onClick={onWeatherClick}
          sx={{
            border: '1px solid #e5e5e5',
            borderRadius: 1,
            p: 0.5,
            '&:hover': {
              bgcolor: '#f7f7f8',
            },
          }}
        >
          <CloudOutlinedIcon fontSize="small" />
        </IconButton>
      </Box>
    </Paper>
  );
};

/**
 * PropTypes for type checking
 */
ChatInput.propTypes = {
  input: PropTypes.string.isRequired,      // Current input text
  onInputChange: PropTypes.func.isRequired, // Input change handler
  onSubmit: PropTypes.func.isRequired,      // Form submission handler
  onWeatherClick: PropTypes.func.isRequired, // Weather button click handler
};

export default ChatInput; 