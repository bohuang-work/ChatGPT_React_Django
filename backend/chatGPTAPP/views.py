"""
Views for the ChatGPT clone API.
"""

import json
from typing import Optional, Any

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.request import Request
from rest_framework.response import Response

from chatGPTAPP.functions import function_descriptions
from chatGPTAPP.services import OpenAIService, WeatherService


### Views ###
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
        # Get data from POST request
        prompt: Optional[str] = request.data.get("prompt")  # type: ignore
        model: Optional[str] = request.data.get("model")  # type: ignore
        temperature: Optional[float] = float(request.data.get("temperature"))  # type: ignore

        # Validate required parameters
        if not all([prompt, model, temperature]):
            return Response(
                {"error": "Missing required parameters"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            # Initialize service and make API call
            service: OpenAIService = OpenAIService(model=model, temperature=temperature)  # type: ignore
            response_text: str = service.call_chat_gpt(prompt)  # type: ignore
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
        # Get data from POST request
        prompt: Optional[str] = request.data.get("prompt")  # type: ignore
        model: Optional[str] = request.data.get("model")  # type: ignore
        temperature: Optional[float] = request.data.get("temperature")  # type: ignore

        # Validate required parameters
        if not all([prompt, model, temperature]):
            return Response(
                {"error": "Missing required parameters"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            # Initialize OpenAI service for function calling
            openai_service: OpenAIService = OpenAIService(
                model=model, temperature=temperature  # type: ignore
            )
            # First call with function descriptions to extract weather info
            function_response: dict[str, str | dict[str, Any]] = openai_service.call_chat_gpt_with_functions(  # type: ignore
                prompt=prompt if prompt is not None else "",
                function_descriptions=function_descriptions,
            )

            # Parse function response to get weather parameters
            if "function_call" not in function_response:
                return Response(
                    {
                        "response": "I can't find the information of the city you're looking for. Please provide me with the name of the city."
                    }
                )

            weather_args: dict = json.loads(
                function_response["function_call"]["arguments"]  # type: ignore
            )

            # Check if all required parameters are present
            required_params: list[str] = ["latitude", "longitude"]
            if not all(weather_args.get(param) for param in required_params):
                return Response(
                    {
                        "response": "I can't find the complete location information. Please provide a valid city name."
                    }
                )

            # Initialize weather service with extracted parameters
            weather_service: WeatherService = WeatherService(
                latitude=float(weather_args["latitude"]),
                longitude=float(weather_args["longitude"]),
                timezone=weather_args.get("timezone", "Europe/Berlin"),
            )

            # Get actual weather data
            weather_data: dict = weather_service.get_weather_forecast()

            # Generate final response with weather data
            final_prompt: str = (
                f"{prompt}\n\nHere's the weather data: {json.dumps(weather_data)}"
            )
            final_response: str = openai_service.call_chat_gpt(final_prompt)

            return Response({"response": final_response})

        except json.JSONDecodeError:
            return Response(
                {"error": "Failed to parse API response"},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )
        except Exception as api_error:
            return Response(
                {"error": f"API call failed: {str(api_error)}"},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

    except Exception as e:
        return Response(
            {"error": f"An unexpected error occurred: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
