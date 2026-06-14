# PankhAI

PankhAI is a specialized, multi-agent AI assistant platform designed for the **NayePankh Foundation** — one of India's largest student-led NGOs focused on giving wings to underprivileged communities.

This project delivers a state-of-the-art MVP, complete with a beautiful UI, multi-agent orchestration, and real-time streaming using Google Gemini and Next.js 14.

## Core Features

- **Pankh Squad**: A team of 6 specialized AI agents (Disha, Saathi, Awaaz, Aasha, Udaan, Nazariya).
- **Agent Network Visualization**: Live interactive map showing routing handoffs from Disha to specialist agents.
- **Volunteer Onboarding**: Multi-step AI matching, yielding a downloadable NayePankh Volunteer ID card.
- **Campaign Studio**: AI-generated social posts with tone control and one-click image export.
- **Donation Calculator**: Real-time impact analysis (meals, pads) with 80G tax benefit highlights.
- **Event Planner**: AI-generated structured event checklists and PDF export.
- **Insights Dashboard**: Recharts integration with Nazariya's automated weekly AI summaries.
- **Localization**: Native support for English, Hindi (हिंदी), and Hinglish (LanguageContext).

## Architecture

PankhAI relies on a unified Next.js App Router API endpoint for handling SSE (Server-Sent Events) streams without WebSockets.

\`\`\`mermaid
graph TD
    User([User Input]) --> Disha[Disha: Orchestrator Agent]
    Disha -- Intent Routing --> Specialist
    
    subgraph Pankh Squad
        Specialist{Specialist Agent}
        Specialist --> Saathi[Saathi: Volunteer Concierge]
        Specialist --> Awaaz[Awaaz: Campaign Creator]
        Specialist --> Aasha[Aasha: Donation Guide]
        Specialist --> Udaan[Udaan: Event Planner]
        Specialist --> Nazariya[Nazariya: Insights Analyst]
    end
    
    Specialist --> SSE[SSE Stream]
    SSE --> UI([Client Interface])
\`\`\`

## Quick Start

### 1. Requirements
- Node.js (v18+)
- npm / pnpm / yarn

### 2. Setup
Clone the repo and install dependencies:
\`\`\`bash
npm install
\`\`\`

### 3. Environment Variables
Copy the \`.env.example\` file:
\`\`\`bash
cp .env.example .env
\`\`\`
Ensure your \`GEMINI_API_KEY\` is populated in the \`.env\` file.

### 4. Database Setup
PankhAI uses Prisma with SQLite for local development. To apply the schema:
\`\`\`bash
npx prisma db push
npx prisma generate
\`\`\`

> **Production Note**: To swap SQLite for Postgres/Neon in production, update the \`provider\` in \`prisma/schema.prisma\` from \`"sqlite"\` to \`"postgresql"\` and set the \`DATABASE_URL\` to your Neon connection string.

### 5. Run the Server
\`\`\`bash
npm run dev
\`\`\`
The application will be available at \`http://localhost:3000\`.

## The Agents

| Agent | Hindi Meaning | Role | Color Profile |
|-------|---------------|------|---------------|
| **Disha** | Direction | Lead Orchestrator & Router | Indigo |
| **Saathi** | Companion | Volunteer Concierge | Teal |
| **Awaaz** | Voice | Campaign Post Creator | Orange |
| **Aasha** | Hope | Donation Impact Guide | Rose |
| **Udaan** | Flight | Event Planner | Sky Blue |
| **Nazariya** | Perspective | Data Insights Analyst | Amber |

## Future Roadmap
- Voice input integration via Web Speech API.
- Native React Native / PWA app.
- Direct database connection to NayePankh's CRM for real-time live data metrics.
- Multi-lingual audio output.

## Code Quality
This project enforces strict typing, ESLint checks (zero warnings), and employs Radix UI concepts layered with pure Tailwind. All responsive flows have been manually tested.
