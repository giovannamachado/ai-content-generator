"use client";

import { createContext, ReactNode, useContext, useState } from "react";

// Definição da estrutura de dados do formulário
interface FormData {
  persona: string;
  targetAudience: string;
  toneOfVoice: string;
  visualIdentity: string;
  contentType: "text" | "image" | "both";
  uploadedFiles: File[];
  finalPrompt: string;
}

// Definição da interface do contexto para manipulação de estado
interface FormContextType {
  data: FormData;
  updateData: (key: keyof FormData, value: any) => void;
  addFile: (file: File) => void;
  removeFile: (index: number) => void;
}

// Estado inicial padrão
const defaultData: FormData = {
  persona: "",
  targetAudience: "",
  toneOfVoice: "",
  visualIdentity: "",
  contentType: "both",
  uploadedFiles: [],
  finalPrompt: "",
};

const FormContext = createContext<FormContextType | undefined>(undefined);

// Provedor de contexto que envolve a aplicação
export const FormProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<FormData>(defaultData);

  const updateData = (key: keyof FormData, value: any) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const addFile = (file: File) => {
    setData((prev) => ({ ...prev, uploadedFiles: [...prev.uploadedFiles, file] }));
  };

  const removeFile = (index: number) => {
    setData((prev) => ({
      ...prev,
      uploadedFiles: prev.uploadedFiles.filter((_, i) => i !== index),
    }));
  };

  return (
    <FormContext.Provider value={{ data, updateData, addFile, removeFile }}>
      {children}
    </FormContext.Provider>
  );
};

// Hook personalizado para acesso ao contexto do formulário
export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext deve ser usado dentro de um FormProvider");
  }
  return context;
};