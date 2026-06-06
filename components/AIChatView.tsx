import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Sparkles, Loader2, Bot } from 'lucide-react';
import { sendGeneralChat } from '../services/geminiService';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
}

export const AIChatView: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'model', text: 'Olá! Sou sua consultora executiva. Como posso ajudar com a gestão da sua confecção, dúvidas financeiras ou tendências hoje?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Format history for Gemini API
    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const responseText = await sendGeneralChat(history, userMsg.text);
    
    setMessages(prev => [...prev, {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText
    }]);
    setLoading(false);
  };

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden animate-fade-in">
      <div className="p-4 border-b border-stone-100 bg-stone-50 flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-stone-800 to-stone-900 rounded-full flex items-center justify-center text-white">
            <Sparkles size={18} />
        </div>
        <div>
            <h2 className="font-semibold text-stone-800">Consultora Virtual</h2>
            <p className="text-xs text-stone-500">Especialista em Negócios de Moda</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${msg.role === 'user' ? 'bg-rose-100 text-rose-600' : 'bg-stone-100 text-stone-600'}`}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-rose-500 text-white rounded-tr-none' 
                  : 'bg-stone-50 border border-stone-100 text-stone-800 rounded-tl-none'
              }`}>
                {msg.text.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                        {line}
                        <br />
                    </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        ))}
        {loading && (
           <div className="flex justify-start">
             <div className="flex gap-3 max-w-[80%]">
               <div className="w-8 h-8 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center">
                 <Bot size={16} />
               </div>
               <div className="bg-stone-50 border border-stone-100 p-4 rounded-2xl rounded-tl-none flex items-center gap-2 text-stone-500 text-sm">
                 <Loader2 size={16} className="animate-spin" /> Pensando...
               </div>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="p-4 border-t border-stone-100 bg-white">
        <div className="relative">
            <input 
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Pergunte sobre estratégia, financeiro ou tendências..."
                className="w-full pl-4 pr-12 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-rose-200 focus:border-rose-400 outline-none transition-all"
            />
            <button 
                type="submit" 
                disabled={loading || !input.trim()}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                <Send size={18} />
            </button>
        </div>
      </form>
    </div>
  );
};
