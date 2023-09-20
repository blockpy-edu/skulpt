from dataclasses import dataclass
from urllib import request
import json

api_key = ""


@dataclass
class ChatResponse:
    choices: list

@dataclass
class Content:
    content: str

@dataclass
class Message:
    message: Content

class OpenAIConnection:
    def create(self, **kwargs):
        result = request.urlopen(api_key, json.dumps(kwargs))
        return ChatResponse([Message(Content(result.read()))])

ChatCompletion = OpenAIConnection()
