import { useState } from 'react';
import { Box, Container } from '@mui/material';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import ChatSidebar from './ChatSidebar';
import { useChatMessages } from '../../hooks/useChatMessages';
import { CHAT_CONFIG } from '../../constants/config';

/**
 * ChatInterface Component
 * 
 * Main chat interface that manages the chat layout and state.
 * Provides a three-panel layout with sidebar, messages, and input area.
 * 
 * Features:
 * - Sidebar with model settings and chat history
 * - Messages display area with scroll functionality
 * - Input area with message submission and weather command
 * - Message regeneration capability
 * 
 * Layout Structure:
 * +----------------+------------------+
 * |                |                  |
 * |    Sidebar     |   Messages Area  |
 * |   (Settings)   |                  |
 * |   (History)    |                  |
 * |                |                  |
 * |                |                  |
 * |                |------------------|
 * |                |    Input Area    |
 * +----------------+------------------+
 */
const ChatInterface = () => {
  // Input state for the chat input field
  const [input, setInput] = useState('');

  // Chat state management from custom hook
  const {
    messages,      // Array of chat messages
    model,         // Current AI model
    temperature,   // Current temperature setting
    setModel,      // Function to update model
    setTemperature,// Function to update temperature
    sendMessage,   // Function to send new message
    regenerateMessage // Function to regenerate message
  } = useChatMessages({
    initialModel: CHAT_CONFIG.MODELS[0],
    initialTemperature: CHAT_CONFIG.TEMPERATURES[1]
  });

  /**
   * Handles message submission
   * @param {string} text - Message text to send
   */
  const handleSubmit = async (text) => {
    setInput('');
    await sendMessage(text);
  };

  /**
   * Handles chat selection from sidebar
   * Scrolls to the selected message
   * @param {string} messageId - ID of message to scroll to
   */
  const handleChatSelect = (messageId) => {
    const element = document.getElementById(messageId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Left Sidebar */}
      <ChatSidebar
        messages={messages}
        model={model}
        setModel={setModel}
        temperature={temperature}
        setTemperature={setTemperature}
        onChatSelect={handleChatSelect}
      />

      {/* Main Chat Area */}
      <Box sx={{ 
        flex: 1,
        display: 'flex', 
        flexDirection: 'column'
      }}>
        {/* Messages Display */}
        <Box sx={{ flex: 1, overflow: 'auto' }}>
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