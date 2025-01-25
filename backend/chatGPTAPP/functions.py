# Function definitions for chatGPT function calling
function_descriptions = [
    {
        "name": "get_weather_forecast",
        "description": "Get daily weather forecast for a city",
        "parameters": {
            "type": "object",
            "properties": {
                "timezone": {
                    "type": "string", 
                    "description": "Timezone name, e.g. Europe/Berlin",
                },
                "latitude": {
                    "type": "number",
                    "description": "The latitude of the city. e.g. 48.137",
                },
                "longitude": {
                    "type": "number",
                    "description": "The longitude of the city. e.g. 11.576",
                },
                "city_name": {
                    "type": "string",
                    "description": "Name of the city, e.g. Munich",
                },
            },
            "required": ["latitude", "longitude", "city_name", "timezone"]
        },
    }
]