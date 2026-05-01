import { NextRequest, NextResponse } from "next/server";
import { processConversion, ConversionType } from "@/lib/converter";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const type = formData.get("type") as ConversionType;

    if (!file || !type) {
      return NextResponse.json({ error: "File and type are required" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const { buffer: convertedBuffer, fileName, mimeType } = await processConversion(buffer, type);

    return new NextResponse(new Uint8Array(convertedBuffer), {
      headers: {
        "Content-Type": mimeType,
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    console.error("Conversion error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
