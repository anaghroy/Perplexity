import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export async function generateImage(prompt) {
  const imageBlob = await hf.textToImage(
    {
      model: "stabilityai/stable-diffusion-xl-base-1.0",
      inputs: prompt,
      parameters: { negative_prompt: "blurry, bad quality" },
    },
    { outputType: "blob" },
  );

  const slug = prompt
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60);
  const fileName = `${slug}-${Date.now()}.jpg`;

  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  const credentials = Buffer.from(`${privateKey}:`).toString("base64");

  const form = new FormData();
  form.append("file", imageBlob, fileName);
  form.append("fileName", fileName);
  form.append("folder", "/ai-generated");
  form.append("tags", "ai-generated,stable-diffusion");
  form.append("useUniqueFileName", "false");

  const response = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
    method: "POST",
    headers: { Authorization: `Basic ${credentials}` },
    body: form,
  });

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(`ImageKit upload failed ${response.status}: ${responseText}`);
  }

  const uploadResponse = JSON.parse(responseText);

  return {
    url: uploadResponse.url,
    fileId: uploadResponse.fileId,
    name: uploadResponse.name,
    prompt,
  };
}