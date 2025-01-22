"""
Views for the ChatGPT clone API.
"""
from typing import Dict, List, Union, Optional
import os
import json
import requests

from django.conf import settings

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.request import Request


class OpenAIService:
    """Service class for handling Azure OpenAI API operations."""

    endpoint: str
    api_key: str
    deployment_models: List[str]
    valid_temperatures: List[float]
    api_version: str
    max_tokens: int

    def __init__(self) -> None:
        """Initialize Azure OpenAI API configuration."""
        self.endpoint = settings.AZURE_OPENAI_ENDPOINT
        self.api_key = settings.AZURE_OPENAI_API_KEY
        self.deployment_models = ["gpt-4o", "gpt-4o-mini"]
        self.valid_temperatures = [0.2, 0.7, 0.9]
        self.api_version = "2024-02-01"
        self.max_tokens = 2000

    def validate_parameters(self, model: str, temperature: float) -> None:
        """
        Validate input parameters for the API call.

        Args:
            model: The model to use (gpt-4o or gpt-4o-mini)
            temperature: The temperature setting (0.2, 0.7, or 0.9)

        Raises:
            ValueError: If parameters are invalid
        """
        if model not in self.deployment_models:
            raise ValueError(
                f"Invalid model. Must be one of {self.deployment_models}"
            )

        if temperature not in self.valid_temperatures:
            raise ValueError(
                f"Invalid temperature. Must be one of {self.valid_temperatures}"
            )

    def generate_response(self, prompt: str, model: str, temperature: float) -> str:
        """
        Generate a response using the Azure OpenAI API.

        Args:
            prompt: The user's input prompt
            model: The model to use (gpt-4o or gpt-4o-mini)
            temperature: The temperature setting (0.2, 0.7, or 0.9)

        Returns:
            The generated response in markdown format

        Raises:
            Exception: If API call fails
        """
        try:
            # Validate parameters
            self.validate_parameters(model, temperature)

            # Construct API URL
            api_url: str = f"{self.endpoint}openai/deployments/{model}/chat/completions?api-version={self.api_version}"

            # Request headers
            headers: Dict[str, str] = {
                "Content-Type": "application/json",
                "api-key": self.api_key
            }

            # Request payload
            data: Dict[str, Union[List[Dict[str, str]], int, float]] = {
                "messages": [
                    {
                        "role": "system",
                        "content": "You are a helpful assistant that responds in markdown format.",
                    },
                    {
                        "role": "user",
                        "content": f"{prompt}\n\nPlease format your response in markdown.",
                    },
                ],
                "max_tokens": self.max_tokens,
                "temperature": temperature,
            }

            # Send POST request
            response: requests.Response = requests.post(
                api_url,
                headers=headers,
                data=json.dumps(data)
            )
            response.raise_for_status()

            # Parse response
            response_data: Dict = response.json()
            return response_data["choices"][0]["message"]["content"]

        except requests.exceptions.RequestException as e:
            raise Exception(f"API request failed: {str(e)}")
        except KeyError as e:
            raise Exception(f"Unexpected API response format: {str(e)}")
        except Exception as e:
            raise Exception(f"Error generating response: {str(e)}")

### Views

@api_view(["POST"])
def generate_chat_response(request: Request) -> Response:
    """
    Generate a chat response using Azure OpenAI API.

    Args:
        request: The HTTP request object containing:
            prompt: User's input text
            model: gpt-4o or gpt-4o-mini
            temperature: 0.2, 0.7, or 0.9

    Returns:
        Response with generated text in markdown format or error message
    """
    # Check if request method is POST
    if request.method != "POST":
        return Response(
            {"error": "Only POST method is allowed"},
            status=status.HTTP_405_METHOD_NOT_ALLOWED,
        )

    try:
        # Get data from POST request
        prompt: Optional[str] = request.data.get("prompt")
        model: Optional[str] = request.data.get("model")
        temperature: Optional[float] = float(request.data.get("temperature"))

        # Validate required parameters
        if not all([prompt, model, temperature]):
            return Response(
                {"error": "Missing required parameters"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            # Initialize service and make API call
            service: OpenAIService = OpenAIService()
            response_text: str = service.generate_response(prompt, model, temperature)
            return Response({"response": response_text})

        except Exception as api_error:
            return Response(
                {"error": f"API call failed: {str(api_error)}"},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

    except ValueError as e:
        return Response(
            {"error": f"Invalid parameter format: {str(e)}"},
            status=status.HTTP_400_BAD_REQUEST,
        )
    except Exception as e:
        return Response(
            {"error": f"An unexpected error occurred: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
