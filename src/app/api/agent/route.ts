import { NextRequest } from 'next/server';
import { determineIntent } from '@/lib/agents/orchestrator';
import { AGENT_PROMPTS } from '@/lib/agents/prompts';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || 'dummy_key' });

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

          // Format history for Groq
          const contents = (history || []).map((msg: { role: string; content: string }) => ({
            role: msg.role === 'user' ? 'user' : 'assistant',
            content: msg.content
          }));

          // Add current message
          contents.push({
            role: 'user',
            content: message
          });

          // 4. Stream response from Groq
          const streamResponse = await groq.chat.completions.create({
            messages: [
              { role: 'system', content: fullSystemPrompt },
              ...contents
            ],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.7,
            stream: true,
          });

          for await (const chunk of streamResponse) {
            const chunkText = chunk.choices[0]?.delta?.content || "";
            if (chunkText) {
              enqueueEvent('message', chunkText);
            }
          }

          // 5. Send done event
          enqueueEvent('done', '[DONE]');
          controller.close();
        } catch (error) {
          console.error("Agent Stream Error:", error);
          const err = error as { status?: number, message?: string };
          const isRateLimit = err?.status === 429 || err?.message?.includes('429');
          const errorMessage = isRateLimit 
            ? "⚠️ Groq API rate limit exceeded. Please wait a moment and try again."
            : "⚠️ Sorry, I am facing some technical difficulties. Please try again.";
          enqueueEvent('error', errorMessage);
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
