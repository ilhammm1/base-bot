import React from 'react'

const FEATURES = [
  {
    id: 'chat',
    icon: '💬',
    title: 'AI Chat',
    description: 'Conversational AI powered by MiMo-V2.5-Pro with 1M context window',
    model: 'MiMo-V2.5-Pro',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'image',
    icon: '🖼️',
    title: 'Image Analysis',
    description: 'Understand and analyze images with MiMo-V2.5 multi-modal vision',
    model: 'MiMo-V2.5',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    id: 'audio',
    icon: '🎵',
    title: 'Audio Analysis',
    description: 'Transcribe and understand audio content with native audio encoder',
    model: 'MiMo-V2.5',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    id: 'code',
    icon: '💻',
    title: 'Code Assistant',
    description: 'Generate, review, and explain code with frontier-level reasoning',
    model: 'MiMo-V2.5-Pro',
    gradient: 'from-mimo-500 to-orange-500',
  },
  {
    id: 'tts',
    icon: '🔊',
    title: 'Text to Speech',
    description: 'Natural speech synthesis and voice cloning capabilities',
    model: 'MiMo-V2.5-TTS',
    gradient: 'from-red-500 to-rose-500',
  },
  {
    id: 'translate',
    icon: '🌐',
    title: 'Translation',
    description: 'Professional multi-language translation powered by reasoning',
    model: 'MiMo-V2.5-Pro',
    gradient: 'from-indigo-500 to-violet-500',
  },
  {
    id: 'summarize',
    icon: '📝',
    title: 'Summarization',
    description: 'Intelligent text summarization in multiple styles',
    model: 'MiMo-V2.5-Pro',
    gradient: 'from-amber-500 to-yellow-500',
  },
]

const STATS = [
  { label: 'Models Integrated', value: '4', detail: 'Pro, V2.5, TTS, VoiceClone' },
  { label: 'Context Window', value: '1M', detail: 'tokens supported' },
  { label: 'API Endpoints', value: '10', detail: 'fully functional' },
  { label: 'Modalities', value: '4', detail: 'Text, Image, Audio, Speech' },
]

export default function Dashboard({ onNavigate }) {
  return (
    <div className="min-h-screen p-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-mimo-500/10 border border-mimo-500/20 text-mimo-400 text-sm font-medium mb-6">
          <span className="w-2 h-2 rounded-full bg-mimo-400 animate-pulse" />
          Powered by Xiaomi MiMo V2.5
        </div>
        <h1 className="text-5xl font-bold mb-4">
          <span className="gradient-text">Multi-Modal AI</span> Platform
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          A comprehensive AI platform leveraging all Xiaomi MiMo V2.5 models — 
          from flagship reasoning to multi-modal understanding, speech synthesis, and voice cloning.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 max-w-4xl mx-auto">
        {STATS.map((stat, i) => (
          <div key={i} className="glass-card p-5 text-center">
            <div className="text-3xl font-bold gradient-text mb-1">{stat.value}</div>
            <div className="text-sm font-medium text-gray-300">{stat.label}</div>
            <div className="text-xs text-gray-500 mt-1">{stat.detail}</div>
          </div>
        ))}
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {FEATURES.map((feature) => (
          <button
            key={feature.id}
            onClick={() => onNavigate(feature.id)}
            className="glass-card-hover p-6 text-left group"
          >
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} bg-opacity-20 text-2xl mb-4`}>
              {feature.icon}
            </div>
            <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-mimo-400 transition-colors">
              {feature.title}
            </h3>
            <p className="text-sm text-gray-400 mb-3">{feature.description}</p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-dark-800 text-xs text-gray-400">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
              {feature.model}
            </div>
          </button>
        ))}
      </div>

      {/* Architecture Section */}
      <div className="mt-16 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">
          <span className="gradient-text">Architecture Overview</span>
        </h2>
        <div className="glass-card p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-3">⚛️</div>
              <h4 className="font-semibold text-white mb-2">React Frontend</h4>
              <p className="text-sm text-gray-400">Modern UI with Vite, TailwindCSS, and responsive design</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">⚡</div>
              <h4 className="font-semibold text-white mb-2">FastAPI Backend</h4>
              <p className="text-sm text-gray-400">High-performance async Python API with OpenAI-compatible client</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">🤖</div>
              <h4 className="font-semibold text-white mb-2">MiMo V2.5 Models</h4>
              <p className="text-sm text-gray-400">Full integration with Pro, V2.5, TTS, and VoiceClone models</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
