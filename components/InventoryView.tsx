import React, { useState } from 'react';
import { Plus, Calendar, CheckCircle, Clock, AlertTriangle, ChevronDown, ChevronUp, MoreHorizontal } from 'lucide-react';
import { CollectionProject, ProjectStage } from '../types';

interface ProductionProps {
  projects: CollectionProject[];
  setProjects: React.Dispatch<React.SetStateAction<CollectionProject[]>>;
}

export const ProductionView: React.FC<ProductionProps> = ({ projects, setProjects }) => {
  const [expandedProject, setExpandedProject] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedProject(expandedProject === id ? null : id);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'in_progress': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'delayed': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-stone-100 text-stone-500 border-stone-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle size={14} />;
      case 'in_progress': return <Clock size={14} />;
      case 'delayed': return <AlertTriangle size={14} />;
      default: return <div className="w-3 h-3 rounded-full border-2 border-stone-300" />;
    }
  };

  const updateStageStatus = (projectId: string, stageId: string, newStatus: CollectionProject['stages'][0]['status']) => {
    setProjects(prev => prev.map(proj => {
      if (proj.id !== projectId) return proj;
      const updatedStages = proj.stages.map(stage => 
        stage.id === stageId ? { ...stage, status: newStatus } : stage
      );
      return { ...proj, stages: updatedStages };
    }));
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl text-stone-800">Timeline de Produção</h2>
          <p className="text-stone-500">Acompanhe o status das coleções dos clientes.</p>
        </div>
        <button className="bg-stone-900 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-stone-800 transition-colors">
          <Plus size={20} />
          Nova Coleção
        </button>
      </div>

      <div className="grid gap-6">
        {projects.map(project => (
          <div key={project.id} className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden transition-all">
            {/* Header Card */}
            <div 
              onClick={() => toggleExpand(project.id)}
              className="p-6 cursor-pointer hover:bg-stone-50 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-serif font-bold ${project.status === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-rose-100 text-rose-800'}`}>
                  {project.clientName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-stone-900">{project.collectionName}</h3>
                  <p className="text-sm text-stone-500">{project.clientName} • Entrega: {project.deadline}</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex flex-col items-end">
                    <span className="text-xs text-stone-400 uppercase tracking-wider">Progresso</span>
                    <div className="w-32 h-2 bg-stone-100 rounded-full mt-1 overflow-hidden">
                        <div 
                            className="h-full bg-gradient-to-r from-rose-400 to-rose-500 rounded-full transition-all duration-500" 
                            style={{ width: `${(project.stages.filter(s => s.status === 'completed').length / project.stages.length) * 100}%` }}
                        ></div>
                    </div>
                </div>
                {expandedProject === project.id ? <ChevronUp className="text-stone-400" /> : <ChevronDown className="text-stone-400" />}
              </div>
            </div>

            {/* Timeline Body */}
            {expandedProject === project.id && (
              <div className="border-t border-stone-100 bg-stone-50/50 p-6">
                 <div className="relative">
                    {/* Vertical Line */}
                    <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-stone-200"></div>

                    <div className="space-y-6">
                        {project.stages.map((stage, index) => (
                            <div key={stage.id} className="relative flex items-start gap-4 group">
                                {/* Dot/Icon */}
                                <div className={`w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center border-4 border-white shadow-sm z-10 transition-colors ${
                                    stage.status === 'completed' ? 'bg-green-500 text-white' : 
                                    stage.status === 'in_progress' ? 'bg-amber-400 text-white' : 
                                    stage.status === 'delayed' ? 'bg-red-500 text-white' : 'bg-stone-200 text-stone-400'
                                }`}>
                                    {getStatusIcon(stage.status)}
                                </div>

                                {/* Content */}
                                <div className="flex-1 bg-white p-4 rounded-lg border border-stone-200 shadow-sm flex justify-between items-center hover:shadow-md transition-shadow">
                                    <div>
                                        <h4 className={`font-medium ${stage.status === 'completed' ? 'text-stone-400 line-through' : 'text-stone-800'}`}>
                                            {stage.name}
                                        </h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Calendar size={12} className="text-stone-400" />
                                            <span className="text-xs text-stone-500">{stage.date}</span>
                                            {stage.notes && <span className="text-xs text-stone-400 italic">• {stage.notes}</span>}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className={`text-xs px-2 py-1 rounded border capitalize ${getStatusColor(stage.status)}`}>
                                            {stage.status.replace('_', ' ')}
                                        </span>
                                        <div className="relative group/actions">
                                            <button className="p-1 hover:bg-stone-100 rounded text-stone-400">
                                                <MoreHorizontal size={16} />
                                            </button>
                                            <div className="absolute right-0 top-full mt-1 w-32 bg-white border border-stone-200 rounded shadow-lg hidden group-hover/actions:block z-20">
                                                <button onClick={() => updateStageStatus(project.id, stage.id, 'pending')} className="block w-full text-left px-3 py-2 text-xs hover:bg-stone-50">Pendente</button>
                                                <button onClick={() => updateStageStatus(project.id, stage.id, 'in_progress')} className="block w-full text-left px-3 py-2 text-xs hover:bg-stone-50 text-amber-600">Em Andamento</button>
                                                <button onClick={() => updateStageStatus(project.id, stage.id, 'completed')} className="block w-full text-left px-3 py-2 text-xs hover:bg-stone-50 text-green-600">Concluído</button>
                                                <button onClick={() => updateStageStatus(project.id, stage.id, 'delayed')} className="block w-full text-left px-3 py-2 text-xs hover:bg-stone-50 text-red-600">Atrasado</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                 </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
