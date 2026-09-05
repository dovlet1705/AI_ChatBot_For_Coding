# ChatBot FastAPI Backend

Backend service for the ChatBot platform. This application exposes an API that processes user messages and generates responses using the OpenAI API.

The backend is built with **FastAPI** and can be used either by a frontend client or through a command-line interface (CLI).

---

# Frontend Repository

The frontend application for this project is available here:

https://github.com/Davut2005/AI_ChatBot_frontend

---

# Tech Stack

- Python
- FastAPI
- OpenAI API
- uv (Python dependency and environment manager)

---

# Features

- REST API for chatbot conversations
- Integration with OpenAI for generating AI-generated responses
- Clean and modular FastAPI backend
- CLI interface to interact with the chatbot directly from the terminal
- Simple environment setup using `uv`

---


**main.py**  
Entry point of the FastAPI application.

**cli/chatbot_cli.py**  
Command-line chatbot interface used to communicate with the backend API directly from the terminal.

---

# Requirements

- Python 3.10 or newer
- uv package manager

Install `uv` if it is not installed:
pip install uv

Install project dependencies:
uv sync


---

# Running the Backend API

Start the FastAPI server:
uv run main.py


---

# Running the CLI Chatbot

You can also interact with the chatbot directly from the terminal using the CLI tool.

Run:
uv run cli/chatbot_cli.py
