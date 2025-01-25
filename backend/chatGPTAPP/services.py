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
            return response.json()["choices"][0]["message"]
        except requests.exceptions.RequestException as e:
            raise Exception(f"API request failed: {str(e)}")
        except KeyError as e:
            raise Exception(f"Unexpected API response format: {str(e)}")


class WeatherService:
    """Service for retrieving weather forecast data."""

    def __init__(self,  latitude, longitude, city_name, timezone="Europe/Berlin"):
        self.city_name = city_name
        self.timezone = timezone
        self.latitude = latitude
        self.longitude = longitude

    def get_weather_forecast(self):
        try:
            url = (
                f"https://api.open-meteo.com/v1/forecast"
                f"?latitude={self.latitude}"
                f"&longitude={self.longitude}"
                f"&daily=temperature_2m_max,temperature_2m_min,precipitation_sum"
                f"&timezone={self.timezone}"
            )

            response = requests.get(url)
            response.raise_for_status()
            data = response.json()

            daily = data["daily"]
            dates = daily["time"]
            max_temps = daily["temperature_2m_max"]
            min_temps = daily["temperature_2m_min"]
            precip = daily["precipitation_sum"]

            # Format as markdown table
            response = [f"## Weather Forecast for {self.city_name} (Next 7 Days)\n"]
            response.append("| Date | Max Temperature (°C) | Min Temperature (°C) | Precipitation (mm) |")
            response.append("|------|-------------------|-------------------|-----------------|")

            for i in range(len(dates)):
                response.append(
                    f"| {dates[i]} | {max_temps[i]:<17} | {min_temps[i]:<17} | {precip[i]:<15} |"
                )

            response.append(f"\nData source: Open-Meteo Weather API (https://open-meteo.com/). Forecast data is subject to updates and changes.")

            return {
                "content": "\n".join(response),
                "refusal": None,
                "role": "assistant"
            }

        except Exception as e:
            raise Exception(f"Error getting weather forecast: {str(e)}")
