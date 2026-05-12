import React, { useState } from 'react'
import Sidebar from './components/Sidebar'
import ChatPanel from './components/ChatPanel'
import ImageAnalysis from './components/ImageAnalysis'
import AudioAnalysis from './components/AudioAnalysis'
import CodeAssistant from './components/CodeAssistant'
import TextToSpeech from './components/TextToSpeech'
import TranslateTool from './components/TranslateTool'
import SummarizeTool from './components/SummarizeTool'
import Dashboard from './components/Dashboard'

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
  { id: 'chat', label: 'AI Chat', icon: '💬' },
  { id: 'image', label: 'Image Analysis', icon: '🖼️' },
  { id: 'audio', label: 'Audio Analysis', icon: '🎵' },
  { id: 'code', label: 'Code Assistant', icon: '💻' },
  { id: 'tts', label: 'Text to Speech', icon: '🔊' },
  { id: 'translate', label: 'Translate', icon: '🌐' },
  { id: 'summarize', label: 'Summarize', icon: '📝' },
]

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const renderPanel = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard onNavigate={setActiveTab} />
      case 'chat': return <ChatPanel />
      case 'image': return <ImageAnalysis />
      case 'audio': return <AudioAnalysis />
      case 'code': return <CodeAssistant />
      case 'tts': return <TextToSpeech />
      case 'translate': return <TranslateTool />
      case 'summarize': return <SummarizeTool />
      default: return <Dashboard onNavigate={setActiveTab} />
    }
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      <main className={`flex-1 overflow-auto transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        {renderPanel()}
      </main>
    </div>
  )
}
