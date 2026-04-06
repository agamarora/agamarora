// Import the correct Groq SDK library using CommonJS syntax
const Groq = require("groq-sdk");
require('dotenv').config();

// Define the Netlify serverless function
exports.handler = async (event) => {
  try {
    // Log that handler is invoked
    // console.log("Handler invoked with event:", event);

    // Extract the prompt and systemPrompt from the request body
    const { prompt, systemPrompt } = JSON.parse(event.body);
    console.log("Extracted Prompt:", prompt);
    // console.log("Extracted System Prompt:", systemPrompt);

    // Initialize the Groq client with the API key from the environment
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });

    // Send the prompt to Groq and get a response
    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      max_tokens: 100,
      temperature: 0.9,
      messages: [
        {
            role: "system",
            content: systemPrompt
        },
        {
          role: "user",
          content: prompt
        }
      ],
    });
    console.log("Groq Response:", response.choices[0].message.content);

    // Return the response from Groq
    return {
      statusCode: 200,
      body: JSON.stringify({ result: response.choices[0].message.content })
    };
  } catch (error) {
    console.error("Error occurred:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Something went wrong!' })
    };
  }
};
