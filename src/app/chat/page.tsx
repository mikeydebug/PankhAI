"use client";

import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { AgentNetworkPanel } from '@/components/AgentNetworkPanel';
import { AgentId } from '@/lib/agents/prompts';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Message = {
  id: string;
  role: 'user' | 'agent';
  content: string;
  agentId?: AgentId;
};

export default function ChatPage() {
  const { translations, language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [activeAgent, setActiveAgent] = useState<AgentId>('disha');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Prepare history
    const history = messages.map(m => ({ role: m.role, content: m.content }));

    try {
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.content, sessionId: 'session_1', language, history })
      });

      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      const currentAgentMessageId = Date.now().toString() + 1;
      let agentAssigned: AgentId = 'disha';

      setMessages(prev => [...prev, { id: currentAgentMessageId, role: 'agent', content: '', agentId: agentAssigned }]);

      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || ''; // Keep the last incomplete chunk in buffer

        for (const line of lines) {
          if (line.startsWith('event: ')) {
            const eventType = line.split('\n')[0].replace('event: ', '');
            const dataStr = line.split('\n')[1]?.replace('data: ', '');
            
            if (!dataStr) continue;
            
            try {
              const data = JSON.parse(dataStr);
              
              if (eventType === 'routing') {
                agentAssigned = data as AgentId;
                setActiveAgent(agentAssigned);
                setMessages(prev => prev.map(msg => 
                  msg.id === currentAgentMessageId ? { ...msg, agentId: agentAssigned } : msg
                ));
              } else if (eventType === 'message') {
                setMessages(prev => prev.map(msg => 
                  msg.id === currentAgentMessageId ? { ...msg, content: msg.content + data } : msg
                ));
              } else if (eventType === 'done' || eventType === 'error') {
                setIsLoading(false);
              }
            } catch (e) {
              console.error("Error parsing SSE data", e);
            }
          }
        }
      }
      
      // Default to disha when done
      setTimeout(() => setActiveAgent('disha'), 5000);

    } catch (error) {
      console.error("Chat error:", error);
      setIsLoading(false);
    }
  };

  const chips = [
    "How do I volunteer?",
    "Write an Instagram post for a food drive",
    "What impact does ₹500 make?",
    "Plan a clothes distribution event"
  ];

  return (
    <div className="flex-1 flex flex-col lg:flex-row h-full max-h-[calc(100vh-4rem)] bg-white dark:bg-slate-900">
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full border-r border-gray-200 dark:border-slate-800 relative">
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center relative shadow-lg shadow-primary/30">
                  <Bot className="w-10 h-10 text-white" />
                </div>
              </div>
              <h2 className="text-3xl font-display font-bold mb-3 text-gray-900 dark:text-white drop-shadow-sm">Welcome to the Pankh Squad</h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-md mb-10 text-lg">
                How can we help you create an impact today? Ask a question, plan an event, or get campaign ideas.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl w-full">
                {chips.map(chip => (
                  <button
                    key={chip}
                    onClick={() => { setInput(chip); }}
                    className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md hover:bg-white dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700 text-sm py-3 px-6 rounded-xl transition-all shadow-sm hover:shadow-md text-gray-800 dark:text-gray-200"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6 max-w-4xl mx-auto pb-20">
              <AnimatePresence>
                {messages.map(msg => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-gray-200 dark:bg-slate-700' : 'bg-primary text-white'}`}>
                      {msg.role === 'user' ? <User className="w-5 h-5 text-gray-500 dark:text-gray-300" /> : <Bot className="w-5 h-5" />}
                    </div>
                    <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} max-w-[80%]`}>
                      {msg.role === 'agent' && msg.agentId && (
                        <span className="text-xs font-medium uppercase tracking-wider text-gray-500 mb-1 ml-1">{msg.agentId}</span>
                      )}
                      <div className={`p-4 rounded-2xl whitespace-pre-wrap ${msg.role === 'user' ? 'bg-primary text-white rounded-tr-sm' : 'bg-gray-100 dark:bg-slate-800 dark:text-gray-100 rounded-tl-sm'}`}>
                        {msg.content || (msg.role === 'agent' && <Loader2 className="w-5 h-5 animate-spin" />)}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={translations.chat.placeholder}
              className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-full py-4 pl-6 pr-16 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 dark:text-white shadow-inner transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-2 p-2 bg-primary text-white rounded-full hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>

      {/* Agent Network Sidebar */}
      <div className="lg:w-96 w-full h-80 lg:h-full p-4 bg-gray-50 dark:bg-slate-900/50">
        <AgentNetworkPanel activeAgent={activeAgent} />
      </div>
      
    </div>
  );
}
