<div align="center">
  
# 🪽 PankhAI 
**The Intelligent Multi-Agent Copilot for NayePankh Foundation**

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)
![Groq](https://img.shields.io/badge/AI-Groq%20Llama%203-f55036?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

*Empowering one of India's largest student-led NGOs through an ecosystem of specialized AI Agents.*

[Report Bug](https://github.com/mikeydebug/PankhAI/issues) · [Request Feature](https://github.com/mikeydebug/PankhAI/issues)

</div>

---

## 🌟 Overview

**PankhAI** is a state-of-the-art Multi-Agent AI platform built exclusively for the **NayePankh Foundation**, an 80G & 12A registered NGO dedicated to uplifting underprivileged communities across India. 

Instead of a generic chatbot, PankhAI features an intelligent **Orchestrator** that routes user queries to a network of **6 Specialized Agents**, each tailored to handle specific NGO operations like volunteer coordination, campaign generation, event planning, and impact analysis.

## 🤖 The Agent Network (Pankh Squad)

| Agent | Role | Expertise |
| :--- | :--- | :--- |
| **Disha** | *The Guide* | Welcomes users, handles general NGO inquiries, and provides overarching guidance. |
| **Saathi** | *Volunteer Coordinator* | Manages volunteer onboarding, skill-matching, and answers community participation queries. |
| **Awaaz** | *Campaign Strategist* | Crafts highly engaging social media posts, writes captions, and designs awareness campaigns. |
| **Aasha** | *Impact Analyst* | Calculates exact donation impact (e.g., "What does ₹500 do?") and explains 80G tax benefits. |
| **Udaan** | *Event Planner* | Generates step-by-step checklists, timelines, and logistical plans for distribution drives. |
| **Nazariya**| *Data Insights Lead* | Provides historical statistics, success metrics, and analytical summaries of the foundation's work. |

## ✨ Key Features

- 🧠 **Dynamic AI Routing**: Utilizes Groq's high-speed Llama 3 models to intelligently route user intent.
- ⚡ **Real-Time Streaming**: Server-Sent Events (SSE) provide ultra-fast, typewriter-style AI responses.
- 🌓 **Premium UI/UX**: Glassmorphism elements, fluid micro-animations, and full dark/light mode support.
- 🌍 **Multi-Lingual**: Native support for English, Hindi, and Hinglish.
- 🖨️ **Printable Assets**: Dedicated modules to export AI-generated event planners as branded PDFs.

## 💻 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS & Framer Motion
- **AI Engine**: Groq SDK (`llama-3.3-70b-versatile`)
- **Database**: Prisma (ORM)
- **Icons**: Lucide React

---

## 🚀 Local Setup

### 1. Clone the repository
```bash
git clone https://github.com/mikeydebug/PankhAI.git
cd PankhAI
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the root directory and add your Groq API key:
```env
GROQ_API_KEY=your_groq_api_key_here
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## ☁️ Deployment Guide (Vercel)

The easiest and most optimized way to deploy this Next.js application is through [Vercel](https://vercel.com/).

1. Push your code to your GitHub repository.
2. Log into [Vercel](https://vercel.com/) and click **Add New Project**.
3. Import your `PankhAI` repository from GitHub.
4. In the **Environment Variables** section, add your `GROQ_API_KEY`.
5. Click **Deploy**.

Vercel will automatically build and deploy your application. Every subsequent push to the `main` branch will trigger an automatic redeployment.

---

<div align="center">
  <p>Built with ❤️ for the NayePankh Foundation.</p>
</div>
