import React, { useState } from 'react';
import { Mail, Phone, ShoppingBag, Send } from 'lucide-react';
import { Client } from '../types';
import { suggestClientOutreach } from '../services/geminiService';

interface ClientsProps {
  clients: Client[];
}

export const ClientsView: React.FC<ClientsProps> = ({ clients }) => {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [message, setMessage] = useState('');
  const [loadingMsg, setLoadingMsg] = useState(false);

  const handleGenerateMessage = async (client: Client) => {
    setLoadingMsg(true);
    const msg = await suggestClientOutreach(client, "Nova coleção de Inverno em Linho Puro");
    setMessage(msg);
    setLoadingMsg(false);
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-100px)] animate-fade-in">
      {/* Client List */}
      <div className="w-1/2 bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-stone-100 bg-stone-50">
          <h2 className="text-lg font-semibold text-stone-800">Carteira de Clientes</h2>
          <p className="text-xs text-stone-500">Total: {clients.length} VIPs</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {clients.map(client => (
            <div 
              key={client.id} 
              onClick={() => { setSelectedClient(client); setMessage(''); }}
              className={`p-4 border-b border-stone-100 cursor-pointer hover:bg-rose-50 transition-colors ${selectedClient?.id === client.id ? 'bg-rose-50 border-l-4 border-l-rose-400' : ''}`}
            >
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-stone-900">{client.name}</h3>
                <span className="text-xs bg-stone-100 px-2 py-1 rounded text-stone-600">R$ {client.totalSpent}</span>
              </div>
              <p className="text-sm text-stone-500 mt-1 truncate">{client.preferences}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Detail View */}
      <div className="w-1/2 flex flex-col gap-6">
        {selectedClient ? (
          <>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-rose-200 rounded-full flex items-center justify-center text-rose-700 text-2xl font-serif">
                  {selectedClient.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-2xl font-serif text-stone-900">{selectedClient.name}</h2>
                  <div className="flex gap-3 text-sm text-stone-500 mt-1">
                    <span className="flex items-center gap-1"><Phone size={14}/> {selectedClient.phone}</span>
                    <span className="flex items-center gap-1"><Mail size={14}/> {selectedClient.email}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-stone-50 p-3 rounded-lg">
                  <p className="text-xs text-stone-500 uppercase">Última Compra</p>
                  <p className="font-medium text-stone-800">{selectedClient.lastPurchaseDate}</p>
                </div>
                <div className="bg-stone-50 p-3 rounded-lg">
                  <p className="text-xs text-stone-500 uppercase">Estilo</p>
                  <p className="font-medium text-stone-800">{selectedClient.preferences}</p>
                </div>
              </div>

              <div className="border-t border-stone-100 pt-6">
                <h3 className="font-medium text-stone-900 mb-3 flex items-center gap-2">
                  <Send size={18} className="text-rose-500" /> 
                  Contato Inteligente
                </h3>
                
                <div className="space-y-3">
                  <button 
                    onClick={() => handleGenerateMessage(selectedClient)}
                    disabled={loadingMsg}
                    className="text-sm bg-rose-100 text-rose-700 px-4 py-2 rounded-lg hover:bg-rose-200 transition-colors w-full text-left"
                  >
                    {loadingMsg ? 'Escrevendo...' : '✨ Gerar sugestão de mensagem para WhatsApp'}
                  </button>
                  
                  {message && (
                    <div className="bg-stone-50 p-4 rounded-lg border border-stone-200">
                      <textarea 
                        className="w-full bg-transparent border-none text-sm text-stone-700 focus:ring-0 resize-none" 
                        rows={5}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                      />
                      <div className="flex justify-end mt-2">
                        <button className="text-xs bg-green-500 text-white px-3 py-1 rounded-full hover:bg-green-600">
                          Copiar para WhatsApp
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="h-full bg-stone-50 rounded-xl border border-dashed border-stone-300 flex items-center justify-center text-stone-400">
            Selecione uma cliente para ver detalhes
          </div>
        )}
      </div>
    </div>
  );
};
