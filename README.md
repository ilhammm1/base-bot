# MiMo Multi-Modal AI Platform

> A comprehensive, production-ready AI platform built on **Xiaomi MiMo V2.5** — integrating all four flagship models (Pro, V2.5, TTS, VoiceClone) into a unified, full-stack application with 10 API endpoints and 7 interactive features.

![MiMo Platform](https://img.shields.io/badge/Xiaomi-MiMo%20V2.5-orange?style=for-the-badge)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-green?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

---

## Overview

This platform demonstrates the full capabilities of the **Xiaomi MiMo V2.5 model family** through a modern, multi-modal AI application. It integrates:

| Model | Capability | Use Case |
|-------|-----------|----------|
| **MiMo-V2.5-Pro** | Flagship reasoning (1M context) | Chat, Code Generation, Translation, Summarization |
| **MiMo-V2.5** | Multi-modal understanding | Image Analysis, Audio Transcription |
| **MiMo-V2.5-TTS** | Text-to-Speech synthesis | Natural speech generation with multiple voices |
| **MiMo-V2.5-TTS-VoiceClone** | Voice cloning | Replicate any voice from audio samples |

---

## Features

### 1. AI Chat (`/api/chat/`)
- Full conversational AI powered by **MiMo-V2.5-Pro**
- 1M token context window for long conversations
- Real-time streaming support (SSE)
- Token usage tracking per message

### 2. Image Analysis (`/api/multimodal/analyze-image`)
- Upload and analyze any image using **MiMo-V2.5** vision encoder
- Custom analysis prompts (describe, OCR, Q&A, etc.)
- Drag-and-drop interface with image preview

### 3. Audio Analysis (`/api/multimodal/analyze-audio`)
- Transcribe and understand audio with **MiMo-V2.5** native audio encoder
- Supports WAV, MP3, OGG, FLAC formats
- Built-in audio player for uploaded files

### 4. Code Assistant (`/api/code/generate`, `/api/code/review`, `/api/code/explain`)
- **Generate**: Create production-ready code in 14+ languages
- **Review**: Identify bugs, security issues, and performance problems
- **Explain**: Get detailed explanations of any code snippet
- Powered by MiMo-V2.5-Pro's frontier-level reasoning

### 5. Text-to-Speech (`/api/speech/tts`)
- Natural speech synthesis via **MiMo-V2.5-TTS**
- 6 built-in voices: alloy, echo, fable, onyx, nova, shimmer
- Adjustable speed (0.25x — 4x)
- Downloadable audio output

### 6. Voice Cloning (`/api/speech/voice-clone`)
- Clone any voice from a short audio sample using **MiMo-V2.5-TTS-VoiceClone**
- Generate speech in the cloned voice
- Reference audio upload with preview

### 7. Translation (`/api/tools/translate`)
- Professional translation across 15+ languages
- Auto-detect source language
- Powered by MiMo-V2.5-Pro reasoning capabilities

### 8. Summarization (`/api/tools/summarize`)
- Intelligent text summarization
- Three styles: Concise, Detailed, Bullet Points
- Token usage display

---

## Architecture

```
┌─────────────────────────────────────────────┐
│              React Frontend                  │
│  (Vite + TailwindCSS + React 18)            │
│                                              │
│  Dashboard │ Chat │ Image │ Audio │ Code     │
│  TTS │ Translate │ Summarize                 │
└────────────────┬────────────────────────────┘
                 │  HTTP / SSE
┌────────────────┴────────────────────────────┐
│            FastAPI Backend                    │
│                                              │
│  /api/chat/        → MiMo-V2.5-Pro          │
│  /api/multimodal/  → MiMo-V2.5              │
│  /api/code/        → MiMo-V2.5-Pro          │
│  /api/speech/      → MiMo-V2.5-TTS/Clone    │
│  /api/tools/       → MiMo-V2.5-Pro          │
└────────────────┬────────────────────────────┘
                 │  OpenAI-compatible API
┌────────────────┴────────────────────────────┐
│         Xiaomi MiMo API Platform             │
│  https://api.xiaomimimo.com/v1               │
│                                              │
│  MiMo-V2.5-Pro    │ MiMo-V2.5              │
│  MiMo-V2.5-TTS    │ MiMo-V2.5-TTS-VC      │
└─────────────────────────────────────────────┘
```

---

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- MiMo API Key (from [platform.xiaomimimo.com](https://platform.xiaomimimo.com))

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or: venv\Scripts\activate  # Windows

# Install dependencies
pip install -e .

# Configure environment
cp .env.example .env
# Edit .env and add your MIMO_API_KEY

# Run the server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

### Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Docs (Swagger)**: http://localhost:8000/docs
- **API Docs (ReDoc)**: http://localhost:8000/redoc

---

## API Reference

### Chat

```bash
curl -X POST http://localhost:8000/api/chat/ \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "Hello!"}],
    "model": "MiMo-V2.5-Pro",
    "temperature": 0.7,
    "max_tokens": 4096
  }'
```

### Image Analysis

```bash
curl -X POST http://localhost:8000/api/multimodal/analyze-image \
  -F "file=@image.png" \
  -F "prompt=What is in this image?"
```

### Code Generation

```bash
curl -X POST http://localhost:8000/api/code/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Create a binary search function",
    "language": "python"
  }'
```

### Text-to-Speech

```bash
curl -X POST http://localhost:8000/api/speech/tts \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello, world!", "voice": "alloy"}' \
  --output speech.mp3
```

### Translation

```bash
curl -X POST http://localhost:8000/api/tools/translate \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello, how are you?",
    "target_lang": "zh"
  }'
```

---

## Token Usage Estimation

This platform is designed for **heavy, production-level API usage** across all four MiMo models:

| Feature | Estimated Tokens/Request | Daily Usage (Active) |
|---------|------------------------|---------------------|
| AI Chat | 500 — 8,000 | 50,000 — 400,000 |
| Image Analysis | 1,000 — 4,000 | 20,000 — 80,000 |
| Audio Analysis | 500 — 3,000 | 10,000 — 60,000 |
| Code Generation | 2,000 — 16,000 | 100,000 — 800,000 |
| Code Review | 2,000 — 12,000 | 50,000 — 300,000 |
| TTS | 200 — 2,000 | 10,000 — 100,000 |
| Translation | 200 — 4,000 | 10,000 — 200,000 |
| Summarization | 500 — 4,000 | 25,000 — 200,000 |
| **Total** | | **275,000 — 2,140,000/day** |

**Projected Monthly Usage: 8M — 64M+ tokens**

---

## Technology Stack

- **Frontend**: React 18, Vite, TailwindCSS, React Markdown
- **Backend**: FastAPI, Uvicorn, OpenAI Python SDK, Pydantic
- **AI Models**: Xiaomi MiMo V2.5-Pro, V2.5, V2.5-TTS, V2.5-TTS-VoiceClone
- **API Protocol**: OpenAI-compatible REST API + SSE streaming

---

## Project Structure

```
mimo-multimodal-platform/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── config.py          # Environment configuration
│   │   ├── main.py            # FastAPI application
│   │   ├── mimo_client.py     # MiMo API client
│   │   ├── models.py          # Pydantic models
│   │   └── routes/
│   │       ├── chat.py        # Chat endpoints
│   │       ├── code.py        # Code assistant endpoints
│   │       ├── multimodal.py  # Image/audio analysis
│   │       ├── speech.py      # TTS & voice cloning
│   │       └── tools.py       # Translation & summarization
│   ├── .env.example
│   └── pyproject.toml
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AudioAnalysis.jsx
│   │   │   ├── ChatPanel.jsx
│   │   │   ├── CodeAssistant.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ImageAnalysis.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── SummarizeTool.jsx
│   │   │   ├── TextToSpeech.jsx
│   │   │   └── TranslateTool.jsx
│   │   ├── api.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── docker-compose.yml
├── LICENSE
└── README.md
```

---

## Deployment

### Docker

```bash
docker-compose up --build
```

### Manual

```bash
# Backend
cd backend && pip install -e . && uvicorn app.main:app --host 0.0.0.0 --port 8000

# Frontend
cd frontend && npm install && npm run build
# Serve the dist/ folder with any static file server
```

---

## Contributing

Contributions are welcome! Please read the contributing guidelines and submit pull requests.

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

## Acknowledgments

- [Xiaomi MiMo](https://mimo.xiaomi.com/) — for the groundbreaking MiMo V2.5 model family
- [MiMo API Platform](https://platform.xiaomimimo.com/) — for the OpenAI-compatible API service
- Built with [FastAPI](https://fastapi.tiangolo.com/), [React](https://react.dev/), [Vite](https://vitejs.dev/), and [TailwindCSS](https://tailwindcss.com/)
