import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai";
import { ChatGroq } from "@langchain/groq";

const geminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GEMINI_API_KEY,
});

const mistralModel = new ChatMistralAI({
  model: "mistral-large-latest",
  apiKey: process.env.MISTRAL_API_KEY,
});

const chatgroqModel = new ChatGroq({
  model: "llama-3.3-70b-versatile",
  apiKey: process.env.GROQ_API_KEY,
});

export async  function  testGeminiAI() {
 await geminiModel.invoke("What is AI explain under 100 words?").then((response) => {
    console.log(response.text);
  });
}

export async  function  testMistralAI() {
 await mistralModel.invoke("What is captial of INDIA?").then((response) => {
    console.log(response.text);
  });
}

export async  function  testchatgroqAI() {
 await chatgroqModel.invoke("What is captial of france?").then((response) => {
    console.log(response.text);
  });
}
