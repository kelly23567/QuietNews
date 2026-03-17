// src/services/aiService.ts

const API_KEY = import.meta.env.VITE_AI_API_KEY;
const BASE_URL = 'https://api.deepseek.com/chat/completions'; // Deepseek API endpoint without /v1 sometimes works better, but standard is /chat/completions

export const generateSummary = async (content: string, title: string): Promise<string> => {
  if (!API_KEY || API_KEY === 'your_deepseek_api_key_here') {
    console.warn('No AI API key found. Returning fallback summary.');
    return "This is a placeholder summary. Please configure your VITE_AI_API_KEY in the .env file to see real AI-generated summaries.";
  }

  try {
    console.log("Sending request to DeepSeek API...", { title, contentLength: content?.length });
    
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that summarizes news articles concisely. Summarize the provided news in 2-3 sentences. Output ONLY the summary text, without any introductory phrases like 'Here is the summary'."
          },
          {
            role: "user",
            content: `Title: ${title}\n\nContent: ${content}\n\nPlease summarize this.`
          }
        ],
        temperature: 0.7,
        max_tokens: 150
      })
    });

    if (!response.ok) {
      // Capture detailed error info from DeepSeek
      const errorText = await response.text();
      console.error(`DeepSeek API Error: Status ${response.status}`, errorText);
      
      // Handle specific known errors for better UI feedback
      if (response.status === 402 || errorText.includes('Insufficient Balance')) {
        throw new Error("API 账户余额不足 (Insufficient Balance)。请前往 DeepSeek 控制台充值。");
      }
      
      throw new Error(`API Error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log("DeepSeek API Response received successfully.");
    return data.choices[0].message.content.trim();

  } catch (error) {
    console.error('Detailed error generating summary:', error);
    if (error instanceof Error) {
        return `无法生成摘要。错误信息: ${error.message}`;
    }
    return "未能生成摘要。请检查您的 API 密钥和网络连接。";
  }
};
