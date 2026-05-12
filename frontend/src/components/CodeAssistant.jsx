import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { generateCode, reviewCode, explainCode } from '../api'

const LANGUAGES = [
  'python', 'javascript', 'typescript', 'java', 'go', 'rust',
  'c', 'cpp', 'csharp', 'ruby', 'swift', 'kotlin', 'php', 'sql',
]

export default function CodeAssistant() {
  const [input, setInput] = useState('')
  const [language, setLanguage] = useState('python')
  const [mode, setMode] = useState('generate')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async () => {
    if (!input.trim()) return
    setLoading(true)
    setError(null)

    try {
      let res
      if (mode === 'generate') {
        res = await generateCode(input, language)
      } else if (mode === 'review') {
        res = await reviewCode(input, language)
      } else {
        res = await explainCode(input, language)
      }
      setResult(res)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const placeholders = {
    generate: 'Describe the code you want to generate...\ne.g., "Create a REST API with FastAPI that handles CRUD operations for a todo list"',
    review: 'Paste code to review...',
    explain: 'Paste code to explain...',
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Code Assistant</h2>
        <p className="text-gray-400">Generate, review, and understand code with MiMo-V2.5-Pro</p>
      </div>

      {/* Mode Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { id: 'generate', label: 'Generate', icon: '⚡' },
          { id: 'review', label: 'Review', icon: '🔍' },
          { id: 'explain', label: 'Explain', icon: '📖' },
        ].map((m) => (
          <button
            key={m.id}
            onClick={() => { setMode(m.id); setResult(null); setError(null) }}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              mode === m.id
                ? 'bg-gradient-to-r from-mimo-500 to-orange-500 text-white'
                : 'bg-dark-800 text-gray-400 hover:text-white'
            }`}
          >
            {m.icon} {m.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="space-y-4">
          <div className="flex gap-3">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="input-field w-auto text-sm"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholders[mode]}
            className="textarea-field font-mono text-sm"
            rows={16}
          />

          <button
            onClick={handleSubmit}
            disabled={!input.trim() || loading}
            className="btn-primary w-full"
          >
            {loading ? 'Processing...' : mode === 'generate' ? 'Generate Code' : mode === 'review' ? 'Review Code' : 'Explain Code'}
          </button>
        </div>

        {/* Output */}
        <div className="glass-card p-6 overflow-auto max-h-[600px]">
          <h3 className="font-semibold text-gray-300 mb-4">
            {mode === 'generate' ? 'Generated Code' : mode === 'review' ? 'Review Results' : 'Explanation'}
          </h3>
          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}
          {result ? (
            <div>
              <div className="prose prose-invert prose-sm max-w-none">
                <ReactMarkdown>{result.content}</ReactMarkdown>
              </div>
              {result.usage && (
                <div className="mt-4 pt-3 border-t border-dark-600/50 text-xs text-gray-500">
                  Model: {result.model} | Tokens: {result.usage.total_tokens}
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-48 text-gray-600">
              <p>{mode === 'generate' ? 'Describe what you need' : 'Paste code to analyze'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
