import { NextRequest } from 'next/server';
import { determineIntent } from '@/lib/agents/orchestrator';
import { AGENT_PROMPTS } from '@/lib/agents/prompts';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy_key');
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { message, language, history } = await req.json();

    if (!message) {
      return new Response("Missing message", { status: 400 });
    }

    const encoder = new TextEncoder();
    
    const stream = new ReadableStream({
      async start(controller) {
        const enqueueEvent = (event: string, data: string) => {
          controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
        };

        try {
          // 1. Determine Intent
          const agentId = await determineIntent(message);
          
          // 2. Send routing event immediately so UI can update
          enqueueEvent('routing', agentId);

          // 3. Prepare Chat History & Prompt
          const systemPrompt = AGENT_PROMPTS[agentId];
          const langInstruction = language === 'hi' 
            ? "Respond entirely in Hindi (Devenagari script)." 
            : language === 'hinglish' 
            ? "Respond in Hinglish (a mix of Hindi written in English script and English)." 
            : "Respond in English.";

          const fullSystemPrompt = `${systemPrompt}\n\n${langInstruction}`;

          // Format history for Gemini
          const contents = (history || []).map((msg: { role: string; content: string }) => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
          }));

          // Add current message
          contents.push({
            role: 'user',
            parts: [{ text: message }]
          });

          // 4. Stream response from Gemini
          const chat = model.startChat({
            history: contents.slice(0, -1),
            systemInstruction: { role: 'system', parts: [{ text: fullSystemPrompt }] }
          });

          const result = await chat.sendMessageStream(message);

          for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            if (chunkText) {
              enqueueEvent('message', chunkText);
            }
          }

          // 5. Send done event
          enqueueEvent('done', '[DONE]');
          controller.close();
        } catch (error) {
          console.error("Agent Stream Error:", error);
          enqueueEvent('error', "Sorry, I am facing some technical difficulties. Please try again.");
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch {
    return new Response("Internal Server Error", { status: 500 });
  }
}
