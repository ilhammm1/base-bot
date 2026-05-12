import React, { useState, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import { analyzeImage } from '../api'

export default function ImageAnalysis() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [prompt, setPrompt] = useState('Describe this image in detail.')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const fileRef = useRef()

  const handleFileChange = (e) => {
    const selected = e.target.files[0]
    if (selected) {
      setFile(selected)
      setPreview(URL.createObjectURL(selected))
      setResult(null)
      setError(null)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const dropped = e.dataTransfer.files[0]
    if (dropped && dropped.type.startsWith('image/')) {
      setFile(dropped)
      setPreview(URL.createObjectURL(dropped))
      setResult(null)
      setError(null)
    }
  }

  const handleAnalyze = async () => {
    if (!file) return
    setLoading(true)
    setError(null)

    try {
      const res = await analyzeImage(file, prompt)
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
        <h2 className="text-2xl font-bold mb-2">Image Analysis</h2>
        <p className="text-gray-400">Upload an image for AI-powered analysis using MiMo-V2.5</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload */}
        <div className="space-y-4">
          <div
            onClick={() => fileRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="glass-card-hover p-8 text-center cursor-pointer min-h-[300px] flex flex-col items-center justify-center"
          >
            {preview ? (
              <img src={preview} alt="Preview" className="max-h-64 rounded-lg object-contain" />
            ) : (
              <>
                <div className="text-5xl mb-4">🖼️</div>
                <p className="text-gray-400 mb-2">Click or drop an image here</p>
                <p className="text-xs text-gray-600">Supports PNG, JPG, GIF, WebP</p>
              </>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="What would you like to know about this image?"
            className="textarea-field"
            rows={3}
          />

          <button
            onClick={handleAnalyze}
            disabled={!file || loading}
            className="btn-primary w-full"
          >
            {loading ? 'Analyzing...' : 'Analyze Image'}
          </button>
        </div>

        {/* Result */}
        <div className="glass-card p-6 min-h-[300px]">
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
              <p>Upload an image to see the analysis</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
