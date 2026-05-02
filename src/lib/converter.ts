import sharp from "sharp";
import mammoth from "mammoth";
import { jsPDF } from "jspdf";
// @ts-expect-error - pdf-parse does not have official types
import pdf from "pdf-parse/lib/pdf-parse.js";
import { Document, Packer, Paragraph, TextRun } from "docx";

export type ConversionType =
  | "png-to-jpeg"
  | "jpeg-to-png"
  | "webp-to-png"
  | "word-to-pdf"
  | "pdf-to-text"
  | "pdf-to-docx";

export async function convertImage(buffer: Buffer, targetFormat: "jpeg" | "png" | "webp"): Promise<Buffer> {
  return await sharp(buffer).toFormat(targetFormat).toBuffer();
}

export async function convertDocxToPdf(buffer: Buffer): Promise<Buffer> {
  // Extract text with simple formatting
  const result = await mammoth.extractRawText({ buffer });
  const text = result.value;

  const doc = new jsPDF({
    orientation: "p",
    unit: "mm",
    format: "a4"
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const maxLineWidth = pageWidth - (margin * 2);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);

  const lines = doc.splitTextToSize(text, maxLineWidth);
  const lineHeight = 6; // Adjusted for 11pt font
  let cursorY = margin;

  for (let i = 0; i < lines.length; i++) {
    if (cursorY + lineHeight > pageHeight - margin) {
      doc.addPage();
      cursorY = margin;
    }
    doc.text(lines[i], margin, cursorY);
    cursorY += lineHeight;
  }

  return Buffer.from(doc.output("arraybuffer"));
}

export async function convertPdfToText(buffer: Buffer): Promise<string> {
  const data = await pdf(buffer);
  return data.text;
}

export async function convertPdfToDocx(buffer: Buffer): Promise<Buffer> {
  const data = await pdf(buffer);
  const text = data.text;

  // Try to preserve some basic structure by splitting by newlines and filtering empty lines
  const lines = text.split("\n").map((line: string) => line.trim());

  const doc = new Document({
    sections: [{
      properties: {},
      children: lines.map((line: string) => new Paragraph({
        children: [new TextRun(line)],
        spacing: {
          after: 200,
        },
      })),
    }],
  });

  return await Packer.toBuffer(doc);
}

export async function processConversion(buffer: Buffer, type: ConversionType): Promise<{ buffer: Buffer; fileName: string; mimeType: string }> {
  switch (type) {
    case "png-to-jpeg":
      return {
        buffer: await convertImage(buffer, "jpeg"),
        fileName: "converted.jpg",
        mimeType: "image/jpeg"
      };
    case "jpeg-to-png":
      return {
        buffer: await convertImage(buffer, "png"),
        fileName: "converted.png",
        mimeType: "image/png"
      };
    case "webp-to-png":
      return {
        buffer: await convertImage(buffer, "png"),
        fileName: "converted.png",
        mimeType: "image/png"
      };
    case "word-to-pdf":
      return {
        buffer: await convertDocxToPdf(buffer),
        fileName: "converted.pdf",
        mimeType: "application/pdf"
      };
    case "pdf-to-text":
      const text = await convertPdfToText(buffer);
      return {
        buffer: Buffer.from(text),
        fileName: "converted.txt",
        mimeType: "text/plain"
      };
    case "pdf-to-docx":
      return {
        buffer: await convertPdfToDocx(buffer),
        fileName: "converted.docx",
        mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      };
    default:
      throw new Error("Unsupported conversion type");
  }
}
