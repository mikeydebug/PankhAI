import Groq from 'groq-sdk';
import { AgentId } from './prompts';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || 'dummy_key' });

export async function determineIntent(message: string): Promise<AgentId> {
  const prompt = `
You are the router for the NayePankh Foundation AI Platform.
Analyze the user's message and determine which specialized agent should handle it.
Reply with EXACTLY ONE of the following words (lowercase) and nothing else:

- disha: For general questions about the NGO, greetings, or unclear queries.
- saathi: For volunteering queries, how to join, skill matching, or onboarding.
- awaaz: For creating social media posts, campaigns, captions, or hashtags.
- aasha: For calculating donation impact, asking what ₹X can do, or tax benefits (80G).
- udaan: For planning events, drives, or needing a checklist/timeline.
- nazariya: For asking about statistics, insights, data, or summaries of NGO impact.

User Message: "${message}"
`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0,
    });
    
    const text = (completion.choices[0]?.message?.content || "").trim().toLowerCase();
    
    const validAgents: AgentId[] = ['disha', 'saathi', 'awaaz', 'aasha', 'udaan', 'nazariya'];
    if (validAgents.includes(text as AgentId)) {
      return text as AgentId;
    }
    return 'disha'; // Fallback
  } catch (error) {
    console.error("Error determining intent:", error);
    return 'disha'; // Fallback
  }
}
