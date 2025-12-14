"use client";

import { useFormContext } from "@/context/FormContext";
import { useRef, useState } from "react";

const FileUploader = () => {
  // Acesso ao contexto global para manipulação de arquivos
  const { data, addFile, removeFile } = useFormContext();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      Array.from(e.dataTransfer.files).forEach((file) => addFile(file));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      Array.from(e.target.files).forEach((file) => addFile(file));
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-6">
      {/* Área de Upload (Drag and Drop) */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative w-full h-64 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all
          ${isDragging ? "border-blue-500 bg-zinc-900" : "border-zinc-700 bg-black hover:border-zinc-500"}
        `}
      >
        <input
          type="file"
          multiple
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileSelect}
        />
        <span className="text-4xl mb-4">📂</span>
        <p className="text-zinc-300 font-medium">
          Arraste documentos ou clique aqui
        </p>
        <p className="text-sm text-zinc-500 mt-2">
          PDF, DOCX, TXT para treinar a IA (RAG)
        </p>
      </div>

      {/* Listagem de Arquivos Carregados */}
      {data.uploadedFiles.length > 0 && (
        <div className="mt-6 space-y-3">
          <h4 className="text-white text-sm font-semibold">Arquivos prontos para envio:</h4>
          {data.uploadedFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-zinc-900 rounded-lg border border-zinc-800 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-3">
                <span className="text-blue-400">📄</span>
                <span className="text-zinc-300 text-sm truncate max-w-[200px]">{file.name}</span>
                <span className="text-zinc-600 text-xs">({(file.size / 1024).toFixed(1)} KB)</span>
              </div>
              <button
                onClick={() => removeFile(index)}
                className="text-zinc-500 hover:text-red-400 transition-colors px-2"
                title="Remover arquivo"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUploader;