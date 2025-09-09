import { GoogleGenerativeAI } from "@google/genai"; // CORRECTED! No typo here.
import { DR_SHEETS_PROMPT } from '../../../constants';
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { headers } from 'next/headers';

// Initialize Upstash Redis and the rate limiter
const redis = Redis.fromEnv();
const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(10, "1 d"), // 10 requests per 1 day
  analytics: true,
});

export async function POST(request: Request) {
  // 1. Get the user's IP address
  const ip = headers().get('x-forwarded-for') ?? '127.0.0.1';

  // 2. Check the rate limit
  const { success, limit, remaining, reset } = await ratelimit.limit(ip);

  if (!success) {
    return new Response(JSON.stringify({ error: "You have reached your daily limit. Please try again tomorrow." }), {
      status: 429, // "Too Many Requests"
      headers: {
        'X-RateLimit-Limit': limit.toString(),
        'X-RateLimit-Remaining': remaining.toString(),
        'X-RateLimit-Reset': reset.toString(),
      },
    });
  }

  // If rate limit is not exceeded, proceed with the original logic
  const { userRequest, brokenFormula } = await request.json();
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return new Response(JSON.stringify({ error: "API key not configured" }), { status: 500 });
  }

  const fullPrompt = `
    Here is the user's request:
    **Goal/Problem:**
    ${userRequest}
    **Existing (broken) Formula (if any):**
    ${brokenFormula || 'None provided.'}
  `;

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
      systemInstruction: {
        role: "model",
        parts: [{ text: DR_SHEETS_PROMPT }],
      },
    });

    const responseText = result.response.text();

    return new Response(JSON.stringify({ text: responseText }), {
      status: 200,
      headers: {
        'X-RateLimit-Limit': limit.toString(),
        'X-RateLimit-Remaining': remaining.toString(),
        'X-RateLimit-Reset': reset.toString(),
      },
    });

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return new Response(JSON.stringify({ error: "Failed to get a solution from the AI model." }), { status: 500 });
  }
}