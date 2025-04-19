import { Scan } from "lucide-react";

export const API_BASE_URL = "http://localhost:8000";

interface ApiResponse {
  response: string;
}

// filepath: /Users/sanjanathyady/Desktop/AiBB/frontend/src/lib/api.ts
export async function generateResponse(prompt: string, deepthink: boolean): Promise<ApiResponse> {
    const endpoint = deepthink ? "analyze-tool" : "generate";
    const body = deepthink
        ? { tool_output: prompt, tool_name: "custom-tool", temperature: 0.7, max_tokens: 800 }
        : { prompt };

    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
    }

    return response.json();
}