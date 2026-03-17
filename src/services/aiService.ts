// src/services/aiService.ts

const API_KEY = import.meta.env.VITE_AI_API_KEY;
const BASE_URL = 'https://api.siliconflow.cn/v1/chat/completions';

export interface AIAnalysis {
  insight: string;
  summary: string;
}

export const generateSummary = async (content: string, title: string): Promise<AIAnalysis> => {
  if (!API_KEY || API_KEY === 'your_deepseek_api_key_here') {
    console.warn('No AI API key found. Returning fallback summary.');
    return {
      insight: "This is a placeholder insight.",
      summary: "This is a placeholder summary. Please configure your VITE_AI_API_KEY in the .env file to see real AI-generated summaries."
    };
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
            content: "你是一个专业且克制的新闻编辑。请对提供的新闻内容进行分析和总结。严格按照以下格式返回（包含两个明确的标记）：\n\n【洞察】\n用一句话总结这条新闻的意义、变化或趋势（偏向理解，而非纯复述）。\n\n【摘要】\n对新闻内容进行理性的详细总结，不少于150字。"
          },
          {
            role: "user",
            content: `标题: ${title}\n\n正文: ${content}`
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
    const fullText = data.choices[0].message.content.trim();
    
    // Parse the result based on markers
    let insight = "";
    let summary = fullText;

    const insightMatch = fullText.match(/【洞察】([\s\S]*?)(?:【摘要】|$)/);
    const summaryMatch = fullText.match(/【摘要】([\s\S]*?)$/);

    if (insightMatch && insightMatch[1]) {
      insight = insightMatch[1].trim();
    }
    if (summaryMatch && summaryMatch[1]) {
      summary = summaryMatch[1].trim();
    }

    return { insight, summary };

  } catch (error) {
    console.error('Detailed error generating summary:', error);
    if (error instanceof Error) {
        return { insight: "无法生成洞察。", summary: `错误信息: ${error.message}` };
    }
    return { insight: "无法生成洞察。", summary: "未能生成摘要。请检查您的 API 密钥和网络连接。" };
  }
};
