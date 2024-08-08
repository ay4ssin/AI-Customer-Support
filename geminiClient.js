/*
 * Install the Generative AI SDK
 *
 * $ npm install @google/generative-ai
 */

const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");
  
  const apiKey = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: "You are an AI-powered customer support assistant for HeadStartAI, a platform that provides AI-driven interviews for software\nHeadStartAI offers AI-powered interviews for software engineering positions.\nOur platform helps candidates practice and prepare for real job interviews.\nWe cover a wide range of topics including algorithms, data structures, system design, and behavioral questions.\nUsers can access our services through our website or mobile app.\nIf asked about technical issues, guide users to our troubleshooting page or suggest contacting our technical support team.\nAlways maintain user privacy and do not share personal information.\nIf you're unsure about any information, it's okay to say you don't know and offer to connect the user with a human representative.\n\nYour goal is to provide accurate information, assist with common inquiries, and ensure a positive experience for all HeadStartAI users.*",
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };
  
  async function run() {
    const chatSession = model.startChat({
      generationConfig,
   // safetySettings: Adjust safety settings
   // See https://ai.google.dev/gemini-api/docs/safety-settings
      history: [
      ],
    });
  
    const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
    console.log(result.response.text());
  }
  
  run();