"use client";

import { useFormContext } from "@/context/FormContext"; // Importar Contexto

const ContentTypeSelector = () => {
  const { data, updateData } = useFormContext(); // Usar Contexto
  const selected = data.contentType; // Ler o valor atual do contexto

  // ... (Mantém o código dos ícones 'const icons = ...' igual ao anterior) ...
  const icons = {
    text: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 6.1H3"/><path d="M21 12.1H3"/><path d="M15.1 18H3"/></svg>
    ),
    image: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
    ),
    both: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4"/><path d="m16.2 7.8 2.9-2.9"/><path d="M18 12h4"/><path d="m16.2 16.2 2.9 2.9"/><path d="M12 18v4"/><path d="m7.8 16.2-2.9 2.9"/><path d="M2 12h4"/><path d="m7.8 7.8-2.9-2.9"/></svg>
    )
  };

  const options = [
    { id: "text", label: "Apenas Texto", icon: icons.text, desc: "Legendas e Hashtags" },
    { id: "image", label: "Apenas Imagem", icon: icons.image, desc: "Difusão Artística" },
    { id: "both", label: "Completo", icon: icons.both, desc: "Texto + Imagem" },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto px-6 mt-12">
      <h3 className="text-xl text-white font-medium mb-6 text-center">O que vamos criar hoje?</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => updateData("contentType", option.id)} // Atualiza no Contexto
            type="button" // Importante para não submeter formulários
            className={`
              relative p-6 rounded-2xl border text-left transition-all duration-300
              flex flex-col gap-3 group items-start
              ${selected === option.id
                ? "bg-zinc-800 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                : "bg-zinc-900/30 border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900"}
            `}
          >
            <div className={`p-2 rounded-full ${selected === option.id ? "bg-blue-500 text-white" : "bg-zinc-800 text-zinc-400"}`}>
              {option.icon}
            </div>
            <div>
              <span className={`block font-semibold ${selected === option.id ? "text-white" : "text-zinc-300"}`}>
                {option.label}
              </span>
              <span className="text-xs text-zinc-500 mt-1 block">
                {option.desc}
              </span>
            </div>

            {/* Indicador de Seleção */}
            {selected === option.id && (
              <div className="absolute top-4 right-4 w-2 h-2 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ContentTypeSelector;