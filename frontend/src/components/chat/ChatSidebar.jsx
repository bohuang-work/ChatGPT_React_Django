import PropTypes from 'prop-types';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from '@mui/material';
import { CHAT_CONFIG } from '../../constants/config';

/**
 * ChatSidebar Component
 * 
 * A sidebar component that displays:
 * - Model selection dropdown
 * - Temperature control
 * - Chat history list
 * 
 * Structure:
 * - Sidebar container (Box)
 *    - Settings section
 *      - Model selector
 *      - Temperature selector
 *    - Divider
 *    - History section
 *      - List of previous chat messages
 * 
 * @component
 * @param {Object} props
 * @param {Array} props.messages - Array of chat messages
 * @param {string} props.model - Current selected model
 * @param {function} props.setModel - Handler for model changes
 * @param {number} props.temperature - Current temperature setting
 * @param {function} props.setTemperature - Handler for temperature changes
 * @param {function} props.onChatSelect - Handler for chat history item selection
 */
const ChatSidebar = ({ 
  messages, 
  model, 
  setModel, 
  temperature, 
  setTemperature,
  onChatSelect,
}) => {
  /**
   * Processes messages array to create chat history
   * Filters for user messages and truncates content
   * @returns {Array} Array of processed chat history items
   */
  const chatHistory = messages
    .filter(msg => msg.role === 'user')
    .map(msg => ({
      id: msg.id,
      question: msg.content.substring(0, 60) + '...',
    }));

  return (
    <Box
      sx={{
        width: 260,
        height: '100vh',
        bgcolor: '#202123',
        color: 'white',
        borderRight: '1px solid #4d4d4f',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Settings Section */}
      <Box sx={{ p: 2, mb: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 2, color: '#8e8ea0', fontWeight: 500 }}>
          Settings
        </Typography>
        
        {/* Model Selection Dropdown */}
        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
          <InputLabel sx={{ color: 'white' }}>Model</InputLabel>
          <Select
            value={model}
            label="Model"
            onChange={e => setModel(e.target.value)}
            sx={{
              color: 'white',
              '.MuiOutlinedInput-notchedOutline': { borderColor: '#4d4d4f' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#6e6e80' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#8e8ea0' }
            }}
          >
            {CHAT_CONFIG.MODELS.map(m => (
              <MenuItem key={m} value={m}>{m}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Temperature Selection Dropdown */}
        <FormControl fullWidth size="small">
          <InputLabel sx={{ color: 'white' }}>Temperature</InputLabel>
          <Select
            value={temperature}
            label="Temperature"
            onChange={e => setTemperature(e.target.value)}
            sx={{
              color: 'white',
              '.MuiOutlinedInput-notchedOutline': { borderColor: '#4d4d4f' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#6e6e80' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#8e8ea0' }
            }}
          >
            {CHAT_CONFIG.TEMPERATURES.map(t => (
              <MenuItem key={t} value={t}>{t}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Divider sx={{ borderColor: '#4d4d4f' }} />

      {/* Chat History Section */}
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 1, color: '#8e8ea0', fontWeight: 500 }}>
          History
        </Typography>
      </Box>

      {/* Scrollable Chat History List */}
      <List sx={{ flex: 1, overflow: 'auto' }}>
        {chatHistory.map(chat => (
          <ListItem key={chat.id} disablePadding>
            <ListItemButton 
              onClick={() => onChatSelect(chat.id)}  // Click handler for chat history item
              sx={{
                py: 2,
                '&:hover': { bgcolor: '#2A2B32' }
              }}
            >
              <ListItemText 
                primary={chat.question} 
                sx={{ 
                  '& .MuiListItemText-primary': {
                    color: '#ececf1',
                    fontSize: '0.875rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

/**
 * PropTypes for type checking
 */
ChatSidebar.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,     // Unique message identifier
      role: PropTypes.string.isRequired,   // Message role (user/assistant)
      content: PropTypes.string.isRequired, // Message content
    })
  ).isRequired,
  model: PropTypes.string.isRequired,       // Selected AI model
  setModel: PropTypes.func.isRequired,      // Model change handler
  temperature: PropTypes.number.isRequired,  // Selected temperature
  setTemperature: PropTypes.func.isRequired, // Temperature change handler
  onChatSelect: PropTypes.func.isRequired,   // Chat history item click handler
};

export default ChatSidebar; 