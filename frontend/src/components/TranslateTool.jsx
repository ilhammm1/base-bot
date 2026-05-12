import React, { useState } from 'react'
import { translateText } from '../api'

const LANGUAGES = [
  { code: 'auto', label: 'Auto Detect' },
  { code: 'en', label: 'English' },
  { code: 'zh', label: 'Chinese' },
  { code: 'ja', label: 'Japanese' },
  { code: 'ko', label: 'Korean' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' },
  { code: 'de', label: 'German' },
  { code: 'pt', label: 'Portuguese' },
  { code: 'ru', label: 'Russian' },
  { code: 'ar', label: 'Arabic' },
  { code: 'id', label: 'Indonesian' },
  { code: 'hi', label: 'Hindi' },
  { code: 'th', label: 'Thai' },
  { code: 'vi', label: 'Vietnamese' },
]

export default function TranslateTool() {
  const [text, setText] = useState('')
  const [sourceLang, setSourceLang] = useState('auto')
  const [targetLang, setTargetLang] = useState('en')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleTranslate = async () => {
    if (!text.trim()) return
    setLoading(true)
    setError(null)

    try {
      const res = await translateText(text, targetLang, sourceLang)
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
        <h2 className="text-2xl font-bold mb-2">Translation</h2>
        <p className="text-gray-400">Professional multi-language translation with MiMo-V2.5-Pro</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <select
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value)}
              className="input-field w-auto text-sm"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>{l.label}</option>
              ))}
            </select>
            <span className="text-gray-500">→</span>
            <select
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              className="input-field w-auto text-sm"
            >
              {LANGUAGES.filter(l => l.code !== 'auto').map((l) => (
                <option key={l.code} value={l.code}>{l.label}</option>
              ))}
            </select>
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text to translate..."
            className="textarea-field"
            rows={10}
          />

          <button
            onClick={handleTranslate}
            disabled={!text.trim() || loading}
            className="btn-primary w-full"
          >
            {loading ? 'Translating...' : 'Translate'}
          </button>
        </div>

        <div className="glass-card p-6 min-h-[300px]">
          <h3 className="font-semibold text-gray-300 mb-4">Translation</h3>
          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}
          {result ? (
            <div>
              <p className="text-gray-200 whitespace-pre-wrap">{result.content}</p>
              {result.usage && (
                <div className="mt-4 pt-3 border-t border-dark-600/50 text-xs text-gray-500">
                  Tokens: {result.usage.total_tokens}
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-48 text-gray-600">
              <p>Translation will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
