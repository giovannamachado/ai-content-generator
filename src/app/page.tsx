import FileUploader from "@/components/FileUploader";
import GenerationResult from "@/components/GenerationResult";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import PersonaForm from "@/components/PersonaForm";

export default function Home() {
  return (
    <main className="bg-black min-h-screen selection:bg-blue-500 selection:text-white">
      <Navbar />

      <Hero />

      {/* SECÇÃO 1: PERSONA & CONFIGURAÇÃO */}
      <section id="persona" className="min-h-screen bg-black border-t border-zinc-900 py-32 flex flex-col items-center justify-center relative">
        <div className="text-center mb-12 px-6 z-10">
          <h2 className="text-4xl md:text-5xl font-semibold text-white tracking-tight mb-4">
            Defina a sua Identidade.
          </h2>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Ensine a IA sobre a sua marca para gerar conteúdo autêntico.
          </p>
        </div>
        <div className="w-full z-10">
          <PersonaForm />
        </div>
      </section>

      {/* SECÇÃO 2: BASE DE CONHECIMENTO (RAG) */}
      <section id="knowledge" className="bg-zinc-950 py-32 px-6 border-t border-zinc-900">
        <div className="text-center text-white max-w-3xl mx-auto mb-12">
          <h2 className="text-4xl font-semibold mb-6">Base de Conhecimento.</h2>
          <p className="text-zinc-400 text-lg">
            Faça upload de documentos (PDFs, Guias) para que a IA entenda o contexto específico da sua marca.
          </p>
        </div>
        <FileUploader />
      </section>

      {/* SECÇÃO 3: GERAÇÃO */}
      {/* CORREÇÃO: Adicionei 'min-h-screen' para garantir altura mínima e empurrar o footer */}
      <section id="generate" className="bg-black border-t border-zinc-900 pt-32 pb-10 min-h-screen">
        <div className="text-center text-white mb-12">
          <h2 className="text-4xl font-semibold">Criação Final.</h2>
        </div>
        <GenerationResult />
      </section>

      {/* FOOTER */}
      <footer className="bg-zinc-950 py-6 text-center text-zinc-600 text-sm border-t border-zinc-900">
        <p>Desenvolvido com ❤️ por Giovanna</p>
      </footer>
    </main>
  );
}