from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from unittest.mock import patch


class ChatAPITests(TestCase):
    """Test suite for Chat API endpoints"""

    def setUp(self):
        """Initialize test client and test data"""
        self.client = APIClient()
        self.chat_url = "/v1/chat/"

    @patch("chatGPTAPP.services.OpenAIService.call_chat_gpt")
    def test_basic_chat_response(self, mock_openai):
        """Test basic chat without function calls"""
        # Mock OpenAI response
        mock_openai.return_value = {
            "role": "assistant",
            "content": "Hello! I'm doing well, thank you for asking. How can I help you today?",
        }

        data = {
            "messages": [{"role": "user", "content": "Hello! How are you?"}],
            "model": "gpt-4o",
            "temperature": 0.7,
        }

        response = self.client.post(self.chat_url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("response", response.data) # type: ignore
        mock_openai.assert_called_once()

    @patch("chatGPTAPP.services.OpenAIService.call_chat_gpt")
    def test_weather_function_call(self, mock_openai):
        """Test chat flow with weather function call"""
        # Mock initial response with function call
        mock_openai.side_effect = [
            {
                "role": "assistant",
                "tool_calls": [
                    {
                        "id": "call_123",
                        "function": {
                            "name": "get_weather_forecast",
                            "arguments": '{"city": "London", "country": "UK"}',
                        },
                    }
                ],
            },
            # Mock final response after function call
            {
                "role": "assistant",
                "content": "The weather in London is cloudy with a chance of rain.",
            },
        ]

        data = {
            "messages": [{"role": "user", "content": "What's the weather in London?"}],
            "model": "gpt-4o",
            "temperature": 0.7,
        }

        response = self.client.post(self.chat_url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(mock_openai.call_count, 2)
        self.assertIn("weather", response.data["response"]["content"].lower()) # type: ignore
        self.assertIn("london", response.data["response"]["content"].lower()) # type: ignore
        self.assertIn("cloudy", response.data["response"]["content"].lower()) # type: ignore
        self.assertIn("rain", response.data["response"]["content"].lower()) # type: ignore

    def test_invalid_request_data(self):
        """Test handling of invalid request data"""
        invalid_cases = [
            ({}, "Missing required parameters"),
            ({"messages": []}, "Missing required parameters"),
            (
                {"messages": [], "model": "invalid", "temperature": 0.7},
                "Missing required parameters",
            ),
        ]

        for test_data, expected_error in invalid_cases:
            response = self.client.post(self.chat_url, test_data, format="json")
            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
            self.assertIn("error", response.data) # type: ignore
