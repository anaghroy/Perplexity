import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export async function generateImage(prompt) {
  try {
    const blob = await hf.textToImage({
      model: "stabilityai/stable-diffusion-xl-base-1.0",
      inputs: prompt,
      parameters: {
        negative_prompt: "blurry, bad quality",
      },
    });

    const buffer = Buffer.from(await blob.arrayBuffer());
    const base64 = buffer.toString("base64");
    return `data:image/jpeg;base64,${base64}`;
  } catch (error) {
    console.error("Image generation error:", error);
    throw error;
  }
}