from fastapi import APIRouter
from openai import OpenAI
from core.config import settings
import ollama

client = OpenAI( api_key=settings.OPENAI_API_KEY )

router = APIRouter(
    prefix="/chat",
    tags=["chat"]
)


@router.post("")
async def createChat(msg: str):
    
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages= [
            {"role": "system", "content": "You are QA expert. Answer the questions with code blocks where possible"},
            {"role": "user", "content": msg}
        ]
    )


    return { "response": response.choices[0].message.content}
