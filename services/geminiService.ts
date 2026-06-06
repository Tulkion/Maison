import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Client } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// System instruction for the fashion expert persona
const FASHION_EXPERT_INSTRUCTION = `
Você é uma consultora de moda e gestora de negócios de alto nível, especializada em moda feminina (boutiques, confecção própria).
Seu tom é profissional, criativo, elegante e encorajador.
Suas respostas devem ser práticas, focadas em aumentar vendas, melhorar a gestão de estoque e encantar clientes.
Use terminologia adequada do mundo da moda (ex: caimento, tecidos, paleta de cores, fast fashion vs slow fashion).
`;

export const generateProductDescription = async (name: string, category: string, features: string): Promise<string> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Escreva uma descrição de produto sedutora e elegante para e-commerce e Instagram.
      Produto: ${name}
      Categoria: ${category}
      Detalhes: ${features}
      
      A descrição deve despertar desejo, mencionar ocasiões de uso e destacar a qualidade. Máximo de 80 palavras. Use emojis com moderação.`,
      config: {
        systemInstruction: FASHION_EXPERT_INSTRUCTION,
        temperature: 0.7,
      }
    });
    return response.text || "Não foi possível gerar a descrição.";
  } catch (error) {
    console.error("Erro ao gerar descrição:", error);
    return "Erro ao conectar com a IA.";
  }
};

export const analyzeBusinessInsights = async (totalIncome: number, activeProjectsCount: number): Promise<string> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analise rapidamente o estado atual do atelier.
      Faturamento recente: R$ ${totalIncome.toFixed(2)}
      Projetos/Coleções em andamento: ${activeProjectsCount}
      
      Forneça 3 insights estratégicos focados em gestão de produção, prazos ou relacionamento com clientes B2B. Seja breve.`,
      config: {
        systemInstruction: FASHION_EXPERT_INSTRUCTION,
      }
    });
    return response.text || "Sem insights no momento.";
  } catch (error) {
    console.error("Erro na análise:", error);
    return "Não foi possível analisar os dados no momento.";
  }
};

export const suggestClientOutreach = async (client: Client, newArrivals: string): Promise<string> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Crie uma mensagem curta e personalizada de WhatsApp para a cliente.
      Nome: ${client.name}
      Preferências: ${client.preferences}
      Novidades na loja: ${newArrivals}
      
      A mensagem deve ser amigável, não intrusiva e convidar para uma visita ou olhar o catálogo.`,
      config: {
        systemInstruction: FASHION_EXPERT_INSTRUCTION,
      }
    });
    return response.text || "Erro ao gerar mensagem.";
  } catch (error) {
    console.error("Erro ao gerar mensagem:", error);
    return "Erro de conexão.";
  }
};

// --- NEW FEATURES FOR AI STUDIO & CHAT ---

export const sendGeneralChat = async (history: {role: string, parts: {text: string}[]}[], message: string): Promise<string> => {
    try {
        const chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: FASHION_EXPERT_INSTRUCTION + " Você pode responder sobre finanças, tendências de moda, gestão de produção, tecidos e estratégia de marca."
            },
            history: history as any
        });

        const result = await chat.sendMessage({ message: message });
        return result.text || "Desculpe, não consegui processar sua resposta.";
    } catch (error) {
        console.error("Chat error", error);
        return "Erro de conexão com o serviço de IA.";
    }
}

export const generateCollectionIdeas = async (season: string, theme: string, audience: string): Promise<string> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Atue como Diretora Criativa de uma marca de moda feminina.
      Crie um planejamento de mini-coleção.
      
      Temporada: ${season}
      Tema/Inspiração: ${theme}
      Público Alvo: ${audience}
      
      Retorne um plano estruturado (use Markdown) contendo:
      1. Conceito e "Vibe" da coleção (2 frases)
      2. Paleta de Cores Sugerida (com nomes elegantes e códigos hex aproximados)
      3. Sugestão de Tecidos
      4. 5 Peças Chave para produzir (com breves detalhes de modelagem)
      `,
      config: {
        systemInstruction: FASHION_EXPERT_INSTRUCTION,
        temperature: 0.8, // More creative
      }
    });
    return response.text || "Não foi possível gerar o planejamento.";
  } catch (error) {
    console.error(error);
    return "Erro ao conectar com Maison AI.";
  }
};

export const generateMarketingCopy = async (topic: string, platform: 'instagram' | 'email' | 'blog'): Promise<string> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Crie conteúdo de marketing de moda.
      Tópico/Produto: ${topic}
      Plataforma: ${platform}
      
      Se for Instagram: Crie uma legenda envolvente, use emojis e sugira 5 hashtags relevantes.
      Se for Email: Crie um Assunto chamativo e um corpo de email curto e persuasivo (CTA).
      Se for Blog: Crie um título e um esboço de postagem com 3 parágrafos sobre tendência.
      `,
      config: {
        systemInstruction: FASHION_EXPERT_INSTRUCTION,
      }
    });
    return response.text || "Erro ao gerar copy.";
  } catch (error) {
    console.error(error);
    return "Erro ao gerar copy.";
  }
};

export const generateFashionVisual = async (description: string): Promise<string | null> => {
  try {
    // Using gemini-2.5-flash-image for generation
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: `Fashion illustration sketch, professional fashion design drawing, high fashion, elegant style, white background. The subject is: ${description}` }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: "3:4"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Erro ao gerar imagem:", error);
    return null;
  }
};
