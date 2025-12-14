"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const subTextRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const bg1Ref = useRef<HTMLDivElement>(null);
  const bg2Ref = useRef<HTMLDivElement>(null);

  // Rola a página suavemente até a seção de configuração da Persona
  const handleStart = () => {
    const element = document.getElementById("persona");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  useGSAP(() => {
    // Configuração da animação de entrada dos elementos
    const entryTl = gsap.timeline();

    entryTl
      .fromTo(textRef.current,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }
      )
      .fromTo(subTextRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
        "-=0.8"
      )
      .fromTo(ctaRef.current,
        { opacity: 0, scale: 0.8, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "back.out(1.7)" },
        "-=0.6"
      );

    // Configuração do efeito de parallax ao rolar a página
    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom 40%",
        scrub: 1,
      }
    });

    scrollTl
      .to(textRef.current, { y: -150, opacity: 0 }, 0)
      .to(subTextRef.current, { y: -100, opacity: 0 }, 0.1)
      .to(ctaRef.current, { y: -50, opacity: 0 }, 0.2);

    // Animação independente dos elementos de fundo
    gsap.to(bg1Ref.current, {
      y: 300,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1
      }
    });

    gsap.to(bg2Ref.current, {
      y: -200,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1
      }
    });

  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      id="start"
      className="relative h-screen w-full bg-black text-white flex flex-col items-center justify-center overflow-hidden"
    >

      {/* Elementos de fundo animados */}
      <div
        ref={bg1Ref}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"
      />
      <div
        ref={bg2Ref}
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"
      />

      {/* Conteúdo principal */}
      <div className="z-10 text-center max-w-5xl px-6 flex flex-col items-center">

        <h1
          ref={textRef}
          className="text-6xl md:text-8xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60 drop-shadow-2xl"
        >
          Criação de Conteúdo.<br />Reinventada.
        </h1>

        <div ref={subTextRef}>
          <p className="text-xl md:text-2xl text-gray-400 font-medium max-w-2xl mx-auto leading-relaxed mb-10">
            Inteligência Artificial Generativa alinhada à identidade da sua marca.
            Do conceito à publicação no Instagram.
          </p>
        </div>

        {/* Botão de ação principal (CTA) */}
        <button
          ref={ctaRef}
          onClick={handleStart}
          className="group relative inline-flex items-center justify-center px-8 py-4 font-semibold text-white transition-all duration-200 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:scale-105 focus:outline-none ring-offset-2 focus:ring-2 ring-blue-500"
        >
          <span className="mr-2">Configurar Persona</span>
          <svg className="w-4 h-4 transition-transform group-hover:translate-y-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>

          <div className="absolute inset-0 rounded-full ring-2 ring-white/20 group-hover:ring-white/40 transition-all" />
        </button>

      </div>

      {/* Indicador de rolagem */}
      <div className="absolute bottom-10 animate-bounce text-gray-600 opacity-50">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 13l5 5 5-5M7 6l5 5 5-5"/></svg>
      </div>
    </section>
  );
};

export default Hero;