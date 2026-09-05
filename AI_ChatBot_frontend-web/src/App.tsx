import { useEffect, useRef, useState } from 'react'
import './App.css'
import { createChat } from './api_routers/message'
import { uploadFile } from './api_routers/uploadFile'

const THEME_KEY = 'chatbot-theme'
type Theme = 'dark' | 'light'

function getInitialTheme(): Theme {
  try {
    const fromDoc = document.documentElement.getAttribute('data-theme')
    if (fromDoc === 'light' || fromDoc === 'dark') return fromDoc as Theme
    const stored = localStorage.getItem(THEME_KEY) as Theme | null
    if (stored === 'dark' || stored === 'light') return stored
  } catch (_) {}
  return 'dark'
}

interface Message {
  text: string
  sender: 'user' | 'bot'
  time: string
}

function App() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hello. How can I assist you today?",
      sender: 'bot',
      time: getCurrentTime()
    }
  ])

  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  function getCurrentTime() {
    return new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    try {
      localStorage.setItem(THEME_KEY, theme)
      document.documentElement.setAttribute('data-theme', theme)
    } catch (_) {}
  }, [theme])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0])
      const response = await uploadFile(e.target.files[0])
      console.log("response from upload file" , response)
    }
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
  }

  const handleSend = async () => {
    if (!input.trim() && !selectedFile) return

    const userMessage: Message = {
      text:
        input +
        (selectedFile ? ` (Attached: ${selectedFile.name})` : ''),
      sender: 'user',
      time: getCurrentTime()
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setSelectedFile(null)
    setLoading(true)

    try {
      const data = await createChat(input)

      const botMessage: Message = {
        text: data.response,
        sender: 'bot',
        time: getCurrentTime()
      }

      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      const errorMessage: Message = {
        text: "An unexpected error occurred.",
        sender: 'bot',
        time: getCurrentTime()
      }

      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend()
    }
  }

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  return (
    <div className="app-container" data-theme={theme}>
      <header className="header">
        <h1>Dovlet GPT</h1>
        <button
          type="button"
          className="theme-toggle"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          <span className="theme-icon theme-icon-sun" aria-hidden>☀️</span>
          <span className="theme-icon theme-icon-moon" aria-hidden>🌙</span>
        </button>
      </header>

      <div className="chat-container">
        <div className="messages-list">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              <div className="message-bubble">
                <div className="message-text">{msg.text}</div>
                <div className="message-time">{msg.time}</div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="message bot">
              <div className="message-bubble">
                <div className="message-text">
                  <span className="typing-indicator">Typing</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="input-container-wrapper">
          {selectedFile && (
            <div className="file-preview-container">
              <div className="file-preview">
                <span className="file-preview-name">
                  {selectedFile.name}
                </span>
                <button
                  className="remove-file-btn"
                  onClick={handleRemoveFile}
                  title="Remove file"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          <div className="input-area">
            <div className="file-input-wrapper">
              <label
                htmlFor="file-upload"
                className="file-upload-btn"
                title="Attach file"
              >
                📎
                <input
                  id="file-upload"
                  type="file"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              </label>
            </div>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your message..."
              disabled={loading}
            />

            <button
              onClick={handleSend}
              disabled={loading || (!input.trim() && !selectedFile)}
            >
              ➤
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App