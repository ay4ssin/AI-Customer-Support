import { NextResponse } from "next/server";
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    systemInstruction: "You are a chatbot for the startup software tech company Headstarter. Use a friendly, supportive, and encouraging tone. Ensure explanations are clear and easy to understand",
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
