import { GoogleGenAI, Type } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY not found in environment variables.");
    // In a real scenario, handle this gracefully. For this demo, we assume it's there.
  }
  return new GoogleGenAI({ apiKey: apiKey || '' });
};

export const getFishingAdvice = async (fishName: string): Promise<string> => {
  const ai = getClient();
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `我这周打算去钓"${fishName}"。
      请以此为主题，给我生成一份简短、幽默且实用的钓鱼指南。
      
      请包含以下3点：
      1. 推荐饵料
      2. 推荐钓法或钓位
      3. 一句以此鱼为主题的吉利话或幽默吐槽。

      请直接返回纯文本，使用Markdown格式，使用emoji增加趣味性。不要太长，适合手机阅读。`,
      config: {
        thinkingConfig: { thinkingBudget: 0 }, // Fast response needed
        temperature: 0.8,
      }
    });

    return response.text || "哎呀，鱼漂没动静，AI 也没反应过来... 再试一次？";
  } catch (error) {
    console.error("Error fetching fishing advice:", error);
    return "获取钓鱼锦囊失败，可能是信号不好，专心钓鱼吧！";
  }
};
