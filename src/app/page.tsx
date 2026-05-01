"use client";

import React, { useState } from "react";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { FileUpload } from "@/components/ui/file-upload";
import { Tabs } from "@/components/ui/tabs";
import { ConversionType } from "@/lib/converter";
import { Loader2, Download } from "lucide-react";

export default function Home() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [convertedFile, setConvertedFile] = useState<{ url: string; name: string } | null>(null);
  const [selectedType, setSelectedType] = useState<ConversionType>("png-to-jpeg");

  const handleFileUpload = async (files: File[]) => {
    if (files.length === 0) return;

    setIsProcessing(true);
    setConvertedFile(null);

    const formData = new FormData();
    formData.append("file", files[0]);
    formData.append("type", selectedType);

    try {
      const response = await fetch("/api/convert", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Conversion failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const contentDisposition = response.headers.get("Content-Disposition");
      let fileName = "converted-file";
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/);
        if (match) fileName = match[1];
      }

      setConvertedFile({ url, name: fileName });
    } catch (error) {
      console.error("Error during conversion:", error);
      alert("Conversion failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const tabs = [
    {
      title: "Images",
      value: "images",
      content: (
        <div className="w-full rounded-2xl p-4 md:p-8 bg-neutral-900 border border-neutral-800">
          <p className="text-lg md:text-xl font-bold text-white mb-4">Image Conversion</p>
          <div className="flex flex-wrap gap-2 md:gap-4">
            {[
              { id: "png-to-jpeg", label: "PNG to JPEG" },
              { id: "jpeg-to-png", label: "JPEG to PNG" },
              { id: "webp-to-png", label: "WEBP to PNG" },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setSelectedType(opt.id as ConversionType)}
                className={`text-xs md:text-sm px-4 py-2 rounded-lg transition-all border ${
                  selectedType === opt.id
                    ? "bg-blue-600 border-blue-500 text-white"
                    : "bg-neutral-800 border-neutral-700 text-neutral-400 hover:border-neutral-600"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: "Documents",
      value: "documents",
      content: (
        <div className="w-full rounded-2xl p-4 md:p-8 bg-neutral-900 border border-neutral-800">
          <p className="text-lg md:text-xl font-bold text-white mb-4">Document Conversion</p>
          <div className="flex flex-wrap gap-2 md:gap-4">
            {[
              { id: "word-to-pdf", label: "Word to PDF" },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setSelectedType(opt.id as ConversionType)}
                className={`text-xs md:text-sm px-4 py-2 rounded-lg transition-all border ${
                  selectedType === opt.id
                    ? "bg-blue-600 border-blue-500 text-white"
                    : "bg-neutral-800 border-neutral-700 text-neutral-400 hover:border-neutral-600"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: "PDF Tools",
      value: "pdf",
      content: (
        <div className="w-full rounded-2xl p-4 md:p-8 bg-neutral-900 border border-neutral-800">
          <p className="text-lg md:text-xl font-bold text-white mb-4">PDF Tools</p>
          <div className="flex flex-wrap gap-2 md:gap-4">
            {[
              { id: "pdf-to-text", label: "PDF to Text" },
              { id: "pdf-to-docx", label: "PDF to Word" },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setSelectedType(opt.id as ConversionType)}
                className={`text-xs md:text-sm px-4 py-2 rounded-lg transition-all border ${
                  selectedType === opt.id
                    ? "bg-blue-600 border-blue-500 text-white"
                    : "bg-neutral-800 border-neutral-700 text-neutral-400 hover:border-neutral-600"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      ),
    },
  ];

  return (
    <main className="min-h-screen bg-neutral-950 flex flex-col items-center justify-start relative p-4 md:p-8 overflow-x-hidden">
      <BackgroundBeams className="opacity-40" />

      <div className="z-10 w-full max-w-4xl py-10">
        <div className="text-center mb-8 md:mb-16">
          <h1 className="text-5xl md:text-8xl font-bold text-white tracking-tighter">
            Convert <span className="text-blue-500">Anything.</span>
          </h1>
          <p className="mt-4 text-neutral-400 max-w-lg mx-auto text-sm md:text-base px-4">
            Professional file conversion tool. High-quality results for images, documents, and PDFs.
          </p>
        </div>

        <div className="mb-10">
          <Tabs tabs={tabs} />
        </div>

        <div className="bg-neutral-900/40 border border-neutral-800 rounded-[2rem] p-6 md:p-10 backdrop-blur-xl shadow-2xl">
          <div className="mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
              Step 2: Upload and Convert
            </h2>
            <p className="text-neutral-500 text-xs md:text-sm">
              Currently using <span className="text-blue-400 font-mono font-bold uppercase">{selectedType.replace(/-/g, " ")}</span> mode.
            </p>
          </div>

          <FileUpload onChange={handleFileUpload} />

          {isProcessing && (
            <div className="mt-8 flex items-center justify-center gap-3 text-blue-400 font-medium">
              <Loader2 className="animate-spin h-5 w-5" />
              <span>Processing...</span>
            </div>
          )}

          {convertedFile && (
            <div className="mt-8 p-5 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-col text-center sm:text-left overflow-hidden w-full">
                <span className="text-white font-bold text-sm md:text-base">Success!</span>
                <span className="text-xs text-neutral-400 truncate">{convertedFile.name}</span>
              </div>
              <a
                href={convertedFile.url}
                download={convertedFile.name}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-all shadow-lg shadow-blue-600/20 font-bold text-sm"
              >
                <Download size={18} />
                Download
              </a>
            </div>
          )}
        </div>
      </div>

      <footer className="z-10 mt-auto py-10 text-neutral-600 text-[10px] md:text-xs uppercase tracking-widest font-bold">
        Aceternity UI &bull; Next.js 16
      </footer>
    </main>
  );
}
