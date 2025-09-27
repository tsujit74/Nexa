import { GoogleGenerativeAI } from "@google/generative-ai";

const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export interface ContextTurn {
  user: string;
  ai: string;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const generateAIContent = async (
  context: ContextTurn[],
  newMessage: string,
  mode: "default" | "short" | "professional" = "default"
): Promise<string> => {
  const systemPrompt =
    mode === "short"
      ? "You are a social media assistant. Respond in short, catchy sentences."
      : mode === "professional"
      ? "You are a social media assistant. Respond in a professional business tone."
      : "You are a helpful social media assistant.";

  const fullPrompt =
    systemPrompt +
    "\n\nConversation:\n" +
    context.map((turn) => `User: ${turn.user}\nAI: ${turn.ai}`).join("\n") +
    `\nUser: ${newMessage}\n`;

  const model = client.getGenerativeModel({
    model: "gemini-1.5-flash-latest",
  });

  const maxRetries = 3;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 200,
        },
      });

      return result.response.text() || "No response";
    } catch (err: any) {
      console.error(`Gemini API error (attempt ${attempt}):`, err);

      if (attempt < maxRetries) {
        await sleep(2000); 
        continue;
      }
      return "Sorry, an error occurred while generating the response.";
    }
  }

  return "Sorry, an unexpected error occurred.";
};
