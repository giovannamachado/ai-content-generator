"use client";

import { useFormContext } from "@/context/FormContext";
import { useState } from "react";

interface SimulationProps {
  generatedPostText: string;
}

interface Interaction {
  id: string; // Para chaves únicas do React
  followerName: string;
  followerComment: string;
  brandReply: string;
}

const SimulationPreview = ({ generatedPostText }: SimulationProps) => {
  const { data } = useFormContext();
  const [loading, setLoading] = useState(false);
  // Agora guardamos uma LISTA de interações
  const [interactions, setInteractions] = useState<Interaction[]>([]);

  const runSimulation = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/simulate", {
        method: "POST",
        body: JSON.stringify({
          persona: data.persona,
          toneOfVoice: data.toneOfVoice,
          generatedPost: generatedPostText
        })
      });

      const json = await res.json();

      if (res.ok) {
        // Adiciona a nova interação à lista existente
        setInteractions(prev => [
          ...prev,
          { ...json, id: Date.now().toString() } // Adiciona um ID único
        ]);
      }
    } catch (e) {
      alert("Erro ao simular.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-12 border-t border-zinc-800 pt-8">
      {/* Cabeçalho da Secção */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h4 className="text-white font-medium flex items-center gap-2">
            💬 Simulação de Engajamento
            <span className="bg-zinc-800 text-xs text-zinc-400 px-2 py-0.5 rounded-full border border-zinc-700">
              Agentes IA
            </span>
          </h4>
          <p className="text-zinc-500 text-sm mt-1">
            Veja como diferentes personas do seu público reagiriam a este post.
          </p>
        </div>

        {/* Botão Principal (aparece sempre para permitir adicionar mais) */}
        <button
          onClick={runSimulation}
          disabled={loading}
          className={`
            px-4 py-2 rounded-full text-xs font-semibold border transition-all flex items-center gap-2
            ${loading
              ? "bg-zinc-800 border-zinc-700 text-zinc-500 cursor-wait"
              : "bg-white text-black border-white hover:bg-zinc-200 hover:scale-105 active:scale-95"}
          `}
        >
          {loading ? (
            <>
              <span className="animate-spin text-lg">◌</span> Gerando...
            </>
          ) : (
            <>
              {interactions.length === 0 ? "▶️ Iniciar Simulação" : "➕ Simular Outro Comentário"}
            </>
          )}
        </button>
      </div>

      {/* Estado Vazio (Antes da primeira simulação) */}
      {interactions.length === 0 && !loading && (
        <div className="text-center py-12 bg-zinc-900/30 rounded-2xl border border-dashed border-zinc-800">
          <p className="text-zinc-600 text-sm">
            Nenhuma interação simulada ainda.<br/>Clique no botão acima para testar o engajamento.
          </p>
        </div>
      )}

      {/* Lista de Comentários (Scroll se houver muitos) */}
      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        {interactions.map((interaction, index) => (
          <div
            key={interaction.id}
            className="bg-zinc-900/50 rounded-2xl p-5 border border-zinc-800/50 animate-in fade-in slide-in-from-bottom-4 duration-500"
          >
            {/* 1. Comentário do Seguidor */}
            <div className="flex gap-4 mb-4">
              {/* Avatar Aleatório (Cores baseadas no índice) */}
              <div className={`
                w-10 h-10 min-w-[2.5rem] rounded-full flex items-center justify-center text-sm font-bold text-white shadow-inner
                ${index % 3 === 0 ? "bg-gradient-to-br from-purple-500 to-indigo-600" :
                  index % 3 === 1 ? "bg-gradient-to-br from-emerald-400 to-teal-600" :
                  "bg-gradient-to-br from-orange-400 to-red-600"}
              `}>
                {interaction.followerName[0]}
              </div>

              <div className="flex-1">
                <div className="flex items-baseline gap-2 mb-1">
                  <p className="text-zinc-200 text-sm font-semibold">{interaction.followerName}</p>
                  <span className="text-zinc-600 text-xs">há instantes</span>
                </div>
                <p className="text-zinc-300 text-sm leading-relaxed">
                  {interaction.followerComment}
                </p>
              </div>
            </div>

            {/* 2. Resposta da Marca (Thread) */}
            <div className="flex gap-3 ml-14 relative before:absolute before:left-[-24px] before:top-[-20px] before:w-[20px] before:h-[40px] before:border-l-2 before:border-b-2 before:border-zinc-800 before:rounded-bl-xl">
              <div className="w-6 h-6 min-w-[1.5rem] rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white mt-1 shadow-lg shadow-blue-900/20">
                EU
              </div>
              <div>
                <p className="text-blue-400 text-xs font-semibold mb-1">Sua Marca (IA)</p>
                <p className="text-zinc-400 text-sm">
                  {interaction.brandReply}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimulationPreview;