import openai
from core.config import settings

history = []

client = openai.OpenAI( api_key=settings.OPENAI_API_KEY )

while True:
    print("Ask something from DavutAI (press q or e to exit)")
    prompt = input("You:  ")

    if (prompt in ["q", "e"]):
        print("Have a nice day")
        break

    message = {
        "role": "user",
        "content": prompt
    }

    history.append(message)

    print( "Bot:  ", end="", flush=True )

    response = client.chat.completions.create(
        model = "gpt-4o-mini",
        messages = history,
        stream = True
    )

    bot_msg_response = ""

    for chunk in response:
        bot_msg_response += chunk.choices[0].message.content
        print(chunk.choices[0].message.content , end="", flush=True)
    
    bot_message = {
        "role": "assistant",
        "content": bot_msg_response
    }

    history.append(bot_message)
    