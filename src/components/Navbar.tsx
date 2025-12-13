"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

// Registar o plugin ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const Navbar = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  useGSAP(() => {
    // 1. Animação Inicial de Entrada
    gsap.fromTo(navRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.5 }
    );

    // 2. Lógica de Scroll (Esconder/Mostrar)
    ScrollTrigger.create({
      start: "top top",
      end: "max",
      onUpdate: (self) => {
        // self.direction: 1 = Baixo (Down), -1 = Cima (Up)

        // --- SCROLL PARA BAIXO (Esconder) ---
        if (self.direction === 1 && self.scroll() > 100) {
          gsap.to(navRef.current, {
            y: -150,
            opacity: 1,
            duration: 0.2,
            ease: "power2.inOut"
          });
        }

        // --- SCROLL PARA CIMA (Mostrar) ---
        else if (self.direction === -1) {
          gsap.to(navRef.current, {
            y: 0,
            opacity: 1,
            duration: 0.2,
            ease: "power2.out"
          });
        }
      }
    });

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">

      <nav
        ref={navRef}
        className="glass pointer-events-auto flex items-center gap-2 p-2 rounded-full transition-transform hover:scale-[1.02] duration-300"
      >

        <button
          onClick={() => scrollToSection("start")}
          className="px-4 py-2 rounded-full text-sm font-bold text-white hover:bg-white/10 transition-colors flex items-center gap-2"
        >
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          AI Creator
        </button>

        <div className="w-[1px] h-4 bg-white/10 mx-1 hidden md:block" />

        <ul className="hidden md:flex items-center gap-1">
          <li>
            <button
              onClick={() => scrollToSection("persona")}
              className="px-4 py-2 rounded-full text-xs font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
            >
              Identidade
            </button>
          </li>
          <li>
            <button
              onClick={() => scrollToSection("knowledge")}
              className="px-4 py-2 rounded-full text-xs font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
            >
              Conhecimento
            </button>
          </li>
        </ul>

        <div className="w-[1px] h-4 bg-white/10 mx-1" />

        <button
          onClick={() => scrollToSection("generate")}
          className="bg-white text-black px-5 py-2 rounded-full text-xs font-bold hover:bg-blue-50 hover:text-blue-600 transition-colors shadow-lg shadow-white/5"
        >
          Gerar ✨
        </button>

      </nav>
    </div>
  );
};

export default Navbar;