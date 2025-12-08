import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";

// Gemini API key comes from Vite environment variable
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Debug: Check if API key exists
if (!API_KEY) {
  console.error('❌ GEMINI_API_KEY is missing! Add it to .env.local');
}

const genAI = new GoogleGenerativeAI(API_KEY);

// --- MODEL CONFIG ---
// Allow override via env; default to a stable, GA-supported model for v1beta.
const DEFAULT_MODEL = "gemini-1.5-flash";
const MODEL_NAME = (import.meta.env.VITE_GEMINI_MODEL as string | undefined)?.trim() || DEFAULT_MODEL;

// Keep replies direct, concise, and travel-focused.
const systemInstruction = {
  role: "system",
  parts: [
    {
      text:
        "You are Yatra Sahayak, an Indian travel assistant. Answer the user's question directly and succinctly in the language they used (English or Hindi). Provide clear, actionable travel guidance and avoid long introductions.",
    },
  ],
};

console.info(`[Gemini] Using model: ${MODEL_NAME}`);
const model = genAI.getGenerativeModel({
  model: MODEL_NAME,
  systemInstruction,
});

// --- SAFETY SETTINGS (optional but recommended) ---
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
];

// ----------------------------------------------
// 1️⃣ FUNCTION → Chatbot reply for Assistant.jsx
// ----------------------------------------------
export async function getChatResponse(history: any[], userInput: string) {
  try {
    if (!API_KEY) {
      return "Gemini API key is missing. Please add VITE_GEMINI_API_KEY to your environment.";
    }

    const formattedHistory = history
      .filter(msg => Boolean(msg?.text))
      .map(msg => ({
        role: msg.role === "model" ? "model" : "user",
        parts: [{ text: msg.text }],
      }));

    if (formattedHistory[0]?.role === "model") {
      formattedHistory.shift();
    }

    const chatSession = model.startChat({
      safetySettings,
      history: formattedHistory,
    });

    const result = await chatSession.sendMessage(userInput || "");
    return result.response.text();

  } catch (error) {
    console.error("Gemini chat error:", error);
    const message = error?.message || "";
    if (message.includes("404") || message.includes("not found")) {
      return "Gemini model unavailable. Please verify the model name and try again.";
    }
    return "Sorry, I couldn't process that. Please try again.";
  }
}

// -----------------------------------------------------
// 2️⃣ FUNCTION → Festival Insight for Festivals.jsx
// -----------------------------------------------------
export async function getFestivalDetails(festivalName: string) {
  try {
    const prompt = `Explain the cultural, historical, and tourism significance of the Indian festival "${festivalName}". 
Make it short, helpful, and easy to understand for travelers.`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      safetySettings,
    });

    return result.response.text();

  } catch (error) {
    console.error("Festival fetch error:", error);
    return "Sorry, unable to fetch festival details.";
  }
}

export async function getSustainableRouteOptions(from: string, to: string) {
  try {
    const prompt = `Suggest 3-5 sustainable, eco-friendly travel options for going from "${from}" to "${to}" in India. For each, provide: name, short route, a one-sentence description, and top eco-friendly tips. Respond in markdown table format or as a short structured list.`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      safetySettings,
    });

    return result.response.text();

  } catch (error) {
    console.error("Eco route fetch error:", error);
    return "Sorry, unable to fetch sustainable route options.";
  }
}

