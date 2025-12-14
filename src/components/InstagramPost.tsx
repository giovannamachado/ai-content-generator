"use client";

import { useFormContext } from "@/context/FormContext";
import { useEffect, useRef, useState } from "react";

interface InstagramPostProps {
  imagePrompt: string;
  caption: string;
  hashtags: string;
}

interface Interaction {
  id: string;
  followerName: string;
  followerComment: string;
  brandReply: string;
}

const InstagramPost = ({ imagePrompt, caption, hashtags }: InstagramPostProps) => {
  const { data } = useFormContext();

  // Estados para controle da imagem e regeneração
  const [seed, setSeed] = useState(Date.now());
  const [isRegeneratingImage, setIsRegeneratingImage] = useState(false);

  // Estados para controle da legenda e hashtags
  const [displayCaption, setDisplayCaption] = useState(caption);
  const [displayHashtags, setDisplayHashtags] = useState(hashtags);
  const [isRegeneratingCaption, setIsRegeneratingCaption] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Estados para simulação de comentários
  const [comments, setComments] = useState<Interaction[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);

  // Referência para rolagem automática dos comentários
  const commentsEndRef = useRef<HTMLDivElement>(null);

  const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(imagePrompt)}?nologo=true&aspect=1:1&width=1080&seed=${seed}`;

  // Atualiza a exibição se as propriedades externas mudarem
  useEffect(() => {
    setDisplayCaption(caption);
    setDisplayHashtags(hashtags);
  }, [caption, hashtags]);

  // Rola para o último comentário adicionado
  useEffect(() => {
    if (comments.length > 0) {
      commentsEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [comments]);

  // Simula interação de seguidores via API
  const handleLoadComments = async () => {
    setLoadingComments(true);
    try {
      const res = await fetch("/api/simulate", {
        method: "POST",
        body: JSON.stringify({
          persona: data.persona,
          toneOfVoice: data.toneOfVoice,
          generatedPost: displayCaption
        })
      });
      const json = await res.json();
      if (res.ok) {
        setComments(prev => [...prev, { ...json, id: Date.now().toString() }]);
      }
    } catch (error) {
      console.error("Erro ao simular comentário", error);
    } finally {
      setLoadingComments(false);
    }
  };

  // Faz o download da imagem gerada
  const downloadImage = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `instagram-post-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro ao baixar imagem:", error);
      window.open(imageUrl, '_blank');
    }
  };

  // Regenera a imagem alterando a seed
  const handleRegenerateImage = () => {
    setIsRegeneratingImage(true);
    setSeed(Date.now());
    setTimeout(() => setIsRegeneratingImage(false), 1000);
  };

  // Copia a legenda para a área de transferência
  const handleCopyCaption = () => {
    const fullText = `${displayCaption}\n\n${displayHashtags}`;
    navigator.clipboard.writeText(fullText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Solicita uma reescrita da legenda à API
  const handleRegenerateCaption = async () => {
    setIsRegeneratingCaption(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          persona: data.persona,
          targetAudience: data.targetAudience,
          toneOfVoice: data.toneOfVoice,
          visualIdentity: data.visualIdentity,
          contentType: "text",
          prompt: `REESCREVA ESTA LEGENDA DE FORMA DIFERENTE, MANTENDO O SENTIDO, EM PORTUGUÊS DO BRASIL: "${data.finalPrompt}".`,
          fileContents: [],
        }),
      });

      const json = await response.json();
      if (response.ok) {
        setDisplayCaption(json.caption);
        setDisplayHashtags(json.hashtags);
      }
    } catch (error) {
      console.error("Erro ao regenerar legenda", error);
    } finally {
      setIsRegeneratingCaption(false);
    }
  };

  return (
    <div className="flex justify-center w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Card Principal do Post */}
      <div className="w-full max-w-[470px] bg-black border border-zinc-800 rounded-xl overflow-hidden shadow-2xl flex flex-col">

        {/* Cabeçalho do Post */}
        <div className="flex items-center justify-between p-3 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 overflow-hidden">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 relative top-1">
                    <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.602-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                </svg>
            </div>
            <div>
              <p className="text-white text-sm font-semibold leading-none">você</p>
              <p className="text-xs text-zinc-500 mt-0.5">Áudio Original</p>
            </div>
          </div>
          <button className="text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
          </button>
        </div>

        {/* Área da Imagem */}
        <div className="aspect-square w-full bg-zinc-900 relative group overflow-hidden">
            <img
                src={imageUrl}
                alt="Conteúdo Gerado"
                className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105 group-hover:blur-[2px] group-hover:grayscale-[0.7] ${isRegeneratingImage ? 'opacity-50' : 'opacity-100'}`}
                loading="lazy"
            />

            {isRegeneratingImage && (
                <div className="absolute inset-0 flex items-center justify-center z-0">
                    <span className="animate-spin h-8 w-8 border-4 border-white border-t-transparent rounded-full"></span>
                </div>
            )}

            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center z-10 backdrop-blur-[2px]">
                <button
                    onClick={handleRegenerateImage}
                    title="Gerar nova versão da imagem"
                    className="absolute top-3 right-3 p-2 bg-black/60 rounded-full text-white hover:bg-white hover:text-black transition-all border border-white/20 shadow-lg hover:rotate-180 duration-500"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>
                </button>

                <button onClick={downloadImage} className="flex flex-col items-center gap-3 group/btn">
                    <div className="p-4 rounded-full bg-white/10 border-2 border-white text-white group-hover/btn:bg-white group-hover/btn:text-black transition-all duration-300 transform group-hover/btn:scale-110">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                    </div>
                    <span className="text-white font-bold text-sm tracking-wide bg-black/50 px-3 py-1 rounded-full backdrop-blur-md">
                        Baixar a imagem
                    </span>
                </button>
            </div>
        </div>

        {/* Ações e Legenda */}
        <div className="p-3 pb-6 bg-black relative z-20">

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              <svg className="w-6 h-6 text-white hover:text-red-500 transition-colors cursor-pointer" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
              <svg className="w-6 h-6 text-white hover:text-gray-300 cursor-pointer" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              <svg className="w-6 h-6 text-white hover:text-gray-300 cursor-pointer" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
            </div>
            <svg className="w-6 h-6 text-white hover:text-gray-300 cursor-pointer" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
          </div>

          <p className="text-white text-sm font-semibold mb-2">Curtido por você e outras pessoas</p>

          <div className="relative group rounded-xl -mx-2 px-2 py-2 transition-colors hover:bg-zinc-900/30">
            <div className={`transition-all duration-300 ${isRegeneratingCaption ? 'opacity-50 blur-[1px]' : 'group-hover:opacity-40 group-hover:blur-[1px]'}`}>
                <div className="text-sm text-zinc-100 mb-2">
                    <span className="font-semibold mr-2">você</span>
                    <span className="whitespace-pre-wrap">{displayCaption}</span>
                </div>
                <p className="text-blue-400 text-sm mb-1">{displayHashtags}</p>
            </div>

            {isRegeneratingCaption && (
                <div className="absolute inset-0 flex items-center justify-center z-20">
                    <span className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full"></span>
                </div>
            )}

            {!isRegeneratingCaption && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                    <button
                        onClick={handleRegenerateCaption}
                        title="Reescrever legenda"
                        className="absolute top-1 right-1 p-1.5 bg-black/60 rounded-full text-white hover:bg-white hover:text-black transition-all border border-white/20 shadow-sm hover:rotate-180 duration-500"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>
                    </button>

                    <button
                        onClick={handleCopyCaption}
                        className="flex flex-col items-center gap-2 group/copy"
                    >
                        <div className="p-3 rounded-full bg-white/10 border border-white text-white group-hover/copy:bg-white group-hover/copy:text-black transition-all duration-300 transform group-hover/copy:scale-110 shadow-lg backdrop-blur-md">
                            {isCopied ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                            )}
                        </div>
                        <span className="text-white font-bold text-xs tracking-wide bg-black/60 px-3 py-1 rounded-full backdrop-blur-md">
                            {isCopied ? "Copiado!" : "Copiar legenda"}
                        </span>
                    </button>
                </div>
            )}
          </div>

          {/* Área de Comentários */}
          <div className="mt-2 border-t border-zinc-900 pt-3">

            {/* Lista de Comentários */}
            {comments.length > 0 && (
                <div className="flex flex-col gap-3 mb-3 animate-in fade-in custom-scrollbar overflow-y-auto max-h-[350px] pr-2">
                    {comments.map((comment) => (
                        <div key={comment.id} className="text-sm group">
                            <div className="mb-1 leading-snug">
                                <span className="font-semibold text-white mr-2">
                                    {comment.followerName.toLowerCase().replace(/\s/g, '_')}
                                </span>
                                <span className="text-zinc-300">
                                    {comment.followerComment}
                                </span>
                            </div>
                            <div className="flex gap-2 mt-1 ml-3 pl-3 border-l-2 border-zinc-800">
                                <div className="text-xs text-zinc-400 leading-snug">
                                    <span className="font-semibold mr-2 block sm:inline">você</span>
                                    <span>{comment.brandReply}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {/* Elemento âncora para scroll automático */}
                    <div ref={commentsEndRef} />
                </div>
            )}

            <button
                onClick={handleLoadComments}
                disabled={loadingComments}
                className="text-zinc-500 text-sm cursor-pointer hover:text-zinc-300 transition-colors w-full text-left py-1"
            >
                {loadingComments ? (
                    <span className="flex items-center gap-2">
                        <span className="animate-spin h-3 w-3 border-2 border-zinc-500 border-t-transparent rounded-full"></span>
                        Carregando comentários...
                    </span>
                ) : (
                    comments.length === 0 ? "Ver todos os comentários" : "Ver mais comentários (+)"
                )}
            </button>
          </div>

          <p className="text-zinc-600 text-[10px] uppercase mt-3">Há 5 minutos</p>
        </div>
      </div>
    </div>
  );
};

export default InstagramPost;