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
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-neutral-900">
          <p>Image Conversion</p>
          <div className="mt-4 flex flex-wrap gap-4">
            <button
              onClick={() => setSelectedType("png-to-jpeg")}
              className={`text-sm px-4 py-2 rounded-md ${selectedType === "png-to-jpeg" ? "bg-blue-600" : "bg-neutral-700"}`}
            >
              PNG to JPEG
            </button>
            <button
              onClick={() => setSelectedType("jpeg-to-png")}
              className={`text-sm px-4 py-2 rounded-md ${selectedType === "jpeg-to-png" ? "bg-blue-600" : "bg-neutral-700"}`}
            >
              JPEG to PNG
            </button>
            <button
              onClick={() => setSelectedType("webp-to-png")}
              className={`text-sm px-4 py-2 rounded-md ${selectedType === "webp-to-png" ? "bg-blue-600" : "bg-neutral-700"}`}
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
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-neutral-900">
          <p>Document Conversion</p>
          <div className="mt-4 flex flex-wrap gap-4">
            <button
              onClick={() => setSelectedType("word-to-pdf")}
              className={`text-sm px-4 py-2 rounded-md ${selectedType === "word-to-pdf" ? "bg-blue-600" : "bg-neutral-700"}`}
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
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-neutral-900">
          <p>PDF Tools</p>
          <div className="mt-4 flex flex-wrap gap-4">
            <button
              onClick={() => setSelectedType("pdf-to-text")}
              className={`text-sm px-4 py-2 rounded-md ${selectedType === "pdf-to-text" ? "bg-blue-600" : "bg-neutral-700"}`}
            >
              PDF to Text
            </button>
            <button
              onClick={() => setSelectedType("pdf-to-docx")}
              className={`text-sm px-4 py-2 rounded-md ${selectedType === "pdf-to-docx" ? "bg-blue-600" : "bg-neutral-700"}`}
            >
              PDF to Word
            </button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <main className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center relative p-4 overflow-hidden">
      <BackgroundBeams />

      <div className="z-10 w-full max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
            Convert Anything.
          </h1>
          <p className="mt-4 text-neutral-300 max-w-lg mx-auto">
            Professional file conversion tool. Fast, secure, and high-quality.
          </p>
        </div>

        <div className="h-[20rem] md:h-[30rem] [perspective:1000px] relative b flex flex-col max-w-5xl mx-auto w-full  items-start justify-start my-10">
          <Tabs tabs={tabs} />
        </div>

        <div className="mt-20 bg-neutral-900/50 border border-neutral-800 rounded-3xl p-8 backdrop-blur-sm">
          <h2 className="text-2xl font-semibold text-white mb-6">
            Step 2: Upload and Convert
          </h2>
          <p className="text-neutral-400 mb-4 text-sm">
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
            <div className="mt-8 p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-white font-medium">Conversion Complete!</span>
                <span className="text-xs text-neutral-400">{convertedFile.name}</span>
              </div>
              <a
                href={convertedFile.url}
                download={convertedFile.name}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Download size={18} />
                Download
              </a>
            </div>
          )}
        </div>
      </div>

      <footer className="z-10 mt-20 text-neutral-500 text-sm">
        Built with Aceternity UI & Next.js 15
      </footer>
    </main>
  );
}
