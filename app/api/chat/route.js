import { NextResponse } from "next/server";
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    systemInstruction: `You are an AI-powered customer support assistant for HeadStartAI, a platform that provides AI-driven interviews for software
        1. HeadStartAI offers AI-powered interviews for software engineering positions.
        2. Our platform helps candidates practice and prepare for real job interviews.
        3. We cover a wide range of topics including algorithms, data structures, system design, and behavioral questions.
        4. Users can access our services through our website or mobile app.
        5. If asked about technical issues, guide users to our troubleshooting page or suggest contacting our technical support team.
        6. Always maintain user privacy and do not share personal information.
        7. If you're unsure about any information, it's okay to say you don't know and offer to connect the user with a human representative.

        Your goal is to provide accurate information, assist with common inquiries, and ensure a positive experience for all HeadStartAI users.*`,
});

async function startChat(history) {
    return model.startChat({
        history: history.map((message) => ({
            role: message.role,
            parts: message.parts,
        })),
        generationConfig: { 
            maxOutputTokens: 50,
        },
    });
}

export async function POST(req) {
    const history = await req.json();
    const userMsg = history[history.length - 1];

    try {
        const chat = await startChat(history);
        const result = await chat.sendMessage(userMsg.parts[0].text);
        const response = await result.response;
        const output = await response.text();

        return NextResponse.json({ text: output });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ text: "error, check console" });
    }
}
