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
  const chatHistory = messages?.filter(msg => msg.role === 'user') || [];

  return (
    <Box
      sx={{
        width: 250,
        p: 2,
        borderRight: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        bgcolor: '#202123',  // Dark background
        color: 'white'  // White text
      }}
    >
      {/* Settings Section */}
      <Box>
        <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>Settings</Typography>
        
        {/* Model Selection */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom sx={{ color: 'rgba(255,255,255,0.7)' }}>Model</Typography>
          <Select
            fullWidth
            size="small"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            sx={{
              color: 'white',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255,255,255,0.2)',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255,255,255,0.3)',
              },
              '& .MuiSvgIcon-root': {
                color: 'white',
              }
            }}
          >
            {CHAT_CONFIG.MODELS.map((m) => (
              <MenuItem key={m} value={m}>{m}</MenuItem>
            ))}
          </Select>
        </Box>

        {/* Temperature Selection */}
        <Box>
          <Typography variant="subtitle2" gutterBottom sx={{ color: 'rgba(255,255,255,0.7)' }}>Temperature</Typography>
          <Select
            fullWidth
            size="small"
            value={temperature}
            onChange={(e) => setTemperature(e.target.value)}
            sx={{
              color: 'white',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255,255,255,0.2)',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255,255,255,0.3)',
              },
              '& .MuiSvgIcon-root': {
                color: 'white',
              }
            }}
          >
            {CHAT_CONFIG.TEMPERATURES.map((t) => (
              <MenuItem key={t} value={t}>{t}</MenuItem>
            ))}
          </Select>
        </Box>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

      {/* Chat History Section */}
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>Chat History</Typography>
        {chatHistory.map((msg) => (
          <Box
            key={msg.id}
            onClick={() => onChatSelect(msg.id)}
            sx={{
              p: 1,
              cursor: 'pointer',
              color: 'rgba(255,255,255,0.8)',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.1)',
              },
            }}
          >
            <Typography noWrap>
              {msg.content}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

/**
 * PropTypes for type checking
 */
ChatSidebar.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
  })).isRequired,
  model: PropTypes.string.isRequired,
  temperature: PropTypes.number.isRequired,
  setModel: PropTypes.func.isRequired,
  setTemperature: PropTypes.func.isRequired,
  onChatSelect: PropTypes.func.isRequired,
};

export default ChatSidebar; 