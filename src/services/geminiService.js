// import { GoogleGenAI } from "@google/genai";
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});
module.exports = async (codeBlock, operation) => {
  console.log("Code block:", codeBlock);
  console.log("Operation:", operation);
  console.log(process.env.GEMINI_API_KEY);

  const prompts = {
    execute: `Execute the following code and provide the output: ${codeBlock}`,
    explain: `Explain the following code: ${codeBlock}`,
    debug: `Debug the following code: ${codeBlock}`,
    optimise: `Optimize the following code: ${codeBlock}`,
    test: `Generate test cases for the following code: ${codeBlock}`,
  };

  if (Object.keys(prompts).includes(operation) === false) {
    return "Invalid operation";
  }
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash-lite",
    contents: prompts[operation],
    parameters: {
      temperature: 0.7,
      maxOutputTokens: 1000,
      topP: 0.9,
      topK: 40,
      stopSequences: ["\n"],
    },
  });
  console.log(response.text);
  return response.text;
};
