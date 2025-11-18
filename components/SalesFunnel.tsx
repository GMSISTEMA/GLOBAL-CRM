
import React, { useState } from 'react';
import { Lead, FunnelStatus, FunnelStage, Campaign } from '../types';
import FunnelColumn from './FunnelColumn';

interface SalesFunnelProps {
  stages: FunnelStage[];
  leadsByStatus: Record<FunnelStatus, Lead[]>;
  campaigns: Campaign[];
  onUpdateLeadStatus: (leadId: string, newStatus: FunnelStatus) => void;
  onSelectLead: (lead: Lead) => void;
}

const SalesFunnel: React.FC<SalesFunnelProps> = ({ stages, leadsByStatus, campaigns, onUpdateLeadStatus, onSelectLead }) => {
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, leadId: string) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', leadId);
    setDraggedLeadId(leadId);
  };

  const handleDragEnd = () => {
    setDraggedLeadId(null);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, status: FunnelStatus) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData('text/plain');
    if (leadId) {
      onUpdateLeadStatus(leadId, status);
    }
  };

  return (
    <div className="flex overflow-x-auto space-x-4 p-2 -mx-2 min-h-[calc(100vh-10rem)]">
      {stages.map(stage => (
        <FunnelColumn
          key={stage.id}
          stage={stage}
          leads={leadsByStatus[stage.id] || []}
          campaigns={campaigns}
          onSelectLead={onSelectLead}
          onDrop={handleDrop}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          isDraggedOver={false}
        />
      ))}
    </div>
  );
};

export default SalesFunnel;