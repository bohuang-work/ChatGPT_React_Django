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
import CodeIcon from '@mui/icons-material/Code';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';
import PersonIcon from '@mui/icons-material/Person';
import ReplayIcon from '@mui/icons-material/Replay';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ChatSidebar from './ChatSidebar';

/**
 * ChatInterface component of clone ChatGPT
 * @component
 */
const ChatInterface = () => {
  // State for user input and chat history
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  
  // State for model and temperature selection
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

    // Add user message to chat
    const userMessage = { role: 'user', content: input };
    setMessages([...messages, userMessage]);
    setInput('');

    try {
      // Call backend API
      const response = await axios.post('http://localhost:8000/v1/chat/', {
        prompt: input,
        model: model,
        temperature: temperature
      });

      // Add assistant response to chat
      const assistantMessage = { 
        role: 'assistant', 
        content: response.data.response 
      };
      setMessages(messages => [...messages, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      // Add error message to chat
      const errorMessage = {
        role: 'assistant',
        content: `Error: ${error.response?.data?.error || 'Failed to get response'}`
      };
      setMessages(messages => [...messages, errorMessage]);
    }
  };

  /**
   * Message component that displays a single message with copy buttons
   */
  const Message = ({ message }) => {
    /**
     * Copies text to clipboard
     * @param {string} text - Text to copy
     * @param {string} type - Type of content being copied (for tooltip)
     */
    const handleCopy = async (text, type = 'content') => {
      try {
        await navigator.clipboard.writeText(text);
        // You could add a snackbar/toast notification here
        console.log(`${type} copied to clipboard`);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    };

    /**
     * Extracts code blocks from markdown content
     * @param {string} content - Markdown content
     * @returns {string} - Concatenated code blocks
     */
    const extractCodeBlocks = (content) => {
      const codeBlockRegex = /```[\s\S]*?```/g;
      const matches = content.match(codeBlockRegex) || [];
      return matches
        .map(block => block.replace(/```\w*\n?|\n?```/g, ''))
        .join('\n\n');
    };

    /**
     * Regenerates the response for this message
     */
    const handleRegenerate = async () => {
      try {
        const response = await axios.post('http://localhost:8000/v1/chat/', {
          prompt: messages[messages.indexOf(message) - 1].content, // Get the user's prompt
          model: model,
          temperature: temperature
        });

        // Replace this assistant message with new response
        const newMessages = [...messages];
        newMessages[messages.indexOf(message)] = {
          role: 'assistant',
          content: response.data.response
        };
        setMessages(newMessages);
      } catch (error) {
        console.error('Error:', error);
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
            bgcolor: message.role === 'user' ? '#f7f7f8' : 'white',
            borderBottom: '1px solid rgba(0,0,0,0.1)',
          }}
        >
          <Container maxWidth="md">
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              {/* User/Assistant Icon */}
              <Box 
                sx={{ 
                  width: 30,  // Fixed width
                  height: 30, // Fixed height
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: message.role === 'user' ? '#5c5c5c' : '#19c37d',
                  color: 'white',
                  flexShrink: 0  // Prevent icon from shrinking
                }}
              >
                {message.role === 'user' ? (
                  <PersonIcon sx={{ fontSize: 20 }} />
                ) : (
                  <SmartToyOutlinedIcon sx={{ fontSize: 20 }} />
                )}
              </Box>

              {/* Message Content */}
              <Box sx={{ flex: 1 }}>
                <ReactMarkdown
                  components={{
                    code: ({ node, inline, className, children, ...props }) => {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <Box 
                          component="div" 
                          sx={{ 
                            bgcolor: 'white',
                            border: '1px solid #e5e5e5',
                            borderRadius: 2,
                            overflow: 'auto',
                            my: 2
                          }}
                        >
                          <SyntaxHighlighter
                            language={match[1]}
                            style={oneLight}
                            customStyle={{
                              margin: 0,
                              padding: '16px',
                              backgroundColor: 'white',
                            }}
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        </Box>
                      ) : (
                        <code 
                          className={className} 
                          {...props}
                          style={{ 
                            backgroundColor: '#f7f7f8',
                            padding: '0.2em 0.4em',
                            borderRadius: '3px',
                            fontSize: '0.875em',
                            color: '#333'
                          }}
                        >
                          {children}
                        </code>
                      );
                    }
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </Box>

              {/* Copy and regenerate buttons - only show for assistant messages */}
              {message.role === 'assistant' && (
                <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
                  <Tooltip title="Copy full message">
                    <IconButton 
                      size="small"
                      onClick={() => handleCopy(message.content, 'Full message')}
                      sx={{ color: '#6e6e80' }}
                    >
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Copy code blocks">
                    <IconButton 
                      size="small"
                      onClick={() => handleCopy(extractCodeBlocks(message.content), 'Code')}
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
        onChatSelect={(index) => {
          // Scroll to the selected message
          const element = document.getElementById(`message-${index}`);
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
          {messages.map((message, index) => (
            <Box id={`message-${index}`} key={index}>
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
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default ChatInterface; 