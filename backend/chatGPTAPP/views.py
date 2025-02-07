"""
Views for the ChatGPT clone API.
"""

import json
from typing import Dict, Any

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.request import Request
from rest_framework.response import Response

from chatGPTAPP.functions import function_descriptions, get_weather_forecast
from chatGPTAPP.services import OpenAIService


### Constants ###
VALID_MODELS = ["gpt-4o", "gpt-4o-mini"]
VALID_TEMPERATURES = [0.2, 0.7, 0.9]
MAX_TOKENS = 2000  # Maximum number of tokens to generate


### Function Map ###
FUNCTION_MAP = {"get_weather_forecast": get_weather_forecast}


### Views ###
def handle_function_call(function_call: Dict[str, Any]) -> str:
    """Handle function calls from the AI.

    Args:
        function_call: Function call details from AI response

    Returns:
        str: Function response or error message
    """
    try:
        func_name = function_call.get("name")
        if not func_name in FUNCTION_MAP:
            return f"Unknown function: {func_name}"

        # Parse arguments
        arguments = json.loads(function_call.get("arguments", "{}"))

        # Call the function
        func = FUNCTION_MAP[func_name]  # type: ignore
        result = func(**arguments)

        return result

    except Exception as e:
        return f"Function call failed: {str(e)}"


@api_view(["GET", "POST"])
def generate_chat_response(request: Request) -> Response:
    """Generate a chat response using Azure OpenAI API with function calling.

    Example request:
    ```json
    {
        "messages": [
            {"role": "user", "content": "What's the weather like in Paris?"}
        ],
        "model": "gpt-4o",
        "temperature": 0.7
    }
    ```
    """
    if request.method == "GET":
        return Response(
            {
                "message": "This endpoint accepts POST requests only",
                "example_request": {
                    "messages": [
                        {"role": "user", "content": "What's the weather like in Paris?"}
                    ],
                    "model": "gpt-4o",
                    "temperature": 0.7,
                },
            }
        )

    try:
        messages = request.data.get("messages", [])  # type: ignore
        model = request.data.get("model")  # type: ignore
        temperature = request.data.get("temperature")  # type: ignore

        if not all([messages, model, temperature]):
            raise ValueError("Missing required parameters")

        # Initial request with function definitions
        data = {
            "messages": messages,
            "model": model,
            "temperature": temperature,
            "max_tokens": MAX_TOKENS,
            "tools": function_descriptions,
            "tool_choice": "auto",  # Let the model decide when to use functions
        }

        service = OpenAIService()
        response = service.call_chat_gpt(model, data)  # type: ignore

        # Check if the AI wants to call a function
        if "tool_calls" in response:
            for tool_call in response["tool_calls"]:
                # Handle the function call
                function_response = handle_function_call(tool_call["function"])

                # Add function result to messages
                messages.append(
                    {"role": "assistant", "content": None, "tool_calls": [tool_call]}
                )
                messages.append(
                    {
                        "role": "tool",
                        "tool_call_id": tool_call["id"],
                        "content": function_response,
                    }
                )

            # Make a second request to process function results
            data = {
                "messages": messages,
                "model": model,
                "temperature": temperature,
                "max_tokens": MAX_TOKENS,
            }

            response = service.call_chat_gpt(model, data)  # type: ignore

        return Response({"response": response})

    except ValueError as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response(
            {"error": f"An unexpected error occurred: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
