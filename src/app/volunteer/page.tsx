"use client";

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { Bot, Check, ChevronRight, Download, Users } from 'lucide-react';
import * as htmlToImage from 'html-to-image';
import confetti from 'canvas-confetti';

const SKILLS = ['Communication', 'Teaching', 'Logistics', 'Social Media', 'Design', 'Fundraising', 'Healthcare', 'Photography'];
const INTERESTS = ['Food Drives', 'Hygiene Campaigns', 'Education', 'Clothes Drives', 'Animal Welfare'];

export default function VolunteerOnboarding() {
  const { language } = useLanguage();
  const [step, setStep] = useState(1);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    skills: [] as string[],
    interests: [] as string[]
  });

  
  const [aiResponse, setAiResponse] = useState('');
  const [assignedRole, setAssignedRole] = useState('Community Volunteer');
  const idCardRef = useRef<HTMLDivElement>(null);

  const toggleArrayItem = (array: string[], item: string) => {
    if (array.includes(item)) return array.filter(i => i !== item);
    return [...array, item];
  };

  const handleSubmit = async () => {
    
    setStep(4); // Processing step

    try {
      const prompt = `A new volunteer named ${formData.name} wants to join. 
      Skills: ${formData.skills.join(', ')}. 
      Interests: ${formData.interests.join(', ')}.
      Please write a short, warm welcome message and recommend 2-3 specific roles for them.`;

      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt, sessionId: 'onboard_1', language, history: [] })
      });

      // Simple implementation: wait for the stream and aggregate
      if (response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let completeResponse = '';
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          const text = decoder.decode(value);
          const lines = text.split('\n\n');
          for (const line of lines) {
            if (line.startsWith('event: message')) {
              const data = JSON.parse(line.split('\n')[1].replace('data: ', ''));
              completeResponse += data;
              setAiResponse(completeResponse);
            }
          }
        }
      }

      // Determine a short role string for the ID card based on interests
      setAssignedRole(formData.interests[0] ? `${formData.interests[0]} Specialist` : 'Pankh Volunteer');
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      setStep(5); // Success step

    } catch (e) {
      console.error(e);
      setStep(3); // Go back on error
      
    }
  };

  const handleDownload = async () => {
    if (!idCardRef.current) return;
    try {
      const dataUrl = await htmlToImage.toPng(idCardRef.current, { quality: 1, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `${formData.name}_Pankh_ID.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export image', err);
    }
  };

  return (
    <div className="flex-1 min-h-[calc(100vh-4rem)] py-12 px-4 bg-gray-50 dark:bg-slate-900 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-teal-500/20 rounded-full blur-3xl" />

      <div className="max-w-4xl w-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200 dark:border-slate-700 overflow-hidden relative z-10">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-blue-800 px-10 py-8 text-white flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold">Join NayePankh</h1>
            <p className="text-primary-foreground/80 text-sm">Become a volunteer and give wings to the community</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <AnimatePresence mode="wait">
            
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-xl font-semibold mb-6 dark:text-white">Basic Details</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                    <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-3 bg-transparent dark:text-white" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                    <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-3 bg-transparent dark:text-white" placeholder="john@example.com" />
                  </div>
                  <button onClick={() => setStep(2)} disabled={!formData.name || !formData.email} className="w-full bg-primary text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 mt-8 disabled:opacity-50 hover:bg-blue-800 transition-colors">
                    Next <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-xl font-semibold mb-6 dark:text-white">What are your skills?</h2>
                <div className="flex flex-wrap gap-3 mb-8">
                  {SKILLS.map(skill => (
                    <button key={skill} onClick={() => setFormData({...formData, skills: toggleArrayItem(formData.skills, skill)})} className={`px-4 py-2 rounded-full border ${formData.skills.includes(skill) ? 'bg-primary text-white border-primary' : 'border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:border-primary transition-colors'}`}>
                      {skill}
                    </button>
                  ))}
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setStep(1)} className="flex-1 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-white py-3 rounded-lg font-medium">Back</button>
                  <button onClick={() => setStep(3)} disabled={formData.skills.length === 0} className="flex-[2] bg-primary text-white py-3 rounded-lg font-medium disabled:opacity-50 hover:bg-blue-800 transition-colors">Next</button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-xl font-semibold mb-6 dark:text-white">What interests you most?</h2>
                <div className="flex flex-wrap gap-3 mb-8">
                  {INTERESTS.map(interest => (
                    <button key={interest} onClick={() => setFormData({...formData, interests: toggleArrayItem(formData.interests, interest)})} className={`px-4 py-2 rounded-full border ${formData.interests.includes(interest) ? 'bg-accent text-white border-accent' : 'border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:border-accent transition-colors'}`}>
                      {interest}
                    </button>
                  ))}
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setStep(2)} className="flex-1 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-white py-3 rounded-lg font-medium">Back</button>
                  <button onClick={handleSubmit} disabled={formData.interests.length === 0} className="flex-[2] bg-primary text-white py-3 rounded-lg font-medium disabled:opacity-50 hover:bg-blue-800 transition-colors">Submit</button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-12 text-center">
                <div className="relative">
                  <div className="w-20 h-20 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center animate-pulse">
                    <Bot className="w-10 h-10 text-teal-600" />
                  </div>
                  <motion.div className="absolute inset-0 border-4 border-teal-500 rounded-full border-t-transparent" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} />
                </div>
                <h3 className="text-xl font-display font-bold mt-6 text-gray-900 dark:text-white">Saathi is reviewing your profile...</h3>
                <p className="text-gray-500 mt-2">Finding the best roles for you at NayePankh Foundation.</p>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div key="step5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                  <Check className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-display font-bold mb-6 text-center dark:text-white">Welcome to the Team, {formData.name}!</h2>
                
                <div className="bg-gray-50 dark:bg-slate-800/50 rounded-xl p-6 mb-8 w-full border border-gray-100 dark:border-slate-700">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{aiResponse}</p>
                </div>

                <div className="w-full flex justify-center mb-8">
                  {/* ID Card to capture */}
                  <div ref={idCardRef} className="w-[300px] h-[450px] bg-gradient-to-b from-primary to-blue-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden flex flex-col items-center justify-between">
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent" />
                    
                    <div className="text-center relative z-10 w-full pt-4 border-b border-white/20 pb-4">
                      <div className="font-display font-bold text-xl tracking-tight">PankhAI</div>
                      <div className="text-[10px] uppercase tracking-widest text-blue-200">NayePankh Foundation</div>
                    </div>

                    <div className="relative z-10 flex flex-col items-center mt-4">
                      <div className="w-24 h-24 bg-white/10 rounded-full border-2 border-white/30 flex items-center justify-center mb-4 backdrop-blur-md">
                        <Users className="w-10 h-10 text-white/80" />
                      </div>
                      <h3 className="font-bold text-2xl text-center leading-tight mb-1">{formData.name}</h3>
                      <div className="bg-accent text-white text-xs px-3 py-1 rounded-full uppercase tracking-wider font-semibold">
                        {assignedRole}
                      </div>
                    </div>

                    <div className="relative z-10 w-full mt-auto pt-6 text-center">
                      <div className="text-[10px] text-blue-200">ID: NPF-{Math.floor(Math.random() * 90000) + 10000}</div>
                      <div className="text-[10px] text-blue-200">Valid: {new Date().getFullYear()} - {new Date().getFullYear() + 1}</div>
                    </div>
                  </div>
                </div>

                <button onClick={handleDownload} className="flex items-center gap-2 bg-accent text-white px-8 py-3 rounded-full font-medium hover:bg-orange-600 transition-colors">
                  <Download className="w-5 h-5" /> Download ID Card
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
