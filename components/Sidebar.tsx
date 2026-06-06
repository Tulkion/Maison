import React from 'react';
import { LayoutDashboard, Scissors, Users, DollarSign, Sparkles, MessageCircle } from 'lucide-react';
import { ViewState } from '../types';

interface SidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView }) => {
  const menuItems = [
    { id: ViewState.DASHBOARD, label: 'Painel Geral', icon: LayoutDashboard },
    { id: ViewState.PRODUCTION, label: 'Produção & Prazos', icon: Scissors }, // Renamed and Icon changed
    { id: ViewState.CLIENTS, label: 'Clientes & CRM', icon: Users },
    { id: ViewState.FINANCE, label: 'Financeiro', icon: DollarSign },
    { id: ViewState.AI_STUDIO, label: 'Studio Criativo', icon: Sparkles },
    { id: ViewState.AI_CHAT, label: 'Consultora IA', icon: MessageCircle }, // New Item
  ];

  return (
    <aside className="w-64 bg-white border-r border-stone-200 min-h-screen flex flex-col fixed left-0 top-0 z-20">
      <div className="p-8 border-b border-stone-100">
        <h1 className="text-2xl font-bold text-rose-950 tracking-tight">Maison <span className="text-rose-400">Gestion</span></h1>
        <p className="text-xs text-stone-500 mt-1 uppercase tracking-widest">Fashion ERP</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onChangeView(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              currentView === item.id
                ? 'bg-rose-50 text-rose-900 shadow-sm font-medium'
                : 'text-stone-600 hover:bg-stone-50 hover:text-rose-800'
            }`}
          >
            <item.icon size={20} strokeWidth={1.5} />
            <span className="text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-stone-100">
        <div className="bg-stone-900 text-white p-4 rounded-lg shadow-lg">
          <p className="text-xs text-stone-300 mb-1">Status da Produção</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></div>
            <span className="text-sm font-semibold">Em Andamento</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
