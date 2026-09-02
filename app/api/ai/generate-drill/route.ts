import { NextRequest, NextResponse } from "next/server";
import { SYSTEM_PROMPT, buildUserPrompt, GEMINI_MODEL } from "@/lib/gemini";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const { stats, weakAreas } = await req.json();
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Missing GEMINI_API_KEY" }, { status: 500 });
    }
    const prompt = buildUserPrompt(stats, weakAreas || ["T20 grouping"]);
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: `${SYSTEM_PROMPT}\n\n${prompt}` }] }], generationConfig: { temperature: 0.7, maxOutputTokens: 1024, responseMimeType: "application/json" } }),
    });
    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error("Empty AI response");
    const drill = JSON.parse(text);
    return NextResponse.json({ drill, raw: text });
  } catch (e: any) {
    console.error("[TRINITY AI ERROR]", e);
    return NextResponse.json({ error: e.message || "AI error" }, { status: 500 });
  }
}
