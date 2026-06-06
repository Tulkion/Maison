import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { TrendingUp, Package, Users, AlertCircle, Sparkles, Scissors } from 'lucide-react';
import { Product, Transaction } from '../types';
import { analyzeBusinessInsights } from '../services/geminiService';

interface DashboardProps {
  products: Product[]; // Kept type but usage is abstract
  transactions: Transaction[];
}

export const DashboardView: React.FC<DashboardProps> = ({ products, transactions }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);

  // Metrics Calculation
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  // We are simulating Active Projects via the mock product prop or just hardcoding for the dashboard view for now
  // since the prompt asked to change Inventory to Project Management, the Dashboard needs to reflect this shift vaguely.
  const activeProjectsCount = 2; // Derived from App state effectively

  // Mock data for chart if not enough transaction data
  const data = [
    { name: 'Seg', producao: 12 },
    { name: 'Ter', producao: 18 },
    { name: 'Qua', producao: 15 },
    { name: 'Qui', producao: 22 },
    { name: 'Sex', producao: 20 },
    { name: 'Sab', producao: 8 },
  ];

  const handleGenerateInsight = async () => {
    setLoadingInsight(true);
    // Updated signature for insights
    const result = await analyzeBusinessInsights(totalIncome, activeProjectsCount);
    setInsight(result);
    setLoadingInsight(false);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl text-stone-800 mb-2">Bom dia, Gestora</h2>
          <p className="text-stone-500">Visão geral do Atelier e Produção.</p>
        </div>
        <button 
          onClick={handleGenerateInsight}
          disabled={loadingInsight}
          className="flex items-center gap-2 bg-gradient-to-r from-rose-400 to-rose-500 text-white px-6 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all disabled:opacity-70"
        >
          <Sparkles size={18} />
          {loadingInsight ? 'Consultando IA...' : 'Pedir Análise da Produção'}
        </button>
      </div>

      {/* AI Insight Box */}
      {insight && (
        <div className="bg-white border border-rose-100 p-6 rounded-xl shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-rose-400"></div>
          <h3 className="text-lg font-semibold text-rose-900 mb-3 flex items-center gap-2">
            <Sparkles size={18} className="text-rose-400" />
            Insights da Consultora IA
          </h3>
          <div className="prose prose-sm prose-rose text-stone-600 max-w-none">
            <pre className="whitespace-pre-wrap font-sans text-sm">{insight}</pre>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100 flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-stone-500">Entradas (Mês)</p>
              <h3 className="text-2xl font-bold text-stone-800 mt-1">R$ {totalIncome.toLocaleString('pt-BR')}</h3>
            </div>
            <div className="p-2 bg-green-50 rounded-lg text-green-600">
              <TrendingUp size={20} />
            </div>
          </div>
          <p className="text-xs text-green-600 flex items-center gap-1">
            +12% vs mês anterior
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100 flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-stone-500">Coleções Ativas</p>
              <h3 className="text-2xl font-bold text-stone-800 mt-1">{activeProjectsCount}</h3>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <Package size={20} />
            </div>
          </div>
          <p className="text-xs text-stone-400">Em produção</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100 flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-stone-500">Peças Pilotadas</p>
              <h3 className="text-2xl font-bold text-stone-800 mt-1">15</h3>
            </div>
            <div className="p-2 bg-amber-50 rounded-lg text-amber-500">
              <Scissors size={20} />
            </div>
          </div>
          <p className="text-xs text-amber-500 cursor-pointer">Ver timeline</p>
        </div>

         <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100 flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-stone-500">Prazos Próximos</p>
              <h3 className="text-2xl font-bold text-stone-800 mt-1">1</h3>
            </div>
            <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
              <AlertCircle size={20} />
            </div>
          </div>
          <p className="text-xs text-stone-400">Entrega em 5 dias</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
        <h3 className="text-lg font-semibold text-stone-800 mb-6">Produtividade da Oficina (Peças/Dia)</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#78716C', fontSize: 12}} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#78716C', fontSize: 12}} 
              />
              <Tooltip 
                cursor={{fill: '#FFF1F2'}}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="producao" fill="#FB7185" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
