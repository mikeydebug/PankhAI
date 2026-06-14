"use client";

import { motion } from 'framer-motion';
import { AgentId } from '@/lib/agents/prompts';
import { MessageSquare, Users, Heart, HandHeart, Calendar, TrendingUp } from 'lucide-react';

const AGENT_NODES: Record<AgentId, { icon: React.ElementType; label: string; color: string; pos: { x: number; y: number } }> = {
  disha: { icon: MessageSquare, label: 'Disha', color: '#4F46E5', pos: { x: 50, y: 15 } },
  saathi: { icon: Users, label: 'Saathi', color: '#0D9488', pos: { x: 20, y: 40 } },
  awaaz: { icon: Heart, label: 'Awaaz', color: '#EA580C', pos: { x: 80, y: 40 } },
  aasha: { icon: HandHeart, label: 'Aasha', color: '#E11D48', pos: { x: 25, y: 75 } },
  udaan: { icon: Calendar, label: 'Udaan', color: '#0284C7', pos: { x: 75, y: 75 } },
  nazariya: { icon: TrendingUp, label: 'Nazariya', color: '#D97706', pos: { x: 50, y: 55 } },
};

interface Props {
  activeAgent: AgentId;
}

export function AgentNetworkPanel({ activeAgent }: Props) {
  return (
    <div className="w-full h-full min-h-[300px] relative bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-gray-200 dark:border-slate-700 overflow-hidden p-4">
      <h3 className="absolute top-4 left-6 font-display font-semibold text-gray-900 dark:text-white">
        Agent Network
      </h3>
      
      <div className="absolute inset-0 top-12">
        <svg className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          {/* Draw connection lines from Disha to all agents */}
          {Object.keys(AGENT_NODES).map((key) => {
            if (key === 'disha') return null;
            const node = AGENT_NODES[key as AgentId];
            const isActive = activeAgent === key;
            return (
              <motion.line
                key={`line-${key}`}
                x1="50%"
                y1="15%"
                x2={`${node.pos.x}%`}
                y2={`${node.pos.y}%`}
                stroke={isActive ? node.color : '#cbd5e1'}
                strokeWidth={isActive ? 3 : 1}
                strokeDasharray={isActive ? "5,5" : "none"}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1 }}
                className={`${isActive ? 'animate-pulse' : 'dark:stroke-slate-600'}`}
              />
            );
          })}
        </svg>

        {/* Draw Nodes */}
        {Object.entries(AGENT_NODES).map(([key, node]) => {
          const isActive = activeAgent === key;
          
          
          return (
            <motion.div
              key={key}
              className={`absolute w-12 h-12 -ml-6 -mt-6 rounded-full flex items-center justify-center bg-white shadow-md transition-shadow duration-300 ${isActive ? 'shadow-lg ring-4 ring-opacity-50 z-10' : 'z-0'}`}
              style={{
                left: `${node.pos.x}%`,
                top: `${node.pos.y}%`,
                color: node.color,
                borderColor: node.color,
                '--tw-ring-color': node.color
              } as React.CSSProperties}
              animate={{ scale: isActive ? 1.2 : 1 }}
            >
              <node.icon className="w-6 h-6" />
              {isActive && (
                <motion.div
                  className="absolute -inset-2 rounded-full border-2"
                  style={{ borderColor: node.color }}
                  animate={{ scale: [1, 1.5], opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                />
              )}
              <div className="absolute top-14 text-xs font-medium text-gray-700 dark:text-gray-300">
                {node.label}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
