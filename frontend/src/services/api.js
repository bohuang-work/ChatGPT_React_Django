import axios from 'axios'
import { API_CONFIG } from '../constants/config'

/**
 * Chat API service for handling communication with the backend
 */
class ChatService {
  /**
   * Send a chat message to the backend
   * @param {Array} messages - Message history
   * @param {string} model - Selected model
   * @param {number} temperature - Temperature setting
   * @returns {Promise<string>} Response from the backend
   */
  static async sendMessage(messages, model, temperature) {
    const { data } = await axios.post(`${API_CONFIG.BACKEND_URL}/v1/chat/`, {
      messages,
      model,
      temperature
    })

    // Handle different response formats
    if (typeof data === 'string') return data
    if (data?.response?.content) return data.response.content
    if (data?.response) return typeof data.response === 'string' 
      ? data.response 
      : JSON.stringify(data.response)
    if (data?.content) return data.content
    
    return typeof data === 'object' ? JSON.stringify(data) : String(data)
  }
}

export default ChatService