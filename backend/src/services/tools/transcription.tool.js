import Groq from "groq-sdk";
import fs from "fs";
import path from "path";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function transcribeAudio(filePath) {
  try {
    const stream = fs.createReadStream(filePath);
    stream.path = filePath;

    const transcription = await groq.audio.transcriptions.create({
      file: stream,
      model: "whisper-large-v3",
      response_format: "json",
    });
    return transcription.text;
  } catch (error) {
    console.error("Transcription error:", error);
    throw error;
  }
}
