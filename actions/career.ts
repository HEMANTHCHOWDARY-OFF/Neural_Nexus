'use server';

import Groq from 'groq-sdk';
import mammoth from 'mammoth';

const groqScreener = new Groq({
    apiKey: process.env.GROQ_API_KEY_SCREENER,
});

const groqQuestions = new Groq({
    apiKey: process.env.GROQ_API_KEY_QUESTIONS,
});

const groqInterview = new Groq({
    apiKey: process.env.GROQ_API_KEY_INTERVIEW,
});

async function extractText(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mimeType = file.type;

    try {
        if (mimeType === 'application/pdf') {
            // @ts-ignore
            const pdf = require('pdf-parse');
            const data = await pdf(buffer);
            return data.text;
        } else if (
            mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
            mimeType === 'application/msword'
        ) {
            const result = await mammoth.extractRawText({ buffer });
            return result.value;
        } else {
            throw new Error('Unsupported file type. Please upload PDF or DOCX.');
        }
    } catch (error) {
        console.error('Error extracting text:', error);
        throw new Error('Failed to extract text from file.');
    }
}

export async function analyzeResume(prevState: any, formData: FormData) {
    try {
        const file = formData.get('resume') as File;
        if (!file) {
            return { error: 'No file uploaded' };
        }

        const resumeText = await extractText(file);

        if (!resumeText || resumeText.trim().length < 50) {
            return { error: 'Insufficient text extracted from resume. File might be empty.' };
        }

        const prompt = `You are an expert Resume ATS Scanner and Career Coach. Analyze the following resume text and provide a DETAILED assessment in pure JSON format.
    
    Resume Text:
    "${resumeText.replace(/"/g, '\\"').substring(0, 15000)}"

    Your task is to populate the following JSON structure exactly:
    {
      "atsScore": number (0-100),
      "keywords": ["keyword1", "keyword2", ...],
      "overallScore": number (0-100),
      "feedback": ["actionable point 1", "actionable point 2", "strength 1", "weakness 1"]
    }

    Scoring Criteria:
    - atsScore: How well the resume parses for ATS systems (formatting, keywords, standard sections).
    - overallScore: The quality of content, impact, metrics, and professional tone.
    - keywords: List 5-10 specific technical or soft skills found or missing that are relevant.
    - feedback: Provide 3-5 specific, constructive comments on how to improve the resume.

    CRITICAL INSTRUCTIONS:
    - Respond ONLY with the VALID JSON object.
    - Do NOT wrap the output in markdown code blocks (like \`\`\`json).
    - Do NOT add any preamble or postscript text.
    - Verify the JSON validity before outputting.`;

        const completion = await groqScreener.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.2,
        });

        const responseText = completion.choices[0]?.message?.content || '{}';
        // Clean markdown if present
        const jsonStr = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

        const analysis = JSON.parse(jsonStr);

        return { success: true, data: analysis, originalText: resumeText.substring(0, 500) + '...' };

    } catch (error: any) {
        console.error('Analysis error:', error);
        return { error: error.message || 'Failed to analyze resume' };
    }
}

export async function generateInterviewQuestions(prevState: any, formData: FormData) {
    try {
        const file = formData.get('resume') as File;
        const manualTopic = formData.get('topic') as string;
        const manualRole = formData.get('role') as string;
        const manualDifficulty = formData.get('difficulty') as string || 'Medium';
        const manualCount = formData.get('count') || '5';

        let contextText = '';
        let prompt = '';

        if (file && file.size > 0) {
            contextText = await extractText(file);
            prompt = `Based on the following resume, generate exactly 5 conversational, open-ended interview questions.
    
            Resume Content:
            ${contextText.substring(0, 10000)}
            
            Instructions:
            1. Questions should be technically relevant but phrased for a spoken interview.
            2. Target Difficulty Level: Medium.
            3. Questions should be open-ended.
            `;
        } else if (manualTopic || manualRole) {
            prompt = `Generate exactly ${manualCount} interview questions for a ${manualRole || 'Professional'} candidate focusing on ${manualTopic || 'General Skills'}.
    
            Instructions:
            1. Target Difficulty Level: ${manualDifficulty}.
            2. Questions should be technical or behavioral as appropriate for the topic.
            3. Be clear and concise.
            `;
        } else {
            return { error: 'Please upload a resume OR provide a Job Role/Topic.' };
        }

        prompt += `
        Please format each question as:
        Question: [question text]
        Type: [Technical/Behavioral/Situational]
        Difficulty: [${manualDifficulty}]
        Based On: [Resume/Topic]
        
        Separate each question with ---`;

        const completion = await groqQuestions.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'llama-3.3-70b-versatile',
        });

        const text = completion.choices[0]?.message?.content || '';
        const questions = parseGeneratedQuestions(text, 'Technical', manualDifficulty);

        return { success: true, questions };

    } catch (error: any) {
        console.error('Interview gen error:', error);
        return { error: error.message || 'Failed to generate questions' };
    }
}

function parseGeneratedQuestions(text: string, defaultType: string, defaultDifficulty: string) {
    const questions = [];
    const sections = text.split('---').map(s => s.trim()).filter(s => s);

    for (const section of sections) {
        const lines = section.split('\n').map(l => l.trim()).filter(l => l);
        let question = '';
        let type = defaultType;
        let difficulty = defaultDifficulty;
        let basedOn = '';

        for (const line of lines) {
            if (line.startsWith('Question:')) {
                question = line.replace('Question:', '').trim();
            } else if (line.startsWith('Type:')) {
                type = line.replace('Type:', '').trim();
            } else if (line.startsWith('Difficulty:')) {
                difficulty = line.replace('Difficulty:', '').trim();
            } else if (line.startsWith('Based On:')) {
                basedOn = line.replace('Based On:', '').trim();
            }
        }

        if (question) {
            questions.push({ question, type, difficulty, basedOn });
        }
    }
    return questions;
}

export async function chatInterview(messages: any[], type: string) {
    try {
        const systemPrompt = `You are an expert interviewer conducting a ${type} interview.
        You are professional, encouraging, but rigorous.
        
        Your Goal:
        1. Evaluate the candidate's last answer (if any). Provide brief, constructive feedback.
        2. Ask the next relevant question (Technical, Behavioral, or Situational based on the interview type).
        3. Keep the conversation flowing naturally.
        
        Format your response as a JSON object:
        {
            "feedback": "Feedback on the previous answer... (or null if start)",
            "nextQuestion": "The next question to ask..."
        }
        
        Do NOT output markdown. Output ONLY raw JSON.`;

        const completion = await groqInterview.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                ...messages
            ],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.7,
            response_format: { type: 'json_object' }
        });

        const responseContent = completion.choices[0]?.message?.content || '{}';
        return { success: true, data: JSON.parse(responseContent) };

    } catch (error: any) {
        console.error('Chat interview error:', error);
        return { error: error.message || 'Failed to process interview chat.' };
    }
}
