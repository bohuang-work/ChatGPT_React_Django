/**
 * Application-wide configuration constants
 */
export const API_CONFIG = {
  BACKEND_URL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000',
  ENDPOINTS: {
    CHAT: '/v1/chat/'
  }
}

export const CHAT_CONFIG = {
  MODELS: ['gpt-4o', 'gpt-4o-mini'],
  TEMPERATURES: [0.2, 0.7, 0.9]
} 