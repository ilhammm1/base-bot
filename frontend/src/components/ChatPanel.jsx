import React, { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { sendChat } from '../api'

export default function ChatPanel() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [model, setModel] = useState('MiMo-V2.5-Pro')
  const messagesEnd = useRef(null)

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage = { role: 'user', content: input.trim() }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const apiMessages = newMessages.map(m => ({ role: m.role, content: m.content }))
      const response = await sendChat(apiMessages, model)
      setMessages([...newMessages, {
        role: 'assistant',
        content: response.content,
        usage: response.usage,
      }])
    } catch (err) {
      setMessages([...newMessages, {
        role: 'assistant',
        content: `Error: ${err.message}`,
        error: true,
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-dark-700/50">
        <div>
          <h2 className="text-xl font-bold">AI Chat</h2>
          <p className="text-sm text-gray-500">Powered by MiMo V2.5 Pro — 1M context window</p>
        </div>
        <select
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="input-field w-auto text-sm"
        >
          <option value="MiMo-V2.5-Pro">MiMo-V2.5-Pro (Reasoning)</option>
          <option value="MiMo-V2.5">MiMo-V2.5 (Multimodal)</option>
        </select>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">Start a Conversation</h3>
              <p className="text-gray-500">Ask anything — coding, analysis, creative writing, and more.</p>
            </div>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] rounded-2xl px-5 py-3 ${
              msg.role === 'user'
                ? 'bg-gradient-to-r from-mimo-500 to-orange-500 text-white'
                : msg.error
                  ? 'glass-card border-red-500/30 text-red-400'
                  : 'glass-card text-gray-200'
            }`}>
              {msg.role === 'assistant' ? (
                <div className="prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              ) : (
                <p className="whitespace-pre-wrap">{msg.content}</p>
              )}
              {msg.usage && (
                <div className="mt-2 pt-2 border-t border-dark-600/50 text-xs text-gray-500">
                  Tokens: {msg.usage.total_tokens} (prompt: {msg.usage.prompt_tokens}, completion: {msg.usage.completion_tokens})
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="glass-card px-5 py-3">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-mimo-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-mimo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-mimo-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEnd} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-dark-700/50">
        <div className="flex gap-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message... (Enter to send, Shift+Enter for new line)"
            className="textarea-field flex-1"
            rows={2}
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="btn-primary self-end"
          >
            {loading ? '...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  )
}
