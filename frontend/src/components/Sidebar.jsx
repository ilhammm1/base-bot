import React from 'react'

export default function Sidebar({ tabs, activeTab, onTabChange, isOpen, onToggle }) {
  return (
    <aside className={`fixed left-0 top-0 h-full bg-dark-900/90 backdrop-blur-xl border-r border-dark-700/50 transition-all duration-300 z-50 flex flex-col ${isOpen ? 'w-64' : 'w-16'}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-dark-700/50">
        {isOpen && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-mimo-500 to-orange-500 flex items-center justify-center font-bold text-sm">
              M
            </div>
            <span className="font-bold text-lg gradient-text">MiMo AI</span>
          </div>
        )}
        <button
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-dark-700 transition-colors text-gray-400 hover:text-white"
        >
          {isOpen ? '◀' : '▶'}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
              ${activeTab === tab.id
                ? 'bg-gradient-to-r from-mimo-500/20 to-orange-500/10 text-mimo-400 border border-mimo-500/20'
                : 'text-gray-400 hover:text-white hover:bg-dark-800'
              }`}
            title={tab.label}
          >
            <span className="text-lg flex-shrink-0">{tab.icon}</span>
            {isOpen && <span className="text-sm font-medium truncate">{tab.label}</span>}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-dark-700/50">
        {isOpen ? (
          <div className="text-xs text-gray-500 text-center">
            Powered by <span className="gradient-text font-semibold">MiMo V2.5</span>
          </div>
        ) : (
          <div className="w-8 h-8 mx-auto rounded-full bg-gradient-to-br from-mimo-500/20 to-orange-500/20 flex items-center justify-center">
            <span className="text-mimo-400 text-xs">AI</span>
          </div>
        )}
      </div>
    </aside>
  )
}
