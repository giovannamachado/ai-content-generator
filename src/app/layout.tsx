import Navbar from "@/components/Navbar";
import { FormProvider } from "@/context/FormContext"; // <--- Importar aqui
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AICreator - TCC",
  description: "Gerador de Conteúdo com IA Generativa",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body className={inter.className}>
        <FormProvider> {/* <--- Envolver tudo com o Provider */}
          <Navbar />
          {children}
        </FormProvider>
      </body>
    </html>
  );
}