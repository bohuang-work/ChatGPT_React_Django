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
export function useChatMessages({ 
  initialModel = 'gpt-4o', 
  initialTemperature = 0.7 
}) {
  // State Declarations
  const [messages, setMessages] = useState([]);
  const [model, setModel] = useState(initialModel);
  const [temperature, setTemperature] = useState(initialTemperature);

  // Message Creation
  const createMessage = useCallback((content = '', role = 'user', isLoading = false) => ({
    id: `${role}-${uuidv4()}`,
    content: content || '',
    role,
    isLoading
  }), []);

  // Message Sending
  const sendMessage = useCallback(async (prompt) => {
    if (!prompt?.trim()) return;

    // Step 1: Create user and assistant messages
    const userMessage = createMessage(prompt, 'user');
    const assistantMessage = createMessage('', 'assistant', true);
    
    // Step 2: Update messages state combine all previous messages
    setMessages(prev => [...prev, userMessage, assistantMessage]);

    try {
      // Step 3: Send message to backend API
      const useWeatherFunction = prompt.startsWith('#weather');
      let content = await ChatService.sendMessage(
        prompt, 
        model, 
        temperature,
        useWeatherFunction
      );

      if (typeof content === 'object') {
        content = JSON.stringify(content, null, 2);
      }

      // Step 4: Update target message with new content
      setMessages(prev => prev.map(msg => 
        msg.id === assistantMessage.id 
          ? { ...msg, content: String(content).trim(), isLoading: false }
          : msg
      ));
    } catch (error) {
      // Step 5: Remove target message if error
      setMessages(prev => prev.filter(msg => msg.id !== assistantMessage.id));
    }
  }, [model, temperature, createMessage]);

  // Message Regeneration
  const regenerateMessage = useCallback(async (messageId) => {d

    // Step 1: Find target assistant message to regenerate
    const targetMessage = messages.find(m => m.id === messageId)
    if (!targetMessage || targetMessage.role !== 'assistant') return

    // Step 2: Find associated user message
    const userMessage = messages
      .slice(0, messages.findIndex(m => m.id === messageId))
      .reverse()
      .find(m => m.role === 'user')
    
    if (!userMessage?.content) return

    // Step 3: Update target message to loading state
    setMessages(prev => prev.map(msg =>
      msg.id === messageId ? { ...msg, isLoading: true } : msg
    ))

    try {
      // Step 4: Send same message to backend API
      const useWeatherFunction = userMessage.content.startsWith('#weather')
      let content = await ChatService.sendMessage(
        userMessage.content,
        model,
        temperature,
        useWeatherFunction
      )

      if (typeof content === 'object') {
        content = JSON.stringify(content, null, 2)
      }

      // Step 5: Update target message with new content
      setMessages(prev => prev.map(msg =>
        msg.id === messageId 
          ? { 
              ...msg, 
              content: String(content).trim(),
              isLoading: false,
              error: false
            }
          : msg
      ))
    } catch (error) {
      setMessages(prev => prev.map(msg =>
        msg.id === messageId 
          ? { ...msg, isLoading: false, error: true }
          : msg
      ))
    }
  }, [messages, model, temperature])

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