import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");

import mammoth from "mammoth";

export const dynamic = "force-dynamic";

export async function POST(req) {
  const openai = new OpenAI({
    apiKey: process.env.NVIDIA_API_KEY,
    baseURL: process.env.NVIDIA_BASE_URL,
  });

  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let extractedText = "";

    if (file.type === "application/pdf") {
      const data = await pdf(buffer);
      extractedText = data.text;
    } else if (
      file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const result = await mammoth.extractRawText({ buffer });
      extractedText = result.value;
    } else {
      return NextResponse.json(
        { error: "Unsupported file type. Please upload PDF or .docx" },
        { status: 400 }
      );
    }

    if (!extractedText || extractedText.trim().length === 0) {
      return NextResponse.json(
        { error: "Could not extract text from the document" },
        { status: 400 }
      );
    }

    // Truncate to roughly 3000 tokens (approx 12000 characters)
    const truncatedText = extractedText.slice(0, 12000);

    const systemPrompt = `You are DEA, a project intelligence engine. The user has uploaded a requirements document. 
    Extract the core project intent and generate exactly 4 distinct, buildable project ideas. 
    Each idea must be tailored to the requirements found in the text.
    
    Return the response in this exact JSON format:
    {
      "projectTitle": "Overall title for the requirement set",
      "summary": "One-line summary of the document's intent",
      "ideas": [
        {
          "title": "Project Name",
          "description": "Concise but engaging description",
          "techStack": ["Tech1", "Tech2", "Tech3"],
          "difficulty": "Beginner/Intermediate/Advanced"
        }
      ]
    }
    
    Return ONLY valid JSON. No markdown, no extra text.`;

    const completion = await openai.chat.completions.create({
      model: "z-ai/glm4.7",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Requirements document text:\n\n${truncatedText}` },
      ],
      temperature: 0.7,
      max_tokens: 2048,
    });

    const content = completion.choices[0].message.content;
    const cleanedContent = content.replace(/```json|```/g, "").trim();
    const result = JSON.parse(cleanedContent);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Docs Processing Error:", error);
    return NextResponse.json(
      { error: "Failed to process the document. " + error.message },
      { status: 500 }
    );
  }
}
