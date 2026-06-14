"use client";

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,  } from 'recharts';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { TrendingUp, Users, Heart, Bot } from 'lucide-react';

const mockLineData = [
  { name: 'Mon', signups: 12 },
  { name: 'Tue', signups: 19 },
  { name: 'Wed', signups: 15 },
  { name: 'Thu', signups: 22 },
  { name: 'Fri', signups: 35 },
  { name: 'Sat', signups: 48 },
  { name: 'Sun', signups: 42 },
];

const mockPieData = [
  { name: 'Food Drives', value: 35 },
  { name: 'Hygiene', value: 25 },
  { name: 'Education', value: 20 },
  { name: 'Animal Welfare', value: 15 },
  { name: 'Clothes', value: 5 },
];



const COLORS = ['#1E40AF', '#F59E0B', '#0D9488', '#E11D48', '#8B5CF6'];

export default function AdminDashboard() {
  const { language } = useLanguage();
  const [aiSummary, setAiSummary] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const prompt = `Analyze this week's data for NayePankh Foundation:
        - 193 new volunteer signups (peak on weekends).
        - Top interest: Food Drives (35%) and Hygiene (25%).
        - 105 campaign posts generated, mostly for Instagram.
        Write a brief, encouraging 3-sentence summary for the admin dashboard as the insights agent, Nazariya.`;

        const response = await fetch('/api/agent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: prompt, sessionId: 'admin_1', language, history: [] })
        });

        if (response.body) {
          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let completeResponse = '';
          while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            const text = decoder.decode(value);
            const lines = text.split('\\n\\n');
            for (const line of lines) {
              if (line.startsWith('event: message')) {
                try {
                  const data = JSON.parse(line.split('\\n')[1].replace('data: ', ''));
                  completeResponse += data;
                  setAiSummary(completeResponse);
                } catch {}
              }
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch summary", error);
        setAiSummary("Data looks great this week. Volunteer signups are trending up!");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSummary();
  }, [language]);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-slate-900 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">Insights Dashboard</h1>
            <p className="text-gray-500">Real-time metrics and AI analysis</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white dark:bg-slate-800 px-6 py-3 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm flex items-center gap-3">
              <Users className="w-5 h-5 text-primary" />
              <div>
                <div className="text-xs text-gray-500 uppercase font-semibold">Total Volunteers</div>
                <div className="text-xl font-bold dark:text-white">12,450</div>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 px-6 py-3 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm flex items-center gap-3">
              <Heart className="w-5 h-5 text-rose-500" />
              <div>
                <div className="text-xs text-gray-500 uppercase font-semibold">People Helped</div>
                <div className="text-xl font-bold dark:text-white">2.1L+</div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Summary Card */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800/30 rounded-2xl p-6 mb-10 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 opacity-10">
            <TrendingUp className="w-48 h-48 text-amber-600" />
          </div>
          <div className="flex items-center gap-3 mb-4 relative z-10">
            <div className="w-10 h-10 bg-amber-200 dark:bg-amber-800 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-amber-700 dark:text-amber-300" />
            </div>
            <div>
              <h2 className="font-bold text-amber-900 dark:text-amber-100">Nazariya&apos;s Weekly Analysis</h2>
              <p className="text-xs text-amber-700 dark:text-amber-300/80 uppercase tracking-wider font-semibold">Insights Agent</p>
            </div>
          </div>
          <p className="text-amber-800 dark:text-amber-200/90 text-lg relative z-10 max-w-4xl leading-relaxed">
            {isLoading ? "Analyzing weekly data..." : aiSummary}
          </p>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          {/* Line Chart */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm">
            <h3 className="font-bold text-gray-900 dark:text-white mb-6">Volunteer Signups (This Week)</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockLineData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Line type="monotone" dataKey="signups" stroke="#1E40AF" strokeWidth={4} dot={{r: 4, fill: '#1E40AF', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col">
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Interest Distribution</h3>
            <div className="flex-1 min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={mockPieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {mockPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {mockPieData.map((entry, index) => (
                <div key={index} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                  <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[index % COLORS.length]}}></div>
                  {entry.name}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Registrations Table */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-slate-700">
            <h3 className="font-bold text-gray-900 dark:text-white">Recent Volunteer Registrations</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-slate-800/50 text-gray-500 dark:text-gray-400">
                <tr>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Email</th>
                  <th className="px-6 py-4 font-medium">Top Skills</th>
                  <th className="px-6 py-4 font-medium">AI Recommended Role</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                <tr className="hover:bg-gray-50 dark:hover:bg-slate-800/50">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">Aarav Sharma</td>
                  <td className="px-6 py-4 text-gray-500">aarav.s@example.com</td>
                  <td className="px-6 py-4"><span className="bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded text-xs">Logistics</span></td>
                  <td className="px-6 py-4"><span className="text-primary font-medium">Food Drive Coordinator</span></td>
                  <td className="px-6 py-4 text-gray-500">Just now</td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-slate-800/50">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">Priya Patel</td>
                  <td className="px-6 py-4 text-gray-500">priya.p@example.com</td>
                  <td className="px-6 py-4"><span className="bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded text-xs">Social Media</span></td>
                  <td className="px-6 py-4"><span className="text-orange-600 font-medium">Campaign Assistant</span></td>
                  <td className="px-6 py-4 text-gray-500">2 hours ago</td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-slate-800/50">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">Rohan Gupta</td>
                  <td className="px-6 py-4 text-gray-500">rohan.g@example.com</td>
                  <td className="px-6 py-4"><span className="bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded text-xs">Teaching</span></td>
                  <td className="px-6 py-4"><span className="text-teal-600 font-medium">Education Mentor</span></td>
                  <td className="px-6 py-4 text-gray-500">Yesterday</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
