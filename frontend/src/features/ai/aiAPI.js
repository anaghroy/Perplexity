import axiosInstance from "../../services/axiosInstance";

export const transcribeAudioAPI = async (audioBlob) => {
  const formData = new FormData();
  formData.append("audio", audioBlob, "recording.webm");
  const response = await axiosInstance.post("/api/ai/transcribe", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const summarizeDocumentAPI = async (pdfFile) => {
  const formData = new FormData();
  formData.append("pdf", pdfFile);
  const response = await axiosInstance.post("/api/ai/summarize", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const generateImageAPI = async (prompt) => {
  const response = await axiosInstance.post("/api/ai/image", { prompt });
  return response.data;
};
