"use client";

import { useLanguage } from '@/lib/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Heart, Users, MessageSquare, HandHeart, Calendar, TrendingUp, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const squad = [
  { id: 'disha', name: 'Disha (दिशा)', meaning: 'Direction', icon: MessageSquare, color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400', role: 'Orchestrator' },
  { id: 'saathi', name: 'Saathi (साथी)', meaning: 'Companion', icon: Users, color: 'bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400', role: 'Volunteer Concierge' },
  { id: 'awaaz', name: 'Awaaz (आवाज़)', meaning: 'Voice', icon: Heart, color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400', role: 'Campaign Creator' },
  { id: 'aasha', name: 'Aasha (आशा)', meaning: 'Hope', icon: HandHeart, color: 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400', role: 'Donation Guide' },
  { id: 'udaan', name: 'Udaan (उड़ान)', meaning: 'Flight', icon: Calendar, color: 'bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400', role: 'Event Planner' },
  { id: 'nazariya', name: 'Nazariya (नज़रिया)', meaning: 'Perspective', icon: TrendingUp, color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400', role: 'Insights Agent' }
];

export default function Home() {
  const { translations } = useLanguage();

  return (
    <div className="flex flex-col items-center w-full">
      {/* Hero Section */}
      <section className="w-full max-w-6xl mx-auto px-4 py-20 md:py-32 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary dark:bg-primary/20 dark:text-blue-300 font-medium text-sm mb-6">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </span>
            {translations.stats.status}
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-bold text-gray-900 dark:text-white leading-tight mb-6 max-w-4xl">
            {translations.hero.title}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10">
            {translations.hero.subtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/chat">
              <button className="flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-full font-semibold hover:bg-blue-800 transition-colors shadow-lg shadow-primary/30 w-full sm:w-auto">
                {translations.hero.ctaChat}
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
            <Link href="/volunteer">
              <button className="flex items-center justify-center gap-2 bg-white text-gray-900 border border-gray-200 dark:bg-slate-800 dark:text-white dark:border-slate-700 px-8 py-4 rounded-full font-semibold hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors w-full sm:w-auto">
                {translations.hero.ctaVolunteer}
              </button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="w-full bg-primary text-white py-12">
        <div className="max-w-6xl mx-auto px-4 flex flex-col items-center">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-display font-bold text-accent"
          >
            {translations.stats.peopleHelped}
          </motion.h2>
        </div>
      </section>

      {/* Meet the Squad */}
      <section className="w-full max-w-6xl mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">
            {translations.squad.title}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {translations.squad.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {squad.map((agent, index) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative bg-white dark:bg-slate-800 rounded-3xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-6 opacity-5 dark:opacity-10 transform group-hover:scale-150 transition-transform duration-500 pointer-events-none">
                <agent.icon className="w-32 h-32" />
              </div>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${agent.color}`}>
                <agent.icon className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-1">
                {agent.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 font-medium uppercase tracking-wider">
                {agent.role}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
