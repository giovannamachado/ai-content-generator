"use client";

import { useFormContext } from "@/context/FormContext";
import { useState } from "react";
import SimulationPreview from "./SimulationPreview";

const GenerationResult = () => {
  const { data, updateData } = useFormContext();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ caption: string; hashtags: string; imagePrompt: string } | null>(null);

  // Função auxiliar para ler o conteúdo dos ficheiros de texto
  const readFilesContent = async (files: File[]): Promise<string[]> => {
    const promises = files.map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string || "");
        reader.readAsText(file);
      });
    });
    return Promise.all(promises);
  };

  const handleGenerate = async () => {
    if (!data.persona && !data.finalPrompt) {
      alert("Por favor, preencha pelo menos a Persona e o comando final.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      // 1. Ler o conteúdo dos ficheiros (Contexto RAG)
      const fileContents = await readFilesContent(data.uploadedFiles);

      // 2. Chamar a nossa API
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          persona: data.persona,
          targetAudience: data.targetAudience,
          toneOfVoice: data.toneOfVoice,
          visualIdentity: data.visualIdentity,
          contentType: data.contentType,
          prompt: data.finalPrompt,
          fileContents: fileContents,
        }),
      });

      const json = await response.json();

      if (response.ok) {
        setResult(json);
      } else {
        alert("Erro na IA: " + (json.error || "Erro desconhecido"));
      }

    } catch (error) {
      console.error(error);
      alert("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-6 pb-24">
      {/* Input Final (Prompt) */}
      <div className="mb-12">
        <label className="block text-white text-lg font-medium mb-4 text-center">
          Algo mais específico para este post?
        </label>
        <div className="relative">
          <textarea
            value={data.finalPrompt}
            onChange={(e) => updateData("finalPrompt", e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-3xl p-6 text-white text-lg focus:outline-none focus:border-blue-500 transition-all resize-none h-40"
            placeholder="Ex: Quero um post sobre o nosso novo blend de inverno..."
          />

          <div className="absolute bottom-4 right-4">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className={`
                px-6 py-3 rounded-full font-semibold transition-all flex items-center gap-2
                ${loading
                  ? "bg-zinc-700 text-zinc-400 cursor-wait"
                  : "bg-white text-black hover:bg-blue-500 hover:text-white hover:scale-105 shadow-lg"}
              `}
            >
              {loading ? (
                <>
                  <span className="animate-spin">⏳</span> A Pensar...
                </>
              ) : (
                <>
                  ✨ Gerar Conteúdo
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Área de Resultado */}
      {result && (
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-10 duration-700">

          {/* Cabeçalho do Cartão */}
          <div className="p-4 border-b border-zinc-900 bg-black/50 flex justify-between items-center">
            <span className="text-zinc-400 text-sm font-medium">Resultado Gemini AI</span>
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 border-b border-zinc-800">
            {/* Coluna da Esquerda: Imagem Gerada */}
            <div className="bg-black flex flex-col justify-center p-8 border-b md:border-b-0 md:border-r border-zinc-900">
              <div className="mb-4">
                <span className="text-xs uppercase font-bold text-blue-500 tracking-wider">Sugestão de Imagem (Prompt)</span>
              </div>

              {/* O Prompt de texto que gerou a imagem */}
              <p className="text-zinc-400 italic text-sm leading-relaxed border-l-2 border-zinc-800 pl-4 mb-4">
                "{result.imagePrompt}"
              </p>

              {/* A Imagem Real Gerada por IA via Pollinations */}
              <div className="mt-2 w-full aspect-square bg-zinc-900/50 rounded-2xl border border-zinc-800 overflow-hidden relative group">
                <div className="absolute inset-0 bg-zinc-800 animate-pulse z-0" />
                <img
                  src={`https://image.pollinations.ai/prompt/${encodeURIComponent(result.imagePrompt)}?nologo=true&aspect=1:1&width=1024`}
                  alt={result.imagePrompt}
                  className="w-full h-full object-cover relative z-10 transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Coluna da Direita: Texto Gerado */}
            <div className="p-8 flex flex-col justify-center bg-zinc-900/20">
              <div className="prose prose-invert">
                <h3 className="text-xl font-bold text-white mb-4">Legenda</h3>
                <p className="text-zinc-300 whitespace-pre-wrap leading-relaxed">
                  {result.caption}
                </p>
                <p className="text-blue-400 mt-4 font-medium text-sm">
                  {result.hashtags}
                </p>
              </div>
              <div className="mt-8">
                <button
                  onClick={() => navigator.clipboard.writeText(result.caption + "\n\n" + result.hashtags)}
                  className="w-full py-3 rounded-xl bg-zinc-800 text-white text-sm hover:bg-zinc-700 transition-colors border border-zinc-700"
                >
                  Copiar Legenda
                </button>
              </div>
            </div>
          </div>

          {/* ÁREA DE SIMULAÇÃO (Diferencial TCC) */}
          <div className="p-8 bg-zinc-950">
             <SimulationPreview generatedPostText={result.caption} />
          </div>

        </div>
      )}
    </div>
  );
};

export default GenerationResult;