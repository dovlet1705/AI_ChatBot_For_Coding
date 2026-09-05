import openai

history = []

client = openai.OpenAI(
    base_url="http://localhost:11434/v1",
    api_key="ollama"
)

while True:
    print("\nAsk something from DovletAI (press q or e to exit)")
    prompt = input("You: ")

    if prompt.lower() in ["q", "e"]:
        print("Have a nice day")
        break

    history.append({
        "role": "user",
        "content": prompt
    })

    print("Bot: ", end="", flush=True)

    response = client.chat.completions.create(
        model="llama3.2:1b",
        messages=history,
        stream=True
    )

    bot_msg_response = ""

    for chunk in response:
        content = chunk.choices[0].delta.content

        if content:
            bot_msg_response += content
            print(content, end="", flush=True)

    print()

    history.append({
        "role": "assistant",
        "content": bot_msg_response
    })
