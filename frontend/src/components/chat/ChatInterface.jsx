import { useState } from 'react';
import { Box, Container } from '@mui/material';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import ChatSidebar from './ChatSidebar';
import { useChatMessages } from '../../hooks/useChatMessages';
import { CHAT_CONFIG } from '../../constants/config';

/**
 * Main chat interface component that manages the chat state and layout
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
    initialModel: CHAT_CONFIG.MODELS[0],
    initialTemperature: CHAT_CONFIG.TEMPERATURES[1]
  });

  const handleSubmit = async (text) => {
    setInput('');
    await sendMessage(text);
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
      bgcolor: 'white'
    }}>
      <ChatSidebar
        messages={messages}
        model={model}
        setModel={setModel}
        temperature={temperature}
        setTemperature={setTemperature}
        onChatSelect={handleChatSelect}
      />

      <Box sx={{ 
        flex: 1,
        display: 'flex', 
        flexDirection: 'column',
        bgcolor: 'white'
      }}>
        {/* Messages Area */}
        <Box sx={{ flex: 1, overflow: 'auto', bgcolor: 'white' }}>
          {messages.map((message) => (
            <Box id={message.id} key={message.id}>
              <ChatMessage
                message={message}
                onRegenerate={() => regenerateMessage(message.id)}
              />
            </Box>
          ))}
        </Box>

        {/* Input Area */}
        <Container maxWidth="md" sx={{ p: 2 }}>
          <ChatInput
            input={input}
            onInputChange={setInput}
            onSubmit={handleSubmit}
            onWeatherClick={() => setInput("#weather ")}
          />
        </Container>
      </Box>
    </Box>
  );
};

export default ChatInterface; 