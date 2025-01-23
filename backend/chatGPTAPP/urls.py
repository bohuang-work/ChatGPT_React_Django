from django.urls import path
from chatGPTAPP.views import generate_chat_response, generate_chat_response_with_functions

urlpatterns = [
    path('chat/', generate_chat_response, name='chat'),
    path("chat_with_functions/", generate_chat_response_with_functions, name="chat_with_functions"),
]