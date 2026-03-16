import { aiService } from "../services/ai.service.js";

/**
 * AI chat / Smart Query
 */

export async function smartQueryController(req, res) {
  try {
    const { query } = req.body;

    const result = await aiService.smartQuery(query);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("AI Query Controller Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

/**Image Generation */
export async function generateImageController(req, res) {
  try {
    const { prompt } = req.body;
    const result = await aiService.generateImage(prompt);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Image Controller Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

/**Audio Transcription */
export async function transcribeAudioController(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No audio file uploaded",
      });
    }
    const filePath = req.file.path;
    const result = await aiService.transcribeAudio(filePath);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Audio Controller Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

/**Document Summarization */
export async function summarizeDocumentController(req, res) {
  try {
    const filePath = req.file.path;
    const result = await aiService.summarizeDocument(filePath);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Document Controller Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
