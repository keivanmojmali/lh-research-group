import axios from "axios";
let counter;

export async function callOpenAiApi(
  systemPrompt: string,
  finalPrompt: string,
  model: string
) {
  const API_KEY = process.env.OPENAI_API_KEY;
  const API_URL = "https://api.openai.com/v1/chat/completions";
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${API_KEY}`,
  };
  const requestBody = {
    model: model,
    messages: [
      { role: "user", name: "example_user", content: systemPrompt },
      { role: "user", content: finalPrompt },
    ],
    temperature: 0.7,
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorInfo = await response.json();
      throw new Error("API call failed: " + errorInfo.error.message);
    }

    const data = await response.json();
    return data.choices[0].message.content; // Adjust this line based on the actual response structure
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    return null;
  }
}
