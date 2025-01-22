from django.urls import path
from chatGPTAPP.views import generate_chat_response

urlpatterns = [
    path('chat/', generate_chat_response, name='chat'),
]