import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Inicialização do cliente da Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { persona, targetAudience, toneOfVoice, visualIdentity, contentType, prompt, fileContents } = await req.json();

    // Configuração do modelo a ser utilizado
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    // Definição das instruções do sistema para guiar o comportamento da IA
    const systemInstruction = `
      VOCÊ É UM GESTOR DE REDES SOCIAIS PROFISSIONAL E CRIATIVO.

      SEU OBJETIVO: Criar conteúdo para Instagram altamente personalizado em PORTUGUÊS DO BRASIL (pt-BR).

      --- DADOS DA MARCA ---
      PERSONA: ${persona}
      PÚBLICO-ALVO: ${targetAudience}
      TOM DE VOZ: ${toneOfVoice}
      IDENTIDADE VISUAL: ${visualIdentity}

      --- CONTEXTO ADICIONAL (BASE DE CONHECIMENTO) ---
      O usuário forneceu os seguintes textos de referência para manter a consistência:
      ${fileContents ? fileContents.join("\n\n") : "Nenhum documento extra fornecido."}

      --- O PEDIDO ATUAL ---
      TIPO DE CONTEÚDO: ${contentType}
      INSTRUÇÃO ESPECÍFICA: ${prompt}

      --- FORMATO DE SAÍDA ESPERADO ---
      Retorne APENAS um objeto JSON (sem markdown, sem aspas de código) com a seguinte estrutura:
      {
        "caption": "A legenda completa para o post em Português do Brasil, incluindo emojis e quebras de linha...",
        "hashtags": "#exemplo #hashtags",
        "imagePrompt": "Uma descrição detalhada e artística para gerar uma imagem via IA que combine com a identidade visual."
      }
    `;

    // Geração do conteúdo com base nas instruções
    const result = await model.generateContent(systemInstruction);
    const response = await result.response;
    let text = response.text();

    // Limpeza da resposta para garantir um JSON válido
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    return NextResponse.json(JSON.parse(text));

  } catch (error) {
    console.error("Erro na geração:", error);
    return NextResponse.json(
      { error: "Falha ao gerar conteúdo. Tente novamente." },
      { status: 500 }
    );
  }
}