
import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
    try {
        const { text, type } = await req.json();

        if (!text) {
            return NextResponse.json(
                { error: "Text is required" },
                { status: 400 }
            );
        }

        let systemPrompt = "";

        if (type === "summary") {
            systemPrompt = `You are an expert professional resume writer. 
            Rewrite the following professional summary to be more impactful, concise, and professional.
            - Use strong action verbs.
            - Focus on achievements and skills.
            - Keep it under 100 words.
            - Return ONLY the rewritten text, no explanations or quotes.`;
        } else {
            // Fallback or generic enhance
            systemPrompt = `Improve the clarity and professionalism of the following text. Return ONLY the improved text.`;
        }

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: systemPrompt,
                },
                {
                    role: "user",
                    content: text,
                },
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.5,
            max_tokens: 200,
            stream: false,
        });

        const enhancedText = completion.choices[0]?.message?.content || text;

        return NextResponse.json({ enhancedText });
    } catch (error: any) {
        console.error("Groq API Error:", error);
        return NextResponse.json(
            { error: "Failed to enhance text" },
            { status: 500 }
        );
    }
}
