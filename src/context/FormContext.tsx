"use client";

import { createContext, ReactNode, useContext, useState } from "react";

// 1. Definir o formato dos dados que vamos guardar
interface FormData {
  persona: string;
  targetAudience: string;
  toneOfVoice: string;
  visualIdentity: string;
  contentType: "text" | "image" | "both";
  uploadedFiles: File[];
  finalPrompt: string;
}

// 2. Definir o formato das funções para atualizar esses dados
interface FormContextType {
  data: FormData;
  updateData: (key: keyof FormData, value: any) => void;
  addFile: (file: File) => void;
  removeFile: (index: number) => void;
}

// Valores iniciais (vazios)
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

// 3. O Provedor (o componente que vai envolver o site)
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

// 4. Um hook personalizado para facilitar o uso nos componentes
export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext deve ser usado dentro de um FormProvider");
  }
  return context;
};