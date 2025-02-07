import { useState } from 'react';
import { Box, Container } from '@mui/material';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import ChatSidebar from './ChatSidebar';
import useChatMessages from '../../hooks/useChatMessages';

/**
 * Main chat interface component
 */
const ChatInterface = () => {
  const [input, setInput] = useState('');
  const {
    messages,
    model,
    temperature,
    setModel,
    setTemperature,
    sendMessage,
    regenerateMessage
  } = useChatMessages({
    initialModel: 'gpt-4o',
    initialTemperature: 0.7
  });

  const handleSubmit = async () => {
    if (!input.trim()) return;
    
    const message = input;
    setInput('');
    await sendMessage(message);
  };

  const handleChatSelect = (messageId) => {
    const element = document.getElementById(messageId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      height: '100vh',
      overflow: 'hidden',
      bgcolor: 'white'
    }}>
      <ChatSidebar
        messages={messages}
        model={model}
        temperature={temperature}
        setModel={setModel}
        setTemperature={setTemperature}
        onChatSelect={handleChatSelect}
      />
      <Box 
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        <Box sx={{
          flexGrow: 1,
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {messages.map((message) => (
            <Box 
              key={message.id}
              id={message.id}
            >
              <ChatMessage
                message={message}
                onRegenerate={() => regenerateMessage(message.id)}
              />
            </Box>
          ))}
        </Box>
        <Box sx={{ p: 2, borderTop: '1px solid rgba(0,0,0,0.1)' }}>
          <Container maxWidth="md">
            <ChatInput
              value={input}
              onChange={setInput}
              onSubmit={handleSubmit}
            />
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatInterface; 