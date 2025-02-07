"""Function definitions for chatGPT function calling"""

import requests

function_descriptions = [
    {
        "type": "function",
        "function": {
            "name": "get_weather_forecast",
            "description": "Get detailed weather forecast for a location including temperature and precipitation",
            "parameters": {
                "type": "object",
                "properties": {
                    "latitude": {
                        "type": "number",
                        "description": "The latitude of the location (e.g. 48.8566 for Paris)"
                    },
                    "longitude": {
                        "type": "number",
                        "description": "The longitude of the location (e.g. 2.3522 for Paris)"
                    },
                    "timezone": {
                        "type": "string",
                        "description": "Timezone for the forecast (e.g. Europe/Paris)"
                    }
                },
                "required": ["latitude", "longitude", "timezone"],
                "additionalProperties": False
            },
            "strict": True
        }
    }
]

def get_weather_forecast(latitude: float, longitude: float, timezone: str = "UTC"):
    """Get weather forecast data from Open-Meteo API.
    
    Args:
        latitude: Location latitude
        longitude: Location longitude
        timezone: Timezone name
        
    Returns:
        str: Formatted weather data as markdown
    """
    try:
        url = (
            f"https://api.open-meteo.com/v1/forecast"
            f"?latitude={latitude}"
            f"&longitude={longitude}"
            f"&daily=temperature_2m_max,temperature_2m_min,precipitation_sum"
            f"&timezone={timezone}"
            f"&forecast_days=7"
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
        result = ["## 7-Day Weather Forecast\n"]
        result.append("| Date | Max Temp (°C) | Min Temp (°C) | Precipitation (mm) |")
        result.append("|------|--------------|--------------|-------------------|")

        for i in range(len(dates)):
            result.append(
                f"| {dates[i]} | {max_temps[i]:.1f} | {min_temps[i]:.1f} | {precip[i]:.1f} |"
            )

        result.append("\nData source: Open-Meteo Weather API")
        
        return "\n".join(result)

    except Exception as e:
        return f"Error getting weather forecast: {str(e)}"