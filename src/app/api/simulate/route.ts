import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { persona, toneOfVoice, generatedPost } = await req.json();
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    // Instrução para simulação de interação em rede social
    const systemInstruction = `
      VOCÊ É UM SIMULADOR DE REDES SOCIAIS. Você vai gerar uma interação realista em 2 turnos, utilizando Português do Brasil.

      CONTEXTO:
      A marca "${persona}" (Tom: ${toneOfVoice}) acabou de publicar este post:
      "${generatedPost}"

      TAREFA:
      1. Crie um comentário de um SEGUIDOR BRASILEIRO (pode ser curioso, um fã, ou alguém com dúvida).
      2. Crie a RESPOSTA DA MARCA a esse comentário, mantendo estritamente a persona e o tom de voz.

      FORMATO JSON:
      {
        "followerName": "Nome Fictício Brasileiro",
        "followerComment": "O comentário do seguidor...",
        "brandReply": "A resposta da marca..."
      }
    `;

    // Processamento da solicitação pela IA
    const result = await model.generateContent(systemInstruction);
    const text = result.response.text().replace(/```json/g, "").replace(/```/g, "").trim();

    return NextResponse.json(JSON.parse(text));

  } catch (error) {
    return NextResponse.json({ error: "Falha na simulação." }, { status: 500 });
  }
}