"use client";

import { useFormContext } from "@/context/FormContext";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const PersonaForm = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const { data, updateData } = useFormContext();

  // Configuração da animação de entrada dos campos do formulário
  useGSAP(() => {
    gsap.fromTo(
      formRef.current?.children || [],
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
      }
    );
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="w-full max-w-3xl mx-auto px-6">
      <form ref={formRef} className="space-y-8" onSubmit={(e) => e.preventDefault()}>

        {/* Campo: Persona */}
        <div className="group">
          <label className="block text-sm font-medium text-gray-400 mb-2 group-focus-within:text-blue-400 transition-colors">
            Quem é sua marca? (Persona)
          </label>
          <textarea
            value={data.persona}
            onChange={(e) => updateData("persona", e.target.value)}
            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none h-32"
            placeholder="Ex: Uma marca de café artesanal jovem, sustentável e energética..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Campo: Público-Alvo */}
          <div className="group">
            <label className="block text-sm font-medium text-gray-400 mb-2 group-focus-within:text-blue-400 transition-colors">
              Público-Alvo
            </label>
            <input
              type="text"
              value={data.targetAudience}
              onChange={(e) => updateData("targetAudience", e.target.value)}
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              placeholder="Ex: Jovens adultos, 20-35 anos..."
            />
          </div>

          {/* Campo: Tom de Voz */}
          <div className="group">
            <label className="block text-sm font-medium text-gray-400 mb-2 group-focus-within:text-blue-400 transition-colors">
              Tom de Voz
            </label>
            <input
              type="text"
              value={data.toneOfVoice}
              onChange={(e) => updateData("toneOfVoice", e.target.value)}
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              placeholder="Ex: Descontraído, inspirador, técnico..."
            />
          </div>
        </div>

        {/* Campo: Identidade Visual */}
        <div className="group">
          <label className="block text-sm font-medium text-gray-400 mb-2 group-focus-within:text-blue-400 transition-colors">
            Identidade Visual (Descrição)
          </label>
          <input
            type="text"
            value={data.visualIdentity}
            onChange={(e) => updateData("visualIdentity", e.target.value)}
            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            placeholder="Ex: Minimalista, tons pastéis, fotografia natural..."
          />
        </div>
      </form>
    </div>
  );
};

export default PersonaForm;