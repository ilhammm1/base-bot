import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { summarizeText } from '../api'

export default function SummarizeTool() {
  const [text, setText] = useState('')
  const [style, setStyle] = useState('concise')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSummarize = async () => {
    if (!text.trim()) return
    setLoading(true)
    setError(null)

    try {
      const res = await summarizeText(text, style)
      setResult(res)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Text Summarization</h2>
        <p className="text-gray-400">Intelligent summarization powered by MiMo-V2.5-Pro reasoning</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex gap-2">
            {[
              { id: 'concise', label: 'Concise' },
              { id: 'detailed', label: 'Detailed' },
              { id: 'bullet_points', label: 'Bullet Points' },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => setStyle(s.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  style === s.id
                    ? 'bg-gradient-to-r from-mimo-500 to-orange-500 text-white'
                    : 'bg-dark-800 text-gray-400 hover:text-white'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste or type text to summarize..."
            className="textarea-field"
            rows={14}
          />

          <button
            onClick={handleSummarize}
            disabled={!text.trim() || loading}
            className="btn-primary w-full"
          >
            {loading ? 'Summarizing...' : 'Summarize'}
          </button>
        </div>

        <div className="glass-card p-6 min-h-[300px]">
          <h3 className="font-semibold text-gray-300 mb-4">Summary</h3>
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
                  Tokens: {result.usage.total_tokens}
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-48 text-gray-600">
              <p>Summary will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
