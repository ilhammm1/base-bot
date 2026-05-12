import React, { useState, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import { analyzeAudio } from '../api'

export default function AudioAnalysis() {
  const [file, setFile] = useState(null)
  const [prompt, setPrompt] = useState('Transcribe and describe this audio.')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const fileRef = useRef()

  const handleFileChange = (e) => {
    const selected = e.target.files[0]
    if (selected) {
      setFile(selected)
      setResult(null)
      setError(null)
    }
  }

  const handleAnalyze = async () => {
    if (!file) return
    setLoading(true)
    setError(null)

    try {
      const res = await analyzeAudio(file, prompt)
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
        <h2 className="text-2xl font-bold mb-2">Audio Analysis</h2>
        <p className="text-gray-400">Transcribe and analyze audio with MiMo-V2.5 native audio encoder</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div
            onClick={() => fileRef.current?.click()}
            className="glass-card-hover p-8 text-center cursor-pointer min-h-[200px] flex flex-col items-center justify-center"
          >
            {file ? (
              <div>
                <div className="text-5xl mb-4">🎵</div>
                <p className="text-gray-300 font-medium">{file.name}</p>
                <p className="text-xs text-gray-500 mt-1">{(file.size / 1024).toFixed(1)} KB</p>
                <audio controls className="mt-4 w-full" src={URL.createObjectURL(file)} />
              </div>
            ) : (
              <>
                <div className="text-5xl mb-4">🎵</div>
                <p className="text-gray-400 mb-2">Click to upload audio</p>
                <p className="text-xs text-gray-600">Supports WAV, MP3, OGG, FLAC</p>
              </>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            className="hidden"
          />

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="What would you like to know about this audio?"
            className="textarea-field"
            rows={3}
          />

          <button
            onClick={handleAnalyze}
            disabled={!file || loading}
            className="btn-primary w-full"
          >
            {loading ? 'Analyzing...' : 'Analyze Audio'}
          </button>
        </div>

        <div className="glass-card p-6 min-h-[200px]">
          <h3 className="font-semibold text-gray-300 mb-4">Analysis Result</h3>
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
              <p>Upload audio to see the analysis</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
