// Use this full block to replace the content of app/api/generate/route.ts

import { GoogleGenAI } from "@google/genai";
import { DR_SHEETS_PROMPT } from '../../../constants';
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from 'next/server';

// Initialize Upstash Redis and the rate limiter
const redis = Redis.fromEnv();
const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(10, "1 d"), // 10 requests per 1 day
  analytics: true,
});

export async function POST(request: NextRequest) {
  // 1. Get the user's IP address
  const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1';

  // 2. Check the rate limit
  const { success, limit, remaining, reset } = await ratelimit.limit(ip);

  if (!success) {
    return NextResponse.json(
      { error: "You have reached your daily limit. Please try again tomorrow." },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString(),
        },
      }
    );
  }

  // If rate limit is not exceeded, proceed with the original logic
  const { userRequest, brokenFormula } = await request.json();
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 });
  }

  const fullPrompt = `
    Here is the user's request:
    **Goal/Problem:**
    ${userRequest}
    **Existing (broken) Formula (if any):**
    ${brokenFormula || 'None provided.'}
  `;

  try {
    // THIS ENTIRE BLOCK IS NOW CORRECTED TO USE THE MODERN API
    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
        systemInstruction: {
          role: "model",
          parts: [{ text: DR_SHEETS_PROMPT }],
        },
    });

    // The way to get the text response is also different in the new API
    const responseText = response.text;

    return NextResponse.json(
        { text: responseText },
        {
          status: 200,
          headers: {
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': reset.toString(),
          },
        }
    );

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return NextResponse.json({ error: "Failed to get a solution from the AI model." }, { status: 500 });
  }
}