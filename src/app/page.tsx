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
        <div className="w-full overflow-hidden relative rounded-2xl p-6 md:p-10 text-xl md:text-4xl font-bold text-white bg-neutral-900 border border-neutral-800">
          <p className="mb-6">Image Conversion</p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedType("png-to-jpeg")}
              className={`text-xs md:text-sm px-4 py-2 rounded-md transition-colors ${selectedType === "png-to-jpeg" ? "bg-blue-600 text-white" : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"}`}
            >
              PNG to JPEG
            </button>
            <button
              onClick={() => setSelectedType("jpeg-to-png")}
              className={`text-xs md:text-sm px-4 py-2 rounded-md transition-colors ${selectedType === "jpeg-to-png" ? "bg-blue-600 text-white" : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"}`}
            >
              JPEG to PNG
            </button>
            <button
              onClick={() => setSelectedType("webp-to-png")}
              className={`text-xs md:text-sm px-4 py-2 rounded-md transition-colors ${selectedType === "webp-to-png" ? "bg-blue-600 text-white" : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"}`}
            >
              WEBP to PNG
            </button>
          </div>
        </div>
      ),
    },
    {
      title: "Documents",
      value: "documents",
      content: (
        <div className="w-full overflow-hidden relative rounded-2xl p-6 md:p-10 text-xl md:text-4xl font-bold text-white bg-neutral-900 border border-neutral-800">
          <p className="mb-6">Document Conversion</p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedType("word-to-pdf")}
              className={`text-xs md:text-sm px-4 py-2 rounded-md transition-colors ${selectedType === "word-to-pdf" ? "bg-blue-600 text-white" : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"}`}
            >
              Word to PDF
            </button>
          </div>
        </div>
      ),
    },
    {
      title: "PDF Tools",
      value: "pdf",
      content: (
        <div className="w-full overflow-hidden relative rounded-2xl p-6 md:p-10 text-xl md:text-4xl font-bold text-white bg-neutral-900 border border-neutral-800">
          <p className="mb-6">PDF Tools</p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedType("pdf-to-text")}
              className={`text-xs md:text-sm px-4 py-2 rounded-md transition-colors ${selectedType === "pdf-to-text" ? "bg-blue-600 text-white" : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"}`}
            >
              PDF to Text
            </button>
            <button
              onClick={() => setSelectedType("pdf-to-docx")}
              className={`text-xs md:text-sm px-4 py-2 rounded-md transition-colors ${selectedType === "pdf-to-docx" ? "bg-blue-600 text-white" : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"}`}
            >
              PDF to Word
            </button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <main className="min-h-screen bg-neutral-950 flex flex-col items-center justify-start relative p-4 md:p-8 overflow-x-hidden">
      <BackgroundBeams />

      <div className="z-10 w-full max-w-4xl pt-12 md:pt-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
            Convert Anything.
          </h1>
          <p className="mt-4 text-neutral-400 max-w-lg mx-auto text-sm md:text-base px-4">
            Professional file conversion tool. Fast, secure, and high-quality.
          </p>
        </div>

        <div className="relative flex flex-col items-start justify-start my-8 md:my-12 w-full">
          <Tabs tabs={tabs} />
        </div>

        <div className="mt-12 bg-neutral-900/50 border border-neutral-800 rounded-3xl p-6 md:p-8 backdrop-blur-sm">
          <h2 className="text-xl md:text-2xl font-semibold text-white mb-6">
            Step 2: Upload and Convert
          </h2>
          <p className="text-neutral-400 mb-4 text-xs md:text-sm">
            Current Mode: <span className="text-blue-400 font-mono uppercase">{selectedType.replace(/-/g, " ")}</span>
          </p>
          <FileUpload onChange={handleFileUpload} />

          {isProcessing && (
            <div className="mt-8 flex items-center justify-center gap-2 text-blue-400">
              <Loader2 className="animate-spin" />
              <span>Processing your file...</span>
            </div>
          )}

          {convertedFile && (
            <div className="mt-8 p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex flex-col items-center md:items-start text-center md:text-left">
                <span className="text-white font-medium">Conversion Complete!</span>
                <span className="text-xs text-neutral-400 truncate max-w-[200px] md:max-w-md">{convertedFile.name}</span>
              </div>
              <a
                href={convertedFile.url}
                download={convertedFile.name}
                className="w-full md:w-auto flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                <Download size={18} />
                Download
              </a>
            </div>
          )}
        </div>
      </div>

      <footer className="z-10 mt-20 mb-8 text-neutral-500 text-xs md:text-sm">
        Built with Aceternity UI & Next.js 15
      </footer>
    </main>
  );
}
