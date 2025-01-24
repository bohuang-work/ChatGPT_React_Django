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

    def call_chat_gpt(self, model: str, data: Dict[str, Any]) -> str:
        """
        Make API call to Azure OpenAI.

        Args:
            model: The model name to use for completion, must be one of ["gpt-4o", "gpt-4o-mini"]
            data: The request data containing messages and parameters

        Returns:
            str: The generated text response from the model

        Raises:
            Exception: If the API request fails or response format is unexpected
        """
        try:
            url = f"{self.endpoint}openai/deployments/{model}/chat/completions?api-version={self.api_version}"
            response: requests.Response = requests.post(
                url, headers=self.headers, json=data
            )
            response.raise_for_status()
            return response.json()["choices"][0]["message"]["content"]
        except requests.exceptions.RequestException as e:
            raise Exception(f"API request failed: {str(e)}")
        except KeyError as e:
            raise Exception(f"Unexpected API response format: {str(e)}")


class WeatherService:
    """Service for retrieving weather forecast data."""

    def __init__(
        self, latitude: float, longitude: float, timezone: str, days: int = 7
    ) -> None:
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
            Dict[str, Any]: Dictionary containing daily weather data including:
                - time: List of dates
                - temperature_max: List of daily maximum temperatures
                - temperature_min: List of daily minimum temperatures
                - precipitation: List of daily precipitation amounts

        Raises:
            Exception: If the weather API request fails or response format is unexpected
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
                    "precipitation": data["daily"]["precipitation_sum"],
                }
            }

        except requests.exceptions.RequestException as e:
            raise Exception(f"Weather API request failed: {str(e)}")
        except KeyError as e:
            raise Exception(f"Unexpected weather API response format: {str(e)}")
        except Exception as e:
            raise Exception(f"Error getting weather forecast: {str(e)}")
