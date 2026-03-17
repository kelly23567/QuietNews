// src/services/aiService.ts

const API_KEY = import.meta.env.VITE_AI_API_KEY;
const BASE_URL = 'https://api.siliconflow.cn/v1/chat/completions';

export const generateSummary = async (content: string, title: string): Promise<string> => {
  if (!API_KEY || API_KEY === 'your_deepseek_api_key_here') {
    console.warn('No AI API key found. Returning fallback summary.');
    return "This is a placeholder summary. Please configure your VITE_AI_API_KEY in the .env file to see real AI-generated summaries.";
  }

  try {
    console.log("Sending request to SiliconFlow API...", { title, contentLength: content?.length });
    
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        // The previous model name caused a "Model does not exist" error (400) on SiliconFlow.
        // Using a standard supported open-source model available on SiliconFlow:
        model: "THUDM/glm-4-9b-chat", 
        messages: [
          {
            role: "system",
            content: "你是一个专业的新闻编辑。请对提供的新闻内容进行详细的总结和整理。要求：输出一段连贯的文章，不要使用任何开场白，字数不少于250字。"
          },
          {
            role: "user",
            content: `标题: ${title}\n\n正文: ${content}\n\n请总结这篇新闻。`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000 // Increased to accommodate >250 words
      })
    });

    if (!response.ok) {
      // Capture detailed error info
      const errorText = await response.text();
      console.error(`AI API Error: Status ${response.status}`, errorText);
      
      // Handle specific known errors for better UI feedback
      if (response.status === 401 || errorText.includes('Authentication Fails') || errorText.includes('invalid api key')) {
        throw new Error("API 密钥无效 (Authentication Failed)。请检查 .env 文件中的 VITE_AI_API_KEY 是否正确。");
      }

      if (response.status === 402 || errorText.includes('Insufficient Balance')) {
        throw new Error("API 账户余额不足 (Insufficient Balance)。请前往控制台充值。");
      }
      
      throw new Error(`API Error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log("AI API Response received successfully.");
    return data.choices[0].message.content.trim();

  } catch (error) {
    console.error('Detailed error generating summary:', error);
    if (error instanceof Error) {
        return `无法生成摘要。错误信息: ${error.message}`;
    }
    return "未能生成摘要。请检查您的 API 密钥和网络连接。";
  }
};
