import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { ProductionView } from './components/InventoryView'; // Renamed Logic
import { ClientsView } from './components/ClientsView';
import { AIStudioView } from './components/AIStudioView';
import { AIChatView } from './components/AIChatView';
import { Client, Transaction, ViewState, CollectionProject } from './types';
import { Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);

  // Mock Projects Data (Replacing Products)
  const [projects, setProjects] = useState<CollectionProject[]>([
    {
      id: '1',
      clientName: 'Cliente A',
      collectionName: 'Verão 2025 - Natural Vibe',
      deadline: '15/10/2024',
      budget: 15000,
      status: 'active',
      stages: [
        { id: 's1', name: 'Briefing & Conceito', status: 'completed', date: '01/08/2024', notes: 'Aprovado' },
        { id: 's2', name: 'Compra de Materiais', status: 'completed', date: '10/08/2024', notes: 'Linho belga' },
        { id: 's3', name: 'Modelagem e Pilotagem', status: 'in_progress', date: '25/08/2024', notes: 'Ajuste na manga da peça piloto' },
        { id: 's4', name: 'Corte', status: 'pending', date: '30/08/2024' },
        { id: 's5', name: 'Costura', status: 'pending', date: '10/09/2024' },
        { id: 's6', name: 'Controle de Qualidade', status: 'pending', date: '20/09/2024' },
      ]
    },
    {
      id: '2',
      clientName: 'Cliente B',
      collectionName: 'Cápsula Alfaiataria',
      deadline: '05/09/2024',
      budget: 8000,
      status: 'active',
      stages: [
        { id: 's1', name: 'Briefing & Conceito', status: 'completed', date: '15/07/2024' },
        { id: 's2', name: 'Modelagem', status: 'completed', date: '20/07/2024' },
        { id: 's3', name: 'Corte', status: 'completed', date: '25/07/2024' },
        { id: 's4', name: 'Costura', status: 'in_progress', date: '10/08/2024', notes: 'Aguardando botões' },
        { id: 's5', name: 'Entrega', status: 'pending', date: '05/09/2024' },
      ]
    }
  ]);

  const [clients] = useState<Client[]>([
    { id: '1', name: 'Cliente A', email: 'cliente.a@email.com', phone: '(00) 00000-0000', totalSpent: 45000.00, lastPurchaseDate: '10/05/2024', preferences: 'B2B, prefere tecidos naturais.' },
    { id: '2', name: 'Cliente B', email: 'cliente.b@email.com', phone: '(00) 00000-0000', totalSpent: 12000.00, lastPurchaseDate: '02/05/2024', preferences: 'Private Label, foco em alfaiataria.' },
  ]);

  const [transactions] = useState<Transaction[]>([
    { id: '1', type: 'income', amount: 5000.00, category: 'Sinal', date: '2024-05-15', description: 'Sinal Coleção Cliente A' },
    { id: '2', type: 'expense', amount: 2500.00, category: 'Matéria Prima', date: '2024-05-10', description: 'Fornecedor de Tecidos' },
  ]);

  // Compatibility Mock for Dashboard (Dashboard expects products, we can pass minimal mock or adapt dashboard later)
  // For now, let's keep Dashboard using a minimal mock for "Products" just to not break it, 
  // or pass empty array if the prompt implied removing dashboard product logic.
  // Assuming dashboard is less critical than the new Production view request.
  const mockProductsForDashboard: any[] = [
    { id: '1', name: 'Peças em Produção', stock: 120, cost: 0, price: 0 },
    { id: '2', name: 'Pilotos Aprovados', stock: 15, cost: 0, price: 0 }
  ];

  const renderView = () => {
    switch (currentView) {
      case ViewState.DASHBOARD:
        return <DashboardView products={mockProductsForDashboard} transactions={transactions} />;
      case ViewState.PRODUCTION: // Replaces INVENTORY
        return <ProductionView projects={projects} setProjects={setProjects} />;
      case ViewState.CLIENTS:
        return <ClientsView clients={clients} />;
      case ViewState.FINANCE:
        return (
          <div className="flex flex-col items-center justify-center h-full text-stone-500 animate-fade-in">
             <div className="bg-white p-8 rounded-xl shadow-sm text-center max-w-md">
                <Sparkles size={48} className="mx-auto mb-4 text-rose-300" />
                <h3 className="text-xl font-serif text-stone-800 mb-2">Módulo Financeiro</h3>
                <p>O fluxo de caixa detalhado e DRE estarão disponíveis na próxima atualização do sistema.</p>
             </div>
          </div>
        );
      case ViewState.AI_STUDIO:
         return <AIStudioView />;
      case ViewState.AI_CHAT:
        return <AIChatView />;
      default:
        return <DashboardView products={mockProductsForDashboard} transactions={transactions} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-stone-50 font-sans">
      <Sidebar currentView={currentView} onChangeView={setCurrentView} />
      
      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
        <header className="flex justify-between items-center mb-6">
           <div className="text-xs font-semibold text-stone-400 uppercase tracking-widest">
             {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
           </div>
           <div className="flex items-center gap-3">
             <div className="text-right hidden md:block">
                <p className="text-sm font-semibold text-stone-800">Atelier Principal</p>
                <p className="text-xs text-stone-500">Gestora</p>
             </div>
             <div className="w-8 h-8 rounded-full bg-rose-200 flex items-center justify-center text-rose-800 text-xs font-bold">
               US
             </div>
           </div>
        </header>
        
        {renderView()}
      </main>
    </div>
  );
};

export default App;
