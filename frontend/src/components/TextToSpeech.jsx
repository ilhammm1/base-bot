import React, { useState, useRef } from 'react'
import { textToSpeech, cloneVoice } from '../api'

const VOICES = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer']

export default function TextToSpeech() {
  const [text, setText] = useState('')
  const [voice, setVoice] = useState('alloy')
  const [speed, setSpeed] = useState(1.0)
  const [mode, setMode] = useState('tts')
  const [audioUrl, setAudioUrl] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [refFile, setRefFile] = useState(null)
  const fileRef = useRef()

  const handleGenerate = async () => {
    if (!text.trim()) return
    setLoading(true)
    setError(null)
    setAudioUrl(null)

    try {
      let blob
      if (mode === 'tts') {
        blob = await textToSpeech(text, voice, speed)
      } else {
        if (!refFile) {
          setError('Please upload a reference audio file for voice cloning')
          setLoading(false)
          return
        }
        blob = await cloneVoice(text, refFile)
      }
      const url = URL.createObjectURL(blob)
      setAudioUrl(url)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Text to Speech</h2>
        <p className="text-gray-400">Generate natural speech with MiMo-V2.5-TTS and Voice Cloning</p>
      </div>

      {/* Mode Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => { setMode('tts'); setAudioUrl(null); setError(null) }}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            mode === 'tts' ? 'bg-gradient-to-r from-mimo-500 to-orange-500 text-white' : 'bg-dark-800 text-gray-400 hover:text-white'
          }`}
        >
          🔊 Standard TTS
        </button>
        <button
          onClick={() => { setMode('clone'); setAudioUrl(null); setError(null) }}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            mode === 'clone' ? 'bg-gradient-to-r from-mimo-500 to-orange-500 text-white' : 'bg-dark-800 text-gray-400 hover:text-white'
          }`}
        >
          🎭 Voice Cloning
        </button>
      </div>

      <div className="glass-card p-6 space-y-6">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to convert to speech..."
          className="textarea-field"
          rows={5}
        />

        {mode === 'tts' ? (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Voice</label>
              <select
                value={voice}
                onChange={(e) => setVoice(e.target.value)}
                className="input-field"
              >
                {VOICES.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Speed: {speed}x</label>
              <input
                type="range"
                min="0.25"
                max="4"
                step="0.25"
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="w-full accent-mimo-500"
              />
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-sm text-gray-400 mb-2">Reference Audio (for voice cloning)</label>
            <div
              onClick={() => fileRef.current?.click()}
              className="glass-card-hover p-4 text-center cursor-pointer"
            >
              {refFile ? (
                <div>
                  <p className="text-gray-300">{refFile.name}</p>
                  <audio controls className="mt-2 w-full" src={URL.createObjectURL(refFile)} />
                </div>
              ) : (
                <p className="text-gray-500">Click to upload reference audio</p>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="audio/*"
              onChange={(e) => setRefFile(e.target.files[0])}
              className="hidden"
            />
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={!text.trim() || loading}
          className="btn-primary w-full"
        >
          {loading ? 'Generating...' : mode === 'tts' ? 'Generate Speech' : 'Clone & Generate'}
        </button>

        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        {audioUrl && (
          <div className="glass-card p-4">
            <h3 className="font-semibold text-gray-300 mb-3">Generated Audio</h3>
            <audio controls className="w-full" src={audioUrl} />
            <a
              href={audioUrl}
              download={mode === 'tts' ? 'speech.mp3' : 'cloned_speech.wav'}
              className="btn-secondary mt-3 inline-block text-sm"
            >
              Download Audio
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
