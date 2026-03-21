import Groq from "groq-sdk";
import fs from "fs";
import path from "path";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function transcribeAudio(buffer, originalname, mimetype) {
  try {
    const file = new File([buffer], originalname, { type: mimetype });

    const transcription = await groq.audio.transcriptions.create({
      file,
      model: "whisper-large-v3",
      response_format: "json",
    });
    return transcription.text;
  } catch (error) {
    console.error("Transcription error:", error);
    throw error;
  }
}
