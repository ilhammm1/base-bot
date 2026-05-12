---
name: testing-mimo-platform
description: Test the MiMo Multi-Modal AI Platform end-to-end. Use when verifying UI rendering, navigation, backend API, or MiMo model integrations.
---

# Testing MiMo Multi-Modal AI Platform

## Prerequisites
- Python 3.10+ for backend
- Node.js 18+ for frontend

## Devin Secrets Needed
- `MIMO_API_KEY` — Required for testing actual AI model calls. Get from https://platform.xiaomimimo.com. Without it, you can still test UI rendering, navigation, and backend health endpoints.

## Starting the Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -e .
uvicorn app.main:app --host 0.0.0.0 --port 8000
```
Verify: `curl http://localhost:8000/health` should return `{"status": "healthy"}`

## Starting the Frontend
```bash
cd frontend
npm install
npx vite --host 0.0.0.0
```
Frontend runs on http://localhost:5173 with API proxy to backend on :8000.

**Note:** Use `npx vite` instead of `npm run dev` if `vite` is not in PATH.

## UI Structure
The app has a sidebar with 8 navigation tabs:
1. **Dashboard** (default) — Stats cards (4 Models, 1M Context, 10 Endpoints, 4 Modalities), 7 feature cards, architecture overview
2. **AI Chat** — Chat interface with model selector (MiMo-V2.5-Pro / MiMo-V2.5)
3. **Image Analysis** — Drag-and-drop image upload + analysis prompt
4. **Audio Analysis** — Audio file upload + analysis prompt
5. **Code Assistant** — 3 modes (Generate/Review/Explain), 14 language dropdown
6. **Text to Speech** — Standard TTS (6 voices, speed control) / Voice Cloning tabs
7. **Translate** — Source/target language dropdowns (15+ languages)
8. **Summarize** — 3 styles (Concise/Detailed/Bullet Points)

Dashboard feature cards also navigate to their respective tabs via click.
Sidebar has a collapse/expand toggle button.

## Backend API Endpoints
Swagger docs at http://localhost:8000/docs. 10 POST + 2 GET endpoints:
- POST `/api/chat/` — Chat completion
- POST `/api/multimodal/analyze-image` — Image analysis (file upload)
- POST `/api/multimodal/analyze-audio` — Audio analysis (file upload)
- POST `/api/code/generate` — Code generation
- POST `/api/code/review` — Code review
- POST `/api/code/explain` — Code explanation
- POST `/api/speech/tts` — Text-to-speech
- POST `/api/speech/voice-clone` — Voice cloning (file upload)
- POST `/api/tools/translate` — Translation
- POST `/api/tools/summarize` — Summarization
- GET `/` — Platform info
- GET `/health` — Health check (shows if API key is configured)

## Key Testing Areas
1. **Without API key**: Dashboard rendering, all tab navigation, sidebar collapse/expand, Swagger docs, backend health
2. **With API key**: Chat responses, image/audio analysis, code generation, TTS audio output, translation, summarization

## Common Issues
- Frontend `vite: not found` — use `npx vite` instead of `npm run dev` if vite binary is not in PATH
- Backend needs `source venv/bin/activate` before running uvicorn
- CORS is configured for localhost:5173 and localhost:3000 by default
