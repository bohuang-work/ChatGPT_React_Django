from typing import Any, Dict

import requests
from django.conf import settings


class OpenAIService:
    """Service class for handling Azure OpenAI API operations."""

    def __init__(self) -> None:
        """Initialize Azure OpenAI API configuration."""
        self.endpoint = settings.AZURE_OPENAI_ENDPOINT
        self.api_key = settings.AZURE_OPENAI_API_KEY
        self.api_version = "2024-02-01"
        self.headers = {
            "Content-Type": "application/json",
            "api-key": self.api_key,
        }

    def call_chat_gpt(self, model: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Make API call to Azure OpenAI.

        Args:
            model: The model name to use for completion
            data: The request data containing messages and parameters

        Returns:
            Dict[str, Any]: The generated response from the model

        Raises:
            Exception: If the API request fails or response format is unexpected
        """
        try:
            url = f"{self.endpoint}openai/deployments/{model}/chat/completions?api-version={self.api_version}"
            response: requests.Response = requests.post(
                url, headers=self.headers, json=data
            )
            response.raise_for_status()
            return response.json()["choices"][0]["message"]
        except requests.exceptions.RequestException as e:
            raise Exception(f"API request failed: {str(e)}")
        except KeyError as e:
            raise Exception(f"Unexpected API response format: {str(e)}")
