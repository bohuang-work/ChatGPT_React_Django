import { useState } from 'react'
import ChatService from '../services/api'

/**
 * Custom hook for managing chat messages and interactions
 * @param {Object} options - Hook configuration options
 * @param {string} options.initialModel - Initial model selection
 * @param {number} options.initialTemperature - Initial temperature setting
 * @returns {Object} Chat state and handlers
 */
export function useChatMessages({ 
  initialModel = 'gpt-4o', 
  initialTemperature = 0.7 
}) {
  const [messages, setMessages] = useState([])
  const [model, setModel] = useState(initialModel)
  const [temperature, setTemperature] = useState(initialTemperature)

  const sendMessage = async (input) => {
    const userMessage = { 
      id: `user-${Date.now()}`,
      role: 'user', 
      content: input 
    }

    const assistantMessage = { 
      id: `assistant-${Date.now()}`,
      role: 'assistant', 
      content: '',
      isLoading: true
    }

    setMessages(prev => [...prev, userMessage, assistantMessage])

    try {
      const useWeatherFunction = input.startsWith("#weather")
      const response = await ChatService.sendMessage(
        input, 
        model, 
        temperature, 
        useWeatherFunction
      )

      const content = typeof response.response === 'object' 
        ? response.response.content 
        : response.response;

      setMessages(prev => prev.map(msg => 
        msg.id === assistantMessage.id 
          ? { ...msg, content, isLoading: false }
          : msg
      ))
    } catch (error) {
      setMessages(prev => prev.map(msg => 
        msg.id === assistantMessage.id 
          ? { 
              ...msg, 
              content: `Error: ${error.response?.data?.error || 'Failed to get response'}`,
              isLoading: false 
            }
          : msg
      ))
    }
  }

  const regenerateMessage = async (messageId) => {
    const messageIndex = messages.findIndex(msg => msg.id === messageId)
    const userMessage = messages[messageIndex - 1]
    if (!userMessage) return

    const assistantMessage = { 
      id: `assistant-${Date.now()}`,
      role: 'assistant', 
      content: '',
      isLoading: true
    }

    setMessages(prev => [...prev.slice(0, messageIndex), assistantMessage])

    try {
      const useWeatherFunction = userMessage.content.startsWith("#weather")
      const response = await ChatService.sendMessage(
        userMessage.content, 
        model, 
        temperature, 
        useWeatherFunction
      )

      const content = typeof response.response === 'object' 
        ? response.response.content 
        : response.response;

      setMessages(prev => prev.map(msg => 
        msg.id === assistantMessage.id 
          ? { ...msg, content, isLoading: false }
          : msg
      ))
    } catch (error) {
      setMessages(prev => prev.map(msg => 
        msg.id === assistantMessage.id 
          ? { 
              ...msg, 
              content: `Error: ${error.response?.data?.error || 'Failed to get response'}`,
              isLoading: false 
            }
          : msg
      ))
    }
  }

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