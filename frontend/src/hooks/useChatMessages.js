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
  // State management
  const [messages, setMessages] = useState([])
  const [model, setModel] = useState(initialModel)
  const [temperature, setTemperature] = useState(initialTemperature)

  /**
   * Creates a new message object with unique ID
   */
  const createMessage = useCallback((content = '', role = 'user', isLoading = false) => ({
    id: `${role}-${uuidv4()}`,
    content: content || '',
    role,
    isLoading
  }), [])

  /**
   * Sends a new message and gets AI response
   */
  const sendMessage = useCallback(async (prompt) => {
    if (!prompt?.trim()) return

    const userMessage = createMessage(prompt, 'user')
    const assistantMessage = createMessage('', 'assistant', true)
    
    setMessages(prev => [...prev, userMessage, assistantMessage])

    try {
      const useWeatherFunction = prompt.startsWith('#weather')
      let content = await ChatService.sendMessage(
        prompt, 
        model, 
        temperature,
        useWeatherFunction
      )

      // Ensure content is a string and handle objects
      if (typeof content === 'object') {
        content = JSON.stringify(content, null, 2)
      }

      setMessages(prev => prev.map(msg => 
        msg.id === assistantMessage.id 
          ? { 
              ...msg, 
              content: String(content).trim(),
              isLoading: false 
            }
          : msg
      ))
    } catch (error) {
      setMessages(prev => prev.filter(msg => msg.id !== assistantMessage.id))
    }
  }, [model, temperature, createMessage])

  /**
   * Regenerates an assistant message
   */
  const regenerateMessage = useCallback(async (messageId) => {
    const targetMessage = messages.find(m => m.id === messageId)
    if (!targetMessage || targetMessage.role !== 'assistant') return

    const userMessage = messages
      .slice(0, messages.findIndex(m => m.id === messageId))
      .reverse()
      .find(m => m.role === 'user')
    
    if (!userMessage?.content) return

    setMessages(prev => prev.map(msg =>
      msg.id === messageId ? { ...msg, isLoading: true } : msg
    ))

    try {
      const useWeatherFunction = userMessage.content.startsWith('#weather')
      let content = await ChatService.sendMessage(
        userMessage.content,
        model,
        temperature,
        useWeatherFunction
      )

      // Ensure content is a string and handle objects
      if (typeof content === 'object') {
        content = JSON.stringify(content, null, 2)
      }

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