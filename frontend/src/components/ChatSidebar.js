import React from 'react';
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

/**
 * Sidebar component showing chat history and settings
 * @component
 */
const ChatSidebar = ({ 
  messages, 
  model, 
  setModel, 
  temperature, 
  setTemperature,
  onChatSelect,
  models,
  temperatures
}) => {
  // Group messages by conversation
  const chatHistory = messages.reduce((acc, msg, index) => {
    if (msg.role === 'user') {
      acc.push({
        id: index,
        question: msg.content.substring(0, 60) + '...',
        messageIndex: index
      });
    }
    return acc;
  }, []);

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
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 1, color: '#8e8ea0', fontWeight: 500 }}>
          Settings
        </Typography>
        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
          <InputLabel sx={{ color: 'white' }}>Model</InputLabel>
          <Select
            value={model}
            label="Model"
            onChange={(e) => setModel(e.target.value)}
            sx={{
              color: 'white',
              '.MuiOutlinedInput-notchedOutline': {
                borderColor: '#4d4d4f'
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#6e6e80'
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#8e8ea0'
              }
            }}
          >
            {models.map((m) => (
              <MenuItem key={m} value={m}>{m}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth size="small">
          <InputLabel sx={{ color: 'white' }}>Temperature</InputLabel>
          <Select
            value={temperature}
            label="Temperature"
            onChange={(e) => setTemperature(e.target.value)}
            sx={{
              color: 'white',
              '.MuiOutlinedInput-notchedOutline': {
                borderColor: '#4d4d4f'
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#6e6e80'
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#8e8ea0'
              }
            }}
          >
            {temperatures.map((t) => (
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

      {/* Chat History List */}
      <List sx={{ flex: 1, overflow: 'auto' }}>
        {chatHistory.map((chat) => (
          <ListItem key={chat.id} disablePadding>
            <ListItemButton 
              onClick={() => onChatSelect(chat.messageIndex)}
              sx={{
                py: 2,
                '&:hover': {
                  bgcolor: '#2A2B32'
                }
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

export default ChatSidebar; 