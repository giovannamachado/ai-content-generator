import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Inicializa a IA
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { persona, targetAudience, toneOfVoice, visualIdentity, contentType, prompt, fileContents } = await req.json();

    // 1. Configurar o Modelo (Usamos o Flash por ser rápido)
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    // 2. Construir o Prompt do Sistema (Engenharia de Prompt)
    // Aqui é onde garantimos que a IA age como a Persona definida
    const systemInstruction = `
      TU ÉS UM GESTOR DE REDES SOCIAIS PROFISSIONAL E CRIATIVO.

      O TEU OBJETIVO: Criar conteúdo para Instagram altamente personalizado.

      --- DADOS DA MARCA ---
      PERSONA: ${persona}
      PÚBLICO-ALVO: ${targetAudience}
      TOM DE VOZ: ${toneOfVoice}
      IDENTIDADE VISUAL: ${visualIdentity}

      --- CONTEXTO ADICIONAL (RAG - BASE DE CONHECIMENTO) ---
      O utilizador forneceu os seguintes textos de referência para manter a consistência:
      ${fileContents ? fileContents.join("\n\n") : "Nenhum documento extra fornecido."}

      --- O PEDIDO ATUAL ---
      TIPO DE CONTEÚDO: ${contentType}
      INSTRUÇÃO ESPECÍFICA: ${prompt}

      --- FORMATO DE SAÍDA ESPERADO ---
      Retorna APENAS um objeto JSON (sem markdown, sem aspas de código) com a seguinte estrutura:
      {
        "caption": "A legenda completa para o post, incluindo emojis e quebras de linha...",
        "hashtags": "#exemplo #hashtags",
        "imagePrompt": "Uma descrição detalhada e artística para gerar uma imagem via IA (DALL-E ou Midjourney) que combine com a identidade visual."
      }
    `;

    // 3. Gerar o Conteúdo
    const result = await model.generateContent(systemInstruction);
    const response = await result.response;
    let text = response.text();

    // Limpeza básica para garantir que é JSON válido (às vezes a IA põe ```json ... ```)
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