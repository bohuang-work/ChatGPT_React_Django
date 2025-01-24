import json
from typing import Dict, List, Union, Any

import requests
from django.conf import settings


class OpenAIService:
    """Service class for handling Azure OpenAI API operations."""

    endpoint: str
    api_key: str
    deployment_models: List[str]
    valid_temperatures: List[float]
    api_version: str
    max_tokens: int
    headers: Dict[str, str]
    api_url: str
    model: str | None
    temperature: float | None

    def __init__(self, model: str, temperature: float) -> None:
        """Initialize Azure OpenAI API configuration."""
        self.endpoint = settings.AZURE_OPENAI_ENDPOINT
        self.api_key = settings.AZURE_OPENAI_API_KEY
        self.deployment_models = ["gpt-4o", "gpt-4o-mini"]
        self.valid_temperatures = [0.2, 0.7, 0.9]
        self.api_version = "2024-02-01"
        self.max_tokens = 2000
        self.model = model
        self.temperature = temperature

        # Validate parameters
        self.validate_parameters(model, temperature)

        # Set headers
        self.headers = {
                "Content-Type": "application/json",
                "api-key": self.api_key,
            }

        # Construct API URL
        self.api_url = (
            f"{self.endpoint}openai/deployments/{self.model}/chat/completions?api-version={self.api_version}"
        )

    def validate_parameters(self, model: str | None, temperature: float | None) -> None:
        """
        Validate input parameters for the API call.

        Args:
            model: The model to use (gpt-4o or gpt-4o-mini)
            temperature: The temperature setting (0.2, 0.7, or 0.9)

        Raises:
            ValueError: If parameters are invalid
        """
        if model not in self.deployment_models:
            raise ValueError(f"Invalid model. Must be one of {self.deployment_models}")

        if temperature not in self.valid_temperatures:
            raise ValueError(
                f"Invalid temperature. Must be one of {self.valid_temperatures}"
            )

    def call_chat_gpt(self, prompt: str) -> str:
        """
        Generate a response using the Azure OpenAI API.

        Args:
            prompt: The user's input prompt

        Returns:
            The generated response in markdown format

        Raises:
            Exception: If API call fails
        """
        try:
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
                "temperature": self.temperature,
            }

            # Send POST request
            response: requests.Response = requests.post(
                self.api_url, headers=self.headers, data=json.dumps(data)
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
    
    def call_chat_gpt_with_functions(self, prompt: str, function_descriptions: List[Dict[str, str]]) -> str:
        """
        Generate a response using the Azure OpenAI API with function calling.

        Args:
            prompt: The user's input prompt
            function_descriptions: The function descriptions to extract target information from the prompt

        Returns:
            The generated response in markdown format
        """

        try:
            # Request payload
            data: Dict[str, Any] = {
                "messages": [
                    {
                        "role": "system",
                        "content": "You are a helpful assistant with function callings. Use functions when needed.",
                    },
                    {
                        "role": "user",
                        "content": f"{prompt}\n\n Please use functions when needed.",
                    },
                ],
                "functions": function_descriptions,
                "function_call": "auto",
                "max_tokens": self.max_tokens,
                "temperature": self.temperature,
            }

            # Send POST request
            response: requests.Response = requests.post(
                self.api_url, headers=self.headers, data=json.dumps(data)
            )
            response.raise_for_status()

            # Parse response
            response_data: Dict = response.json()
            return response_data["choices"][0]["message"]

        except requests.exceptions.RequestException as e:
            raise Exception(f"API request failed: {str(e)}")
        except KeyError as e:
            raise Exception(f"Unexpected API response format: {str(e)}")
        except Exception as e:
            raise Exception(f"Error generating response: {str(e)}")


class WeatherService:
    """Service for retrieving weather forecast data"""

    def __init__(self, latitude: float, longitude: float, timezone: str, days: int = 7):
        """
        Initialize the weather service.

        Args:
            latitude: The latitude coordinate
            longitude: The longitude coordinate 
            timezone: The timezone name (e.g. 'Europe/Berlin')
            days: Number of forecast days (default 7)
        """
        self.latitude = latitude
        self.longitude = longitude
        self.timezone = timezone
        self.days = days
        self.base_url = "https://api.open-meteo.com/v1/forecast"

    def get_weather_forecast(self) -> Dict[str, Any]:
        """
        Get weather forecast for the specified location.

        Returns:
            Dictionary containing daily weather data including:
            - time: List of dates
            - temperature_max: List of daily maximum temperatures
            - temperature_min: List of daily minimum temperatures 
            - precipitation: List of daily precipitation amounts
        """
        try:
            # Construct API URL with parameters
            url = f"{self.base_url}?latitude={self.latitude}&longitude={self.longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone={self.timezone}&forecast_days={self.days}"
            
            response = requests.get(url)
            response.raise_for_status()
            data = response.json()
            
            return {
                "daily": {
                    "time": data["daily"]["time"],
                    "temperature_max": data["daily"]["temperature_2m_max"],
                    "temperature_min": data["daily"]["temperature_2m_min"],
                    "precipitation": data["daily"]["precipitation_sum"]
                }
            }

        except requests.exceptions.RequestException as e:
            raise Exception(f"Weather API request failed: {str(e)}")
        except KeyError as e:
            raise Exception(f"Unexpected weather API response format: {str(e)}")
        except Exception as e:
            raise Exception(f"Error getting weather forecast: {str(e)}")
