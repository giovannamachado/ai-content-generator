"use client";

import { useFormContext } from "@/context/FormContext";
import { useState } from "react";
import InstagramPost from "./InstagramPost";

const GenerationResult = () => {
  const { data, updateData } = useFormContext();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ caption: string; hashtags: string; imagePrompt: string } | null>(null);

  // Lê o conteúdo dos arquivos carregados para envio à API
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

  // Gerencia a submissão do formulário e chamada à API de geração
  const handleGenerate = async () => {
    if (!data.persona && !data.finalPrompt) {
      alert("Por favor, preencha pelo menos a Persona e o comando final.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const fileContents = await readFilesContent(data.uploadedFiles);

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
    <div className="w-full max-w-4xl mx-auto px-4 pb-8">

      {/* Área de entrada do prompt final */}
      <div className="mb-16 max-w-2xl mx-auto">
        <label className="block text-white text-xl font-semibold mb-6 text-center tracking-tight">
          Sobre o que vamos postar hoje?
        </label>

        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur opacity-20 group-hover:opacity-25 transition duration-1000 group-hover:duration-200"></div>

          <textarea
            value={data.finalPrompt}
            onChange={(e) => updateData("finalPrompt", e.target.value)}
            className="relative z-10 w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-6 text-white text-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none h-32 shadow-xl placeholder-zinc-500"
            placeholder="Ex: Quero um post inspirador sobre o nosso novo café..."
          />

          <div className="absolute -bottom-6 left-0 right-0 flex justify-center z-20">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className={`
                px-8 py-3 rounded-full font-bold shadow-lg shadow-blue-900/20 transition-all flex items-center gap-3 transform
                ${loading
                  ? "bg-zinc-800 text-zinc-500 cursor-wait scale-95"
                  : "bg-blue-600 text-white hover:bg-blue-500 hover:scale-105 active:scale-95"}
              `}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  Criando Conteúdo...
                </>
              ) : (
                <>
                  Gerar Conteúdo ✨
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Exibição do resultado gerado */}
      {result && (
        <div className="mt-20">
            <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Seu Post</h3>
                <p className="text-zinc-500">Pronto para publicar. Interaja abaixo para testar.</p>
            </div>

            <InstagramPost
                imagePrompt={result.imagePrompt}
                caption={result.caption}
                hashtags={result.hashtags}
            />
        </div>
      )}
    </div>
  );
};

export default GenerationResult;