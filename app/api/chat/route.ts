import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
    try {
        const { messages } = await req.json();

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json(
                { error: "Invalid messages format" },
                { status: 400 }
            );
        }

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are NexusHub AI Assistant, a helpful chatbot for the NexusHub platform. 
NexusHub is a career growth platform that helps users:
- Track daily tasks and build streaks
- Collaborate on projects with teams
- Build portfolios and resumes
- Prepare for interviews with AI
- Track competitive programming stats

Be friendly, concise, and helpful. Keep responses under 150 words unless asked for details.`,
                },
                ...messages,
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 500,
            stream: false,
        });

        const responseMessage = completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";

        return NextResponse.json({ message: responseMessage });
    } catch (error: any) {
        console.error("Groq API Error:", error);
        return NextResponse.json(
            { error: "Failed to get response from AI" },
            { status: 500 }
        );
    }
}
