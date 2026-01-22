import { GoogleGenAI } from "@google/genai";
import { THAY_HOANG_SYSTEM_PROMPT } from "../constants";

export const generateExamContent = async (apiKey: string, topic: string, grade: string): Promise<string> => {
  if (!apiKey) throw new Error("API Key is required");

  const ai = new GoogleGenAI({ apiKey });

  // Use the Flash 3 preview model for capacity to handle long contexts and instructions
  const modelId = "gemini-3-flash-preview"; 

  const fullPrompt = `${THAY_HOANG_SYSTEM_PROMPT} "${topic}" (Lớp ${grade}).`;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: fullPrompt,
      config: {
        temperature: 0.7,
        maxOutputTokens: 8192, // Ensure enough length for all 5 parts
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("Không nhận được phản hồi từ Thầy Hoàng.");
    }
    
    // We return the raw text because it contains multiple formatted parts (HTML & CSV)
    // The component will parse this based on the "**PHẦN X" delimiters.
    return text;
  } catch (error: any) {
    console.error("GenAI Error:", error);
    throw new Error(error.message || "Đã có lỗi xảy ra khi tạo đề thi.");
  }
};