const API_BASE = '/api';

export async function sendChat(messages, model = 'MiMo-V2.5-Pro', options = {}) {
  const res = await fetch(`${API_BASE}/chat/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages,
      model,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 4096,
      stream: false,
    }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function analyzeImage(file, prompt = 'Describe this image in detail.') {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('prompt', prompt);

  const res = await fetch(`${API_BASE}/multimodal/analyze-image`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function analyzeAudio(file, prompt = 'Transcribe and describe this audio.') {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('prompt', prompt);

  const res = await fetch(`${API_BASE}/multimodal/analyze-audio`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function generateCode(prompt, language = 'python') {
  const res = await fetch(`${API_BASE}/code/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, language }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function reviewCode(code, language = 'python') {
  const res = await fetch(`${API_BASE}/code/review`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: code, language }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function explainCode(code, language = 'python') {
  const res = await fetch(`${API_BASE}/code/explain`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: code, language }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function textToSpeech(text, voice = 'alloy', speed = 1.0) {
  const res = await fetch(`${API_BASE}/speech/tts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, voice, speed }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.blob();
}

export async function cloneVoice(text, referenceAudio) {
  const formData = new FormData();
  formData.append('text', text);
  formData.append('reference_audio', referenceAudio);

  const res = await fetch(`${API_BASE}/speech/voice-clone`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.blob();
}

export async function translateText(text, targetLang, sourceLang = 'auto') {
  const res = await fetch(`${API_BASE}/tools/translate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, target_lang: targetLang, source_lang: sourceLang }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function summarizeText(text, style = 'concise') {
  const res = await fetch(`${API_BASE}/tools/summarize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, style }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
