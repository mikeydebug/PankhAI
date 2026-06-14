import { GoogleGenerativeAI } from '@google/generative-ai';
import { AgentId } from './prompts';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy_key');
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

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
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim().toLowerCase();
    
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
