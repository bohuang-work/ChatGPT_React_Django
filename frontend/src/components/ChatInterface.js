import React, { useState } from 'react';
import {
  Box,
  Container,
  TextField,
  Paper,
  IconButton,
  Tooltip,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PublicIcon from '@mui/icons-material/Public';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';
import ChatSidebar from './ChatSidebar';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import ReplayIcon from '@mui/icons-material/Replay';
import CodeIcon from '@mui/icons-material/Code';

/**
 * ChatInterface component of clone ChatGPT
 * @component
 */
const ChatInterface = () => {
  // Each message now has a unique ID and loading state
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [model, setModel] = useState('gpt-4o');
  const [temperature, setTemperature] = useState(0.7);

  // Available options for model and temperature
  const models = ['gpt-4o', 'gpt-4o-mini'];
  const temperatures = [0.2, 0.7, 0.9];

  /**
   * Handles sending messages to the backend API
   * @param {Event} e - Form submission event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { 
      id: `user-${Date.now()}`,
      role: 'user', 
      content: input 
    };

    const assistantMessage = { 
      id: `assistant-${Date.now()}`,
      role: 'assistant', 
      content: '',
      isLoading: true
    };

    setMessages([...messages, userMessage, assistantMessage]);
    setInput('');

    try {
      const endpoint = input.startsWith("#weather") 
        ? 'http://localhost:8000/v1/chat_with_functions/'
        : 'http://localhost:8000/v1/chat/';

      const response = await axios.post(endpoint, {
        prompt: input,
        model,
        temperature
      });

      // Format weather response if needed
      let formattedResponse = response.data.response;
      if (input.startsWith("#weather") && formattedResponse.includes("|")) {
        formattedResponse = formatWeatherTable(formattedResponse);
      }

      setMessages(prev => prev.map(msg => 
        msg.id === assistantMessage.id 
          ? { ...msg, content: formattedResponse, isLoading: false }
          : msg
      ));
    } catch (error) {
      setMessages(prev => prev.map(msg => 
        msg.id === assistantMessage.id 
          ? { 
              ...msg, 
              content: `Error: ${error.response?.data?.error || 'Failed to get response'}`,
              isLoading: false 
            }
          : msg
      ));
    }
  };

  const formatWeatherTable = (response) => {
    // Extract table data
    const lines = response.split('\n');
    const tableStart = lines.findIndex(line => line.includes('| Date'));
    const tableEnd = lines.findIndex((line, i) => i > tableStart && !line.includes('|'));
    
    if (tableStart === -1) return response;

    const tableLines = lines.slice(tableStart, tableEnd);
    const formattedTable = tableLines.map(line => 
      line.replace(/\|/g, '  ')  // Replace pipes with spaces
          .trim()
    ).join('\n');

    // Reconstruct response with formatted table
    return [
      ...lines.slice(0, tableStart),
      '```',
      formattedTable,
      '```',
      ...lines.slice(tableEnd)
    ].join('\n');
  };

  const extractCodeBlocks = (content) => {
    const codeBlockRegex = /```[\s\S]*?```/g;
    const matches = content.match(codeBlockRegex) || [];
    return matches
      .map(block => block.replace(/```\w*\n?|\n?```/g, ''))
      .join('\n\n');
  };

  /**
   * Message component that displays a single message with copy buttons
   */
  const Message = ({ message }) => {
    /**
     * Copies text to clipboard
     * @param {string} text - Text to copy
     */
    const handleCopy = async (text) => {
      try {
        await navigator.clipboard.writeText(text);
        console.log('Content copied');
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    };

    /**
     * Regenerates the response for this message
     */
    const handleRegenerate = async () => {
      // Find the corresponding user message
      const messageIndex = messages.findIndex(msg => msg.id === message.id);
      const userMessage = messages[messageIndex - 1];

      // Set current message to loading state
      setMessages(prev => prev.map(msg =>
        msg.id === message.id ? { ...msg, isLoading: true } : msg
      ));

      try {
        const endpoint = userMessage.content.startsWith("#weather")
          ? 'http://localhost:8000/v1/chat_with_functions/'
          : 'http://localhost:8000/v1/chat/';

        const response = await axios.post(endpoint, {
          prompt: userMessage.content,
          model,
          temperature
        });

        let formattedResponse = response.data.response;
        if (userMessage.content.startsWith("#weather") && formattedResponse.includes("|")) {
          formattedResponse = formatWeatherTable(formattedResponse);
        }

        setMessages(prev => prev.map(msg =>
          msg.id === message.id 
            ? { ...msg, content: formattedResponse, isLoading: false }
            : msg
        ));
      } catch (error) {
        setMessages(prev => prev.map(msg =>
          msg.id === message.id 
            ? { 
                ...msg, 
                content: `Error: ${error.response?.data?.error || 'Failed to get response'}`,
                isLoading: false 
              }
            : msg
        ));
      }
    };

    return (
      <Box
        sx={{
          mb: 0.5,
          p: 0,
          position: 'relative',
        }}
      >
        <Box 
          sx={{ 
            p: 3,
            bgcolor: 'white',
            borderBottom: '1px solid rgba(0,0,0,0.1)',
          }}
        >
          <Container maxWidth="md">
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'flex-start', 
              gap: 2,
              flexDirection: message.role === 'user' ? 'row-reverse' : 'row' // Align user messages to right
            }}>
              {/* User/Assistant Icon */}
              <Box 
                sx={{ 
                  width: 30,
                  height: 30,
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: message.role === 'user' ? '#5c5c5c' : '#19c37d',
                  color: 'white',
                  flexShrink: 0
                }}
              >
                {message.role === 'user' ? (
                  <PersonOutlineIcon sx={{ fontSize: 20 }} />
                ) : (
                  <SmartToyOutlinedIcon sx={{ fontSize: 20 }} />
                )}
              </Box>

              {/* Message Content */}
              <Box 
                sx={{ 
                  flex: 1,
                  bgcolor: message.role === 'user' ? '#f7f7f8' : 'white',
                  p: message.role === 'user' ? 2 : 0,
                  borderRadius: message.role === 'user' ? 2 : 0,
                }}
              >
                {message.isLoading ? (
                  <Box sx={{ p: 2 }}>
                    <Box component="span" sx={{
                      color: '#666',
                      fontSize: '24px',
                      lineHeight: 1,
                      animation: 'blink 1s infinite',
                      '@keyframes blink': {
                        '0%, 100%': { opacity: 0.2 },
                        '50%': { opacity: 0.8 }
                      }
                    }}>
                      ...
                    </Box>
                  </Box>
                ) : (
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                )}
              </Box>

              {/* Copy and regenerate buttons - only show for assistant messages */}
              {message.role === 'assistant' && (
                <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
                  <Tooltip title="Copy message">
                    <IconButton 
                      size="small"
                      onClick={() => handleCopy(message.content)}
                      sx={{ color: '#6e6e80' }}
                    >
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Copy code blocks">
                    <IconButton 
                      size="small"
                      onClick={() => handleCopy(extractCodeBlocks(message.content))}
                      sx={{ color: '#6e6e80' }}
                    >
                      <CodeIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Regenerate response">
                    <IconButton 
                      size="small"
                      onClick={handleRegenerate}
                      sx={{ color: '#6e6e80' }}
                      disabled={message.isLoading}
                    >
                      <ReplayIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
            </Box>
          </Container>
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={{ 
      display: 'flex',
      height: '100vh',
      bgcolor: 'white'
    }}>
      {/* Sidebar */}
      <ChatSidebar
        messages={messages}
        model={model}
        setModel={setModel}
        temperature={temperature}
        setTemperature={setTemperature}
        models={models}
        temperatures={temperatures}
        onChatSelect={(messageId) => {
          const element = document.getElementById(messageId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      />

      {/* Main Chat Area */}
      <Box sx={{ 
        flex: 1,
        display: 'flex', 
        flexDirection: 'column',
        bgcolor: 'white'
      }}>
        {/* Chat messages area */}
        <Box 
          sx={{ 
            flex: 1, 
            overflow: 'auto',
            bgcolor: 'white'
          }}
        >
          {messages.map((message) => (
            <Box id={message.id} key={message.id}>
              <Message message={message} />
            </Box>
          ))}
        </Box>

        {/* Input area */}
        <Container maxWidth="md" sx={{ p: 2 }}>
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
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message here..."
                  variant="outlined"
                />
                <IconButton 
                  type="submit" 
                  color="primary"
                  disabled={!input.trim()}
                >
                  <SendIcon />
                </IconButton>
              </Box>
            </form>
            
            {/* Add Weather Button */}
            <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-start' }}>
              <Tooltip title="Ask about weather">
                <IconButton
                  size="small"
                  onClick={() => setInput("#weather ")}
                  sx={{ 
                    color: '#6e6e80',
                    border: '1px solid #e5e5e5',
                    borderRadius: 1,
                    p: 0.5,
                    '&:hover': {
                      bgcolor: '#f7f7f8'
                    }
                  }}
                >
                  <PublicIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default ChatInterface; 