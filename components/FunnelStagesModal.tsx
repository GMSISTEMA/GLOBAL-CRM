import React, { useState, useEffect } from 'react';
import { FunnelStage, Lead, FunnelStatus } from '../types';
import { XIcon, SaveIcon, TrashIcon, PlusCircleIcon, GrabberIcon } from './icons';

interface FunnelStagesModalProps {
  stages: FunnelStage[];
  leadsByStatus: Record<FunnelStatus, Lead[]>;
  onClose: () => void;
  onSave: (stages: FunnelStage[]) => void;
}

const colors = [
  'bg-slate-500', 'bg-gray-500', 'bg-zinc-500', 'bg-neutral-500', 'bg-stone-500',
  'bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-yellow-500', 'bg-lime-500',
  'bg-green-500', 'bg-emerald-500', 'bg-teal-500', 'bg-cyan-500', 'bg-sky-500',
  'bg-blue-500', 'bg-indigo-500', 'bg-violet-500', 'bg-purple-500', 'bg-fuchsia-500',
  'bg-pink-500', 'bg-rose-500'
];

const FunnelStagesModal: React.FC<FunnelStagesModalProps> = ({ stages, leadsByStatus, onClose, onSave }) => {
  const [localStages, setLocalStages] = useState<FunnelStage[]>([]);
  const [draggedItem, setDraggedItem] = useState<FunnelStage | null>(null);

  useEffect(() => {
    setLocalStages(JSON.parse(JSON.stringify(stages)));
  }, [stages]);

  const handleStageChange = (id: string, field: 'title' | 'color', value: string) => {
    setLocalStages(prev => prev.map(stage => (stage.id === id ? { ...stage, [field]: value } : stage)));
  };

  const handleAddStage = () => {
    const newStage: FunnelStage = {
      id: `stage-${Date.now()}`,
      title: 'Nova Etapa',
      color: colors[Math.floor(Math.random() * colors.length)]
    };
    setLocalStages(prev => [...prev, newStage]);
  };

  const handleDeleteStage = (id: string) => {
    setLocalStages(prev => prev.filter(stage => stage.id !== id));
  };
  
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, stage: FunnelStage) => {
    setDraggedItem(stage);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', stage.id);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    if (!draggedItem) return;

    const newStages = [...localStages];
    const draggedIndex = newStages.findIndex(s => s.id === draggedItem.id);
    const [removed] = newStages.splice(draggedIndex, 1);
    newStages.splice(index, 0, removed);

    if (JSON.stringify(newStages) !== JSON.stringify(localStages)) {
        setLocalStages(newStages);
    }
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleSubmit = () => {
    onSave(localStages);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div
        className="bg-white dark:bg-neutral-dark w-full max-w-2xl rounded-xl shadow-2xl flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-neutral-medium dark:border-neutral-darkest">
          <h2 className="text-xl font-bold">Gerenciar Etapas do Funil</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-neutral-medium dark:hover:bg-neutral-darkest">
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-6 space-y-4 overflow-y-auto max-h-[60vh]">
          {localStages.map((stage, index) => {
            const leadsInStage = leadsByStatus[stage.id] || [];
            const isDeletable = leadsInStage.length === 0;

            return (
              <div
                key={stage.id}
                draggable
                onDragStart={e => handleDragStart(e, stage)}
                onDragOver={e => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className="flex items-center gap-3 p-2 rounded-lg bg-neutral-light dark:bg-neutral-darkest/50 cursor-grab active:cursor-grabbing"
              >
                <GrabberIcon className="h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={stage.title}
                  onChange={e => handleStageChange(stage.id, 'title', e.target.value)}
                  className="flex-1 px-3 py-2 bg-white dark:bg-neutral-darkest border border-neutral-medium dark:border-neutral-dark rounded-md shadow-sm"
                />
                <div className="relative">
                  <select
                    value={stage.color}
                    onChange={e => handleStageChange(stage.id, 'color', e.target.value)}
                    className="appearance-none w-28 px-3 py-2 border border-neutral-medium dark:border-neutral-dark rounded-md shadow-sm"
                    style={{ backgroundColor: stage.color.startsWith('bg-') ? '' : stage.color, color: 'white' }}
                  >
                    {colors.map(c => <option key={c} value={c} className={`${c} text-white`}>{c.split('-')[1]}</option>)}
                  </select>
                  <div className={`pointer-events-none absolute inset-y-0 left-0 w-full rounded-md ${stage.color}`}></div>
                </div>
                <div className="relative group">
                    <button
                        onClick={() => handleDeleteStage(stage.id)}
                        disabled={!isDeletable}
                        className="p-2 text-red-500 hover:text-red-400 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 disabled:text-gray-400 dark:disabled:text-gray-600 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                    >
                        <TrashIcon className="h-5 w-5" />
                    </button>
                    {!isDeletable && (
                        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 text-center text-xs text-white bg-neutral-darkest p-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            Mova os {leadsInStage.length} leads desta etapa antes de excluí-la.
                        </div>
                    )}
                </div>
              </div>
            );
          })}
          <button onClick={handleAddStage} className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-brand-primary border-2 border-dashed border-brand-secondary rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
            <PlusCircleIcon className="h-5 w-5" />
            Adicionar Etapa
          </button>
        </div>

        <div className="flex justify-end p-4 border-t border-neutral-medium dark:border-neutral-darkest mt-auto">
          <button onClick={handleSubmit} className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-brand-primary rounded-lg shadow-sm hover:bg-brand-secondary">
            <SaveIcon className="h-5 w-5" />
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
};

export default FunnelStagesModal;
