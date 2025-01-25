import axios from 'axios'
import { API_CONFIG } from '../constants/config'

/**
 * Chat API service for handling communication with the backend
 */
class ChatService {
  /**
   * Send a chat message to the backend
   * @param {string} prompt - User's message
   * @param {string} model - Selected model
   * @param {number} temperature - Temperature setting
   * @param {boolean} useWeatherFunction - Whether to use weather function endpoint
   * @returns {Promise<Object>} Response from the backend
   */
  static async sendMessage(prompt, model, temperature, useWeatherFunction = false) {
    const endpoint = useWeatherFunction 
      ? API_CONFIG.ENDPOINTS.CHAT_WITH_FUNCTIONS 
      : API_CONFIG.ENDPOINTS.CHAT

    const response = await axios.post(`${API_CONFIG.BACKEND_URL}${endpoint}`, {
      prompt,
      model,
      temperature
    })

    return response.data
  }
}

export default ChatService 