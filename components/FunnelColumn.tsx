import React, { useState } from 'react';
import { Lead, FunnelStage, FunnelStatus, Campaign } from '../types';
import LeadCard from './LeadCard';

interface FunnelColumnProps {
  stage: FunnelStage;
  leads: Lead[];
  campaigns: Campaign[];
  onSelectLead: (lead: Lead) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, status: FunnelStatus) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, leadId: string) => void;
  onDragEnd: () => void;
  isDraggedOver: boolean;
}

const FunnelColumn: React.FC<FunnelColumnProps> = ({ stage, leads, campaigns, onSelectLead, onDrop, onDragStart, onDragEnd }) => {
  const [isOver, setIsOver] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(true);
  };

  const handleDragLeave = () => {
    setIsOver(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    onDrop(e, stage.id);
    setIsOver(false);
  }

  const totalValue = leads.reduce((sum, lead) => sum + lead.totalValue, 0);

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      className={`flex flex-col w-72 md:w-80 flex-shrink-0 bg-neutral-medium dark:bg-neutral-dark rounded-xl shadow-lg transition-all duration-300 ${isOver ? 'bg-blue-100 dark:bg-blue-900/50' : ''}`}
    >
      <div className={`p-4 rounded-t-xl ${stage.color} text-white flex justify-between items-center`}>
        <h2 className="font-bold text-lg">{stage.title}</h2>
        <span className="text-sm font-semibold bg-white/30 rounded-full px-2 py-0.5">{leads.length}</span>
      </div>
      <div className="p-2 text-sm text-center font-semibold text-neutral-darkest dark:text-neutral-light bg-neutral-medium dark:bg-neutral-dark border-b border-neutral-300 dark:border-neutral-darkest">
        Valor Total: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalValue)}
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-3">
        {leads.map(lead => (
          <LeadCard 
            key={lead.id} 
            lead={lead} 
            campaigns={campaigns}
            onClick={() => onSelectLead(lead)}
            onDragStart={(e) => onDragStart(e, lead.id)}
            onDragEnd={onDragEnd}
          />
        ))}
      </div>
    </div>
  );
};

export default FunnelColumn;