import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';

// Initialize Gemini client safely (server-side only)
// Note: If GEMINI_API_KEY is not set, we'll return a graceful mock response.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'mock-key' });

const requestSchema = z.object({
  prompt: z.string().min(1).max(500),
});

const SYSTEM_INSTRUCTION = `You are SmartCrowd AI, an assistant for stadium crowd management. 
You provide concise, professional, and actionable advice to stadium operators regarding crowd density, gate waiting times, and security. 
Do NOT answer questions unrelated to stadium management, crowds, or events. If asked about an unrelated topic, reply with: "I can only assist with stadium and crowd management queries."`;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 1. Input Validation and Sanitization (using zod)
    const result = requestSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: 'Invalid prompt provided.' }, { status: 400 });
    }

    const userPrompt = result.data.prompt;

    // 2. Check for missing API Key and return mock if needed
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      // Return a simulated AI response for prototyping
      return NextResponse.json({ 
        response: `[Simulated AI]: Based on the current crowd metrics, I recommend opening two additional lanes at Gate A to alleviate the 15-minute wait time. (Please configure GEMINI_API_KEY for real responses.)`
      });
    }

    // 3. Safe API Call to Gemini with guardrails
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.3, // Lower temperature for more factual, focused responses
      }
    });

    return NextResponse.json({ response: response.text });
  } catch (error) {
    console.error('AI Error:', error);
    return NextResponse.json({ error: 'Failed to generate AI response.' }, { status: 500 });
  }
}
