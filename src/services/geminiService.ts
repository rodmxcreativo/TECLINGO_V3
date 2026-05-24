/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

export async function getAIInsight(context: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Based on this English training dashboard context: "${context}", generate a single, professional, brief actionable insight for a language school director. 
      Format: "Insight: [Brief actionable suggestion]". 
      Keep it high-level and strategic.`,
    });

    return response.text?.replace('Insight: ', '') || "Monitor current A1 progress closely.";
  } catch (error) {
    console.error("AI Insight failed:", error);
    return "Activation suggested for Speaking modules in Group A1-104.";
  }
}
