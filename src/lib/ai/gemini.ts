import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GOOGLE_GEMINI_API_KEY is not set in environment variables.");
}

export const gemini = new GoogleGenAI({ apiKey });

export const GEMINI_MODEL = "gemini-flash-latest";
