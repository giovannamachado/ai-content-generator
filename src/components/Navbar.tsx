"use client";

import { useEffect, useRef, useState } from "react";

// Definição dos itens do menu
const NAV_ITEMS = [
  { id: "start", label: "Início" },
  { id: "persona", label: "Persona" },
  { id: "knowledge", label: "RAG" },
  { id: "generate", label: "Detalhes" },
];

const Navbar = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [activeSection, setActiveSection] = useState("start");
  const [isMounted, setIsMounted] = useState(false);

  const lastScrollY = useRef(0);
  const isClickScrolling = useRef(false);
  const navRef = useRef<HTMLElement>(null);

  // Garante que o componente só renderiza no cliente para evitar erros de hidratação
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Lógica de Esconder/Mostrar
      if (!isClickScrolling.current) {
        if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
      }

      lastScrollY.current = currentScrollY;

      // Lógica de Detetar Secção Ativa
      const sections = NAV_ITEMS.map((item) => document.getElementById(item.id));
      let currentActive = activeSection;

      for (const section of sections) {
        if (section) {
          const rect = section.getBoundingClientRect();
          // Se a secção está visível na área de foco
          if (rect.top <= 300 && rect.bottom >= 300) {
            currentActive = section.id;
          }
        }
      }

      if (currentActive !== activeSection) {
        setActiveSection(currentActive);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeSection]);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      isClickScrolling.current = true;
      setIsVisible(true);
      setActiveSection(id);
      element.scrollIntoView({ behavior: "smooth" });

      // Pequeno timeout para evitar que o scroll automático esconda a barra
      setTimeout(() => {
        isClickScrolling.current = false;
      }, 1000);
    }
  };

  // Definição das classes numa linha única para evitar Hydration Mismatch (Erro do Servidor vs Cliente)
  const containerClasses = `fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none transition-transform duration-500 ease-in-out ${isVisible ? "translate-y-0" : "-translate-y-[150%]"}`;

  const navClasses = "pointer-events-auto glass flex items-center gap-1 p-1.5 rounded-full shadow-2xl shadow-black/50 border border-white/10 max-w-[90vw] md:max-w-fit overflow-x-auto no-scrollbar";

  // Se ainda não montou no cliente, não renderiza nada para garantir consistência
  if (!isMounted) {
    return null;
  }

  return (
    <div className={containerClasses}>
      <nav ref={navRef} className={navClasses}>
        {NAV_ITEMS.map((item) => {
          const isActive = activeSection === item.id;

          // Classes condicionais concatenadas de forma segura
          const buttonBaseClass = "relative px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ease-out whitespace-nowrap";
          const buttonActiveClass = isActive
            ? "text-white bg-white/10 shadow-inner font-bold scale-105"
            : "text-zinc-400 hover:text-white hover:bg-white/5";

          return (
            <button
              key={item.id}
              onClick={() => handleClick(item.id)}
              className={`${buttonBaseClass} ${buttonActiveClass}`}
            >
              {item.label}
              {isActive && (
                <span className="absolute inset-0 rounded-full ring-1 ring-white/20 animate-pulse-slow pointer-events-none" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Navbar;