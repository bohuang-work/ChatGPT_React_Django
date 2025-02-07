import { useState, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import ChatService from '../services/api'

/**
 * Custom hook for managing chat messages and interactions
 * 
 * Features:
 * - Message state management
 * - Model and temperature settings
 * - Message sending and regeneration
 * - Error handling
 * 
 * @param {Object} options Configuration options
 * @param {string} [options.initialModel='gpt-4o'] Initial model selection
 * @param {number} [options.initialTemperature=0.7] Initial temperature setting
 */
const useChatMessages = ({ 
  initialModel = 'gpt-4o', 
  initialTemperature = 0.7 
}) => {
  // State Declarations
  const [messages, setMessages] = useState([]);
  const [model, setModel] = useState(initialModel);
  const [temperature, setTemperature] = useState(initialTemperature);

  // System message for function calling
  const systemMessage = {
    role: 'system',
    content: 'If the user asks about weather, location, or time-related questions, ' +
             'always trigger the appropriate function call. For weather queries, ' +
             'extract the location and use the weather function.'
  };

  // Message Creation
  const createMessage = useCallback((content = '', role = 'user', isLoading = false) => ({
    id: `${role}-${uuidv4()}`,
    content: content || '',
    role,
    isLoading,
    error: false
  }), []);

  // Send message with history
  const sendMessage = useCallback(async (prompt) => {
    if (!prompt?.trim()) return;

    // Create user and assistant messages
    const userMessage = createMessage(prompt, 'user');
    const assistantMessage = createMessage('', 'assistant', true);
    
    // Update messages state
    setMessages(prev => [...prev, userMessage, assistantMessage]);

    try {
      // Format messages for API
      const messageHistory = [
        systemMessage,
        ...messages,
        userMessage
      ].map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Send message to backend API
      const content = await ChatService.sendMessage(
        messageHistory,
        model, 
        temperature
      );

      // Update assistant message with response
      setMessages(prev => prev.map(msg =>
        msg.id === assistantMessage.id
          ? { ...msg, content: content, isLoading: false }
          : msg
      ));
    } catch (error) {
      // Remove assistant message if error
      setMessages(prev => prev.filter(msg => msg.id !== assistantMessage.id));
    }
  }, [messages, model, temperature, createMessage]);

  // Regenerate message with filtered history
  const regenerateMessage = useCallback(async (messageId) => {
    // Find target assistant message
    const targetIndex = messages.findIndex(m => m.id === messageId);
    if (targetIndex === -1 || messages[targetIndex].role !== 'assistant') return;

    // Get messages up to the target message
    const messageHistory = messages.slice(0, targetIndex).map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    // Update target message to loading state
    setMessages(prev => prev.map(msg =>
      msg.id === messageId ? { ...msg, isLoading: true } : msg
    ));

    try {
      // Send filtered message history to backend
      const content = await ChatService.sendMessage(
        messageHistory,
        model,
        temperature
      );

      // Update target message with new response
      setMessages(prev => prev.map(msg =>
        msg.id === messageId 
          ? { ...msg, content, isLoading: false, error: false }
          : msg
      ));
    } catch (error) {
      setMessages(prev => prev.map(msg =>
        msg.id === messageId 
          ? { ...msg, isLoading: false, error: true }
          : msg
      ));
    }
  }, [messages, model, temperature]);

  return {
    messages,
    model,
    temperature,
    setModel,
    setTemperature,
    sendMessage,
    regenerateMessage
  }
}

export default useChatMessages;