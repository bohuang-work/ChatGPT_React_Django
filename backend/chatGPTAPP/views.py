"""
Views for the ChatGPT clone API.
"""

import json
from typing import Optional

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.request import Request
from rest_framework.response import Response

from chatGPTAPP.functions import function_descriptions
from chatGPTAPP.services import OpenAIService, WeatherService


### Constants ###
VALID_MODELS = ["gpt-4o", "gpt-4o-mini"]
VALID_TEMPERATURES = [0.2, 0.7, 0.9]
MAX_TOKENS = 2000 # Maximum number of tokens to generate


### Views ###
def validate_request(
    data: dict,
) -> tuple[Optional[str], Optional[str], Optional[float]]:
    """Validate request data and return validated values.
    Make sure that the request data is not empty and that the model and temperature are valid.

    Args:
        data: The request data containing prompt, model, and temperature

    Returns:
        tuple[Optional[str], Optional[str], Optional[float]]: Validated prompt, model, and temperature
    """
    prompt = data.get("prompt")
    model = data.get("model")
    temperature = data.get("temperature")

    if not all([prompt, model, temperature]):
        raise ValueError("Missing required parameters")

    if model not in VALID_MODELS:
        raise ValueError(f"Invalid model. Must be one of {VALID_MODELS}")

    try:
        temp = float(temperature) # type: ignore
        if temp not in VALID_TEMPERATURES:
            raise ValueError(
                f"Invalid temperature. Must be one of {VALID_TEMPERATURES}"
            )
    except (TypeError, ValueError):
        raise ValueError("Temperature must be a valid number")

    return prompt, model, temp


@api_view(["GET", "POST"])
def generate_chat_response(request: Request) -> Response:
    """
    Generate a chat response using Azure OpenAI API.

    Example request:
    ```json
    {
        "prompt": "What is Python?",
        "model": "gpt-4o",
        "temperature": 0.7
    }
    ```

    Args:
        request: The HTTP request object containing:
            prompt: User's input text
            model: gpt-4o or gpt-4o-mini
            temperature: 0.2, 0.7, or 0.9

    Returns:
        Response with generated text in markdown format or error message
    """
    # If it's a GET request, return the API documentation
    if request.method == "GET":
        return Response(
            {
                "message": "This endpoint accepts POST requests only",
                "example_request": {
                    "prompt": "What is Python?",
                    "model": "gpt-4o",
                    "temperature": 0.7,
                },
            }
        )

    try:
        prompt, model, temperature = validate_request(request.data) # type: ignore

        data = {
            "messages": [{"role": "user", "content": prompt}],
            "model": model,
            "temperature": temperature,
            "max_tokens": MAX_TOKENS,
        }

        service = OpenAIService()
        response_text = service.call_chat_gpt(model, data) # type: ignore
        return Response({"response": response_text})

    except ValueError as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response(
            {"error": f"An unexpected error occurred: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["GET", "POST"])
def generate_chat_response_with_functions(request: Request) -> Response:
    """
    Generate chat response with function calling capability.

    Example request:
    ```json
    {
        "prompt": "What's the weather in Munich for next 7 days?",
        "model": "gpt-4o",
        "temperature": 0.7
    }
    ```

    Args:
        request: HTTP request containing:
            prompt: User input text (e.g., "What's the weather in Munich?")
            model: gpt-4o or gpt-4o-mini
            temperature: 0.2, 0.7, or 0.9

    Returns:
        Response with generated text in markdown format including weather data
    """
    # If it's a GET request, return the API documentation
    if request.method == "GET":
        return Response(
            {
                "message": "This endpoint accepts POST requests only",
                "example_request": {
                    "prompt": "What's the weather in Munich for next 7 days?",
                    "model": "gpt-4o",
                    "temperature": 0.7,
                },
            }
        )

    try:
        prompt, model, temperature = validate_request(request.data) # type: ignore

        data = {
            "messages": [
                {
                    "role": "system",
                    "content": "You are a helpful assistant with function callings.",
                },
                {
                    "role": "user",
                    "content": f"{prompt}\n\nPlease use functions when needed.",
                },
            ],
            "functions": function_descriptions,
            "function_call": "auto",
            "model": model,
            "temperature": temperature,
            "max_tokens": 2000,
        }

        service = OpenAIService()
        function_response = service.call_chat_gpt(model, data) # type: ignore

        if "function_call" not in function_response:
            return Response(
                {
                    "response": "I can't find the information of the city you're looking for."
                }
            )

        weather_args = json.loads(function_response["function_call"]["arguments"]) # type: ignore
        required_params = ["latitude", "longitude"]

        if not all(weather_args.get(param) for param in required_params):
            return Response(
                {"response": "I can't find the complete location information."}
            )

        weather_service = WeatherService(
            latitude=float(weather_args["latitude"]),
            longitude=float(weather_args["longitude"]),
            timezone=weather_args.get("timezone", "Europe/Berlin"),
        )

        weather_data = weather_service.get_weather_forecast()
        final_data = {
            "messages": [
                {
                    "role": "user",
                    "content": f"{prompt}\n\nHere's the weather data: {json.dumps(weather_data)}",
                }
            ],
            "model": model,
            "temperature": temperature,
            "max_tokens": MAX_TOKENS,
        }

        final_response = service.call_chat_gpt(model, final_data) # type: ignore
        return Response({"response": final_response})

    except ValueError as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response(
            {"error": f"An unexpected error occurred: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
