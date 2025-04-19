export const API_BASE_URL = "http://localhost:8000";

interface ApiResponse {
  response: string;
}

export async function generateResponse(prompt: string): Promise<ApiResponse> {
  const response = await fetch(`${API_BASE_URL}/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }

  return response.json();
}