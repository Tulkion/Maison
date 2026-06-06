import React, { useState } from 'react';
import { Sparkles, PenTool, Image as ImageIcon, Shirt, ArrowRight, Loader2, Copy, Download } from 'lucide-react';
import { generateCollectionIdeas, generateMarketingCopy, generateFashionVisual } from '../services/geminiService';

type ToolType = 'collection' | 'marketing' | 'visual';

export const AIStudioView: React.FC = () => {
  const [activeTool, setActiveTool] = useState<ToolType>('collection');
  
  // States for Collection Tool
  const [collectionForm, setCollectionForm] = useState({ season: '', theme: '', audience: '' });
  const [collectionResult, setCollectionResult] = useState('');
  
  // States for Marketing Tool
  const [marketingForm, setMarketingForm] = useState({ topic: '', platform: 'instagram' as 'instagram' | 'email' | 'blog' });
  const [marketingResult, setMarketingResult] = useState('');

  // States for Visual Tool
  const [visualPrompt, setVisualPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  // Loading States
  const [loading, setLoading] = useState(false);

  const handleCollectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await generateCollectionIdeas(collectionForm.season, collectionForm.theme, collectionForm.audience);
    setCollectionResult(result);
    setLoading(false);
  };

  const handleMarketingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await generateMarketingCopy(marketingForm.topic, marketingForm.platform);
    setMarketingResult(result);
    setLoading(false);
  };

  const handleVisualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setGeneratedImage(null);
    const result = await generateFashionVisual(visualPrompt);
    setGeneratedImage(result);
    setLoading(false);
  };

  const renderToolMenu = () => (
    <div className="grid grid-cols-3 gap-4 mb-8">
      <button 
        onClick={() => setActiveTool('collection')}
        className={`p-4 rounded-xl border flex flex-col items-center gap-3 transition-all ${activeTool === 'collection' ? 'bg-rose-50 border-rose-400 text-rose-900 shadow-md' : 'bg-white border-stone-200 text-stone-500 hover:border-rose-200'}`}
      >
        <div className={`p-3 rounded-full ${activeTool === 'collection' ? 'bg-rose-200' : 'bg-stone-100'}`}>
          <Shirt size={24} />
        </div>
        <span className="font-medium">Diretora Criativa</span>
      </button>

      <button 
        onClick={() => setActiveTool('marketing')}
        className={`p-4 rounded-xl border flex flex-col items-center gap-3 transition-all ${activeTool === 'marketing' ? 'bg-purple-50 border-purple-400 text-purple-900 shadow-md' : 'bg-white border-stone-200 text-stone-500 hover:border-purple-200'}`}
      >
        <div className={`p-3 rounded-full ${activeTool === 'marketing' ? 'bg-purple-200' : 'bg-stone-100'}`}>
          <PenTool size={24} />
        </div>
        <span className="font-medium">Marketing Studio</span>
      </button>

      <button 
        onClick={() => setActiveTool('visual')}
        className={`p-4 rounded-xl border flex flex-col items-center gap-3 transition-all ${activeTool === 'visual' ? 'bg-amber-50 border-amber-400 text-amber-900 shadow-md' : 'bg-white border-stone-200 text-stone-500 hover:border-amber-200'}`}
      >
        <div className={`p-3 rounded-full ${activeTool === 'visual' ? 'bg-amber-200' : 'bg-stone-100'}`}>
          <ImageIcon size={24} />
        </div>
        <span className="font-medium">Atelier Visual</span>
      </button>
    </div>
  );

  return (
    <div className="animate-fade-in max-w-5xl mx-auto pb-12">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-serif text-stone-800 mb-2 flex items-center justify-center gap-3">
          <Sparkles className="text-rose-400" /> Maison AI Studio
        </h2>
        <p className="text-stone-500 max-w-lg mx-auto">Sua equipe criativa impulsionada por inteligência artificial. Crie coleções, campanhas e sketches em segundos.</p>
      </div>

      {renderToolMenu()}

      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden min-h-[500px] flex flex-col md:flex-row">
        
        {/* INPUT SECTION */}
        <div className="w-full md:w-1/3 border-r border-stone-100 bg-stone-50 p-6">
          {activeTool === 'collection' && (
            <form onSubmit={handleCollectionSubmit} className="space-y-4">
              <h3 className="font-serif text-xl text-rose-900 mb-4">Planejamento de Coleção</h3>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Temporada</label>
                <input required value={collectionForm.season} onChange={e => setCollectionForm({...collectionForm, season: e.target.value})} placeholder="Ex: Verão 2025, Alto Inverno..." className="w-full p-2.5 rounded border border-stone-300 focus:ring-rose-500 focus:border-rose-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Tema / Inspiração</label>
                <textarea required value={collectionForm.theme} onChange={e => setCollectionForm({...collectionForm, theme: e.target.value})} placeholder="Ex: Romance Italiano, Minimalismo Urbano..." className="w-full p-2.5 rounded border border-stone-300 focus:ring-rose-500 focus:border-rose-500 h-24" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Público Alvo</label>
                <input required value={collectionForm.audience} onChange={e => setCollectionForm({...collectionForm, audience: e.target.value})} placeholder="Ex: Mulheres executivas 30-45 anos" className="w-full p-2.5 rounded border border-stone-300 focus:ring-rose-500 focus:border-rose-500" />
              </div>
              <button disabled={loading} type="submit" className="w-full py-3 bg-rose-900 text-white rounded-lg font-medium hover:bg-rose-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-70">
                {loading ? <Loader2 className="animate-spin" size={20} /> : <><Sparkles size={18} /> Gerar Coleção</>}
              </button>
            </form>
          )}

          {activeTool === 'marketing' && (
             <form onSubmit={handleMarketingSubmit} className="space-y-4">
              <h3 className="font-serif text-xl text-purple-900 mb-4">Criador de Conteúdo</h3>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Produto ou Tópico</label>
                <textarea required value={marketingForm.topic} onChange={e => setMarketingForm({...marketingForm, topic: e.target.value})} placeholder="Ex: Lançamento do vestido de linho off-white, promoção de dia das mães..." className="w-full p-2.5 rounded border border-stone-300 focus:ring-purple-500 focus:border-purple-500 h-32" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Canal</label>
                <select value={marketingForm.platform} onChange={e => setMarketingForm({...marketingForm, platform: e.target.value as any})} className="w-full p-2.5 rounded border border-stone-300 focus:ring-purple-500 focus:border-purple-500">
                  <option value="instagram">Instagram (Post/Legenda)</option>
                  <option value="email">E-mail Marketing</option>
                  <option value="blog">Artigo para Blog</option>
                </select>
              </div>
              <button disabled={loading} type="submit" className="w-full py-3 bg-purple-900 text-white rounded-lg font-medium hover:bg-purple-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-70">
                {loading ? <Loader2 className="animate-spin" size={20} /> : <><PenTool size={18} /> Escrever Copy</>}
              </button>
            </form>
          )}

          {activeTool === 'visual' && (
            <form onSubmit={handleVisualSubmit} className="space-y-4">
              <h3 className="font-serif text-xl text-amber-900 mb-4">Atelier de Croquis</h3>
              <div className="bg-amber-50 p-4 rounded-lg text-sm text-amber-800 mb-2 border border-amber-100">
                Descreva a peça de roupa que você imagina, e a IA criará um croqui exclusivo para inspiração.
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Descrição Visual</label>
                <textarea required value={visualPrompt} onChange={e => setVisualPrompt(e.target.value)} placeholder="Ex: Um vestido de festa longo em seda vermelha, com decote nas costas e fenda lateral, estilo minimalista..." className="w-full p-2.5 rounded border border-stone-300 focus:ring-amber-500 focus:border-amber-500 h-32" />
              </div>
              <button disabled={loading} type="submit" className="w-full py-3 bg-amber-900 text-white rounded-lg font-medium hover:bg-amber-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-70">
                {loading ? <Loader2 className="animate-spin" size={20} /> : <><ImageIcon size={18} /> Desenhar Croqui</>}
              </button>
            </form>
          )}
        </div>

        {/* OUTPUT SECTION */}
        <div className="w-full md:w-2/3 p-8 bg-white relative">
          
          {/* Empty State */}
          {!loading && !collectionResult && !marketingResult && !generatedImage && (
            <div className="h-full flex flex-col items-center justify-center text-stone-300">
              <Sparkles size={64} className="mb-4 opacity-50" />
              <p className="text-lg font-medium">Os resultados da IA aparecerão aqui</p>
              <p className="text-sm">Preencha o formulário ao lado para começar</p>
            </div>
          )}

          {/* Loading Overlay */}
          {loading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-rose-900">
              <Loader2 size={48} className="animate-spin mb-4 text-rose-500" />
              <p className="font-serif text-xl animate-pulse">Consultando Maison AI...</p>
              <p className="text-sm text-stone-500 mt-2">Criando algo exclusivo para você</p>
            </div>
          )}

          {/* Results */}
          <div className="animate-fade-in space-y-4">
            
            {activeTool === 'collection' && collectionResult && (
              <div className="prose prose-stone prose-rose max-w-none">
                 <div className="flex justify-between items-center mb-4 border-b border-stone-100 pb-2">
                   <span className="text-xs font-bold text-rose-400 uppercase tracking-widest">Plano de Coleção</span>
                   <button onClick={() => navigator.clipboard.writeText(collectionResult)} className="text-stone-400 hover:text-rose-600 transition-colors"><Copy size={16}/></button>
                 </div>
                 <div className="whitespace-pre-wrap text-stone-700 font-sans leading-relaxed">
                   {collectionResult}
                 </div>
              </div>
            )}

            {activeTool === 'marketing' && marketingResult && (
              <div className="bg-stone-50 p-6 rounded-xl border border-stone-100 relative group">
                <button 
                  onClick={() => navigator.clipboard.writeText(marketingResult)}
                  className="absolute top-4 right-4 p-2 bg-white rounded-md shadow-sm opacity-0 group-hover:opacity-100 transition-all text-stone-500 hover:text-purple-600"
                  title="Copiar texto"
                >
                  <Copy size={16} />
                </button>
                <div className="whitespace-pre-wrap text-stone-800 font-sans">
                  {marketingResult}
                </div>
              </div>
            )}

            {activeTool === 'visual' && generatedImage && (
              <div className="flex flex-col items-center">
                 <div className="bg-stone-100 p-2 rounded-lg shadow-inner mb-4">
                   <img src={generatedImage} alt="Generated Fashion Sketch" className="max-h-[500px] w-auto rounded shadow-sm" />
                 </div>
                 <a 
                   href={generatedImage} 
                   download={`sketch-maison-${Date.now()}.png`}
                   className="flex items-center gap-2 text-sm text-amber-700 hover:text-amber-900 font-medium py-2 px-4 bg-amber-50 rounded-full transition-colors"
                 >
                   <Download size={16} /> Baixar Croqui em Alta Resolução
                 </a>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
};