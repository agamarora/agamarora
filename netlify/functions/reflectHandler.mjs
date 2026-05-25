// reflectHandler.mjs
//
// Copyright (c) 2026 Agam Arora. All rights reserved.
// Licensed under CC BY-NC-ND 4.0.
//
// /lab/type/ backend — one-shot crystallization analyzer.
//
// POST /.netlify/functions/reflectHandler
//   body: { text: string, wpm: number, duration_s: number }
//   returns: { crystallization_word, crystallization_quote, prompt_match, reflection }
//
// Model: llama-3.3-70b-versatile with response_format: json_object (verified 2026-05-25).
// Defense: reuses isInjectionAttempt from lib/defense.mjs. Injection detected → fallback.
// All response fields type-guarded server-side.

import Groq from 'groq-sdk';
import { isInjectionAttempt } from './lib/defense.mjs';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const MODEL = 'llama-3.3-70b-versatile';
const MAX_USER_TEXT = 500;
const GROQ_TIMEOUT_MS = 7000;

const ALLOWED_ORIGINS = new Set([
  'https://agamarora.com',
  'https://www.agamarora.com',
  'http://localhost:8888',
  'http://127.0.0.1:8888',
]);

const FALLBACK = {
  crystallization_word: null,
  crystallized_thought: null,
  prompt_match: 'none',
  reflection: null,
};

function corsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.has(origin);
  return {
    'Access-Control-Allow-Origin': allowed ? origin : '',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };
}

function sanitize(text) {
  return String(text || '')
    .slice(0, MAX_USER_TEXT)
    .replace(/```/g, '')
    .replace(/"""/g, '')
    .trim();
}

function buildPrompt(text, wpm, backspaceCount) {
  const backspaceLine = backspaceCount > 0
    ? `They used backspace ${backspaceCount} time${backspaceCount === 1 ? '' : 's'} (typos + edits welcome).`
    : `They used backspace 0 times (clean run).`;
  return `A person typed the following text in a 60-second flow-typing experiment. Their WPM was ${wpm}. ${backspaceLine}

TEXT:
"""
${text}
"""

Identify the single word where the writer's thought clearly crystallized — where they stopped warming up and the real idea emerged. Prefer a content-bearing word (noun, verb, adjective, or emotion) over function words like "why", "which", "is", "the". The word MUST appear verbatim in the text (we use it to locate the timestamp). If the text was a steady, consistent flow with no single crystallization moment, return null for crystallization_word.

Then write a clean, polished one-sentence rephrasing of what the writer was actually saying at that crystallization moment. Fix typos, smooth grammar, drop filler. Keep it under 14 words, present-tense, first-person where the original is. Return this as crystallized_thought. This is OUR articulation of the writer's thought — not a verbatim quote.

Also identify which of these 2 starter prompts they were most likely responding to (or "none" if they wrote free-form or ignored both):
1. "The thing I keep putting off is..."
2. "Honestly I'm a little..."

Only return 1 or 2 if the writer's text clearly extends one of those starters (echoes the structure or directly continues the thought). Otherwise return "none".

Return ONLY a JSON object:
{
  "crystallization_word": "fear" | null,
  "crystallized_thought": "I'm scared the demo will look like a failure." | null,
  "prompt_match": 1 | 2 | "none",
  "reflection": "One sentence about what the writer revealed. Reference their actual words. Max 20 words."
}`;
}

function guardResponse(parsed) {
  const cw = typeof parsed?.crystallization_word === 'string' && parsed.crystallization_word.trim().length > 0
    ? parsed.crystallization_word.trim().slice(0, 60)
    : null;
  // Accept new key crystallized_thought OR legacy crystallization_quote as fallback.
  const ctRaw = parsed?.crystallized_thought ?? parsed?.crystallization_quote;
  const ct = typeof ctRaw === 'string' && ctRaw.trim().length > 0
    ? ctRaw.trim().slice(0, 200)
    : null;
  const pm = [1, 2].includes(parsed?.prompt_match) ? parsed.prompt_match : 'none';
  const rf = typeof parsed?.reflection === 'string' && parsed.reflection.trim().length > 0
    ? parsed.reflection.trim().slice(0, 240)
    : null;
  return { crystallization_word: cw, crystallized_thought: ct, prompt_match: pm, reflection: rf };
}

export default async (req) => {
  const origin = req.headers.get('origin') || '';
  const headers = corsHeaders(origin);

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'method not allowed' }), { status: 405, headers });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'invalid json' }), { status: 400, headers });
  }

  const text = sanitize(body?.text);
  const wpm = Number.isFinite(Number(body?.wpm)) ? Math.max(0, Math.min(500, Number(body.wpm))) : 0;

  if (text.length < 10) {
    return new Response(JSON.stringify(FALLBACK), { status: 200, headers });
  }

  if (isInjectionAttempt(text)) {
    console.log('[reflect] injection_blocked', { len: text.length });
    return new Response(JSON.stringify(FALLBACK), { status: 200, headers });
  }

  const prompt = buildPrompt(text, wpm);
  const ctrl = new AbortController();
  const tid = setTimeout(() => ctrl.abort(), GROQ_TIMEOUT_MS);

  try {
    const completion = await groq.chat.completions.create(
      {
        model: MODEL,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 240,
        temperature: 0.6,
        response_format: { type: 'json_object' },
      },
      { signal: ctrl.signal },
    );
    clearTimeout(tid);

    const raw = completion?.choices?.[0]?.message?.content;
    if (typeof raw !== 'string' || raw.trim().length === 0) {
      console.warn('[reflect] empty_groq_content');
      return new Response(JSON.stringify(FALLBACK), { status: 200, headers });
    }

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      console.warn('[reflect] json_parse_fail', { err: err?.message });
      return new Response(JSON.stringify(FALLBACK), { status: 200, headers });
    }

    const guarded = guardResponse(parsed);
    return new Response(JSON.stringify(guarded), { status: 200, headers });
  } catch (err) {
    clearTimeout(tid);
    console.warn('[reflect] groq_call_failed', { err: err?.message || String(err) });
    return new Response(JSON.stringify(FALLBACK), { status: 200, headers });
  }
};
