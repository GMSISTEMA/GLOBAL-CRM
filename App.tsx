import React, { useState, useCallback, useMemo } from 'react';
import Header from './components/Header';
import SalesFunnel from './components/SalesFunnel';
import LeadModal from './components/LeadModal';
import ModulesModal from './components/ModulesModal';
import FunnelStagesModal from './components/FunnelStagesModal';
import CampaignsModal from './components/CampaignsModal';
import CommunicationTemplatesModal from './components/CommunicationTemplatesModal';
import FilterBar from './components/FilterBar';
import LoginPage from './components/LoginPage';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Lead, Module, FunnelStatus, HistoryEntry, FunnelStage, CalendarEvent, Campaign, CommunicationTemplate } from './types';
import { DEFAULT_FUNNEL_STAGES, DEFAULT_MODULES, DEFAULT_CAMPAIGNS, DEFAULT_COMMUNICATION_TEMPLATES } from './constants';
import { initialLeads } from './data';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useLocalStorage<boolean>('crm-is-authenticated', false);
  const [leads, setLeads] = useLocalStorage<Lead[]>('crm-leads', initialLeads);
  const [availableModules, setAvailableModules] = useLocalStorage<Module[]>('crm-modules', DEFAULT_MODULES);
  const [funnelStages, setFunnelStages] = useLocalStorage<FunnelStage[]>('crm-stages', DEFAULT_FUNNEL_STAGES);
  const [campaigns, setCampaigns] = useLocalStorage<Campaign[]>('crm-campaigns', DEFAULT_CAMPAIGNS);
  const [templates, setTemplates] = useLocalStorage<CommunicationTemplate[]>('crm-templates', DEFAULT_COMMUNICATION_TEMPLATES);
  
  const [dateFilter, setDateFilter] = useState<{ start: string; end: string }>({ start: '', end: '' });
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isModulesModalOpen, setIsModulesModalOpen] = useState(false);
  const [isFunnelModalOpen, setIsFunnelModalOpen] = useState(false);
  const [isCampaignsModalOpen, setIsCampaignsModalOpen] = useState(false);
  const [isTemplatesModalOpen, setIsTemplatesModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const handleLogin = useCallback((email, password) => {
    // Em uma aplicação real, isso seria uma chamada de API
    if (email === 'admin@crm.com' && password === 'password123') {
      setIsAuthenticated(true);
    }
  }, [setIsAuthenticated]);

  const handleLogout = useCallback(() => {
    setIsAuthenticated(false);
  }, [setIsAuthenticated]);

  const openLeadModal = useCallback((lead: Lead | null) => {
    setSelectedLead(lead);
    setIsLeadModalOpen(true);
  }, []);

  const closeLeadModal = useCallback(() => {
    setIsLeadModalOpen(false);
    setSelectedLead(null);
  }, []);

  const openModulesModal = useCallback(() => setIsModulesModalOpen(true), []);
  const closeModulesModal = useCallback(() => setIsModulesModalOpen(false), []);

  const openFunnelModal = useCallback(() => setIsFunnelModalOpen(true), []);
  const closeFunnelModal = useCallback(() => setIsFunnelModalOpen(false), []);
  
  const openCampaignsModal = useCallback(() => setIsCampaignsModalOpen(true), []);
  const closeCampaignsModal = useCallback(() => setIsCampaignsModalOpen(false), []);

  const openTemplatesModal = useCallback(() => setIsTemplatesModalOpen(true), []);
  const closeTemplatesModal = useCallback(() => setIsTemplatesModalOpen(false), []);

  const handleSaveLead = useCallback((leadToSave: Lead) => {
    if (leadToSave.id) {
      setLeads(prev => prev.map(l => (l.id === leadToSave.id ? leadToSave : l)));
    } else {
      const newLead: Lead = {
        ...leadToSave,
        id: `lead-${Date.now()}`,
        status: funnelStages[0]?.id || 'new-lead',
        history: [
            {
                id: `hist-${Date.now()}`,
                date: new Date().toISOString(),
                type: 'creation',
                content: 'Lead criado no sistema.'
            }
        ],
        googleCalendarLinked: false,
        calendarEvents: [],
      };
      setLeads(prev => [newLead, ...prev]);
    }
    closeLeadModal();
  }, [setLeads, closeLeadModal, funnelStages]);
  
  const handleDeleteLead = useCallback((leadId: string) => {
      if (window.confirm('Tem certeza de que deseja excluir este lead?')) {
          setLeads(prev => prev.filter(l => l.id !== leadId));
          closeLeadModal();
      }
  }, [setLeads, closeLeadModal]);

  const leadsByStatus = useMemo(() => {
    const filteredLeads = leads.filter(lead => {
        const { start, end } = dateFilter;
        if (!start && !end) return true;

        const creationEntry = lead.history?.find(h => h.type === 'creation');
        if (!creationEntry) return false;

        const creationDate = new Date(creationEntry.date);
        
        const startDate = start ? new Date(start + 'T00:00:00Z') : null;
        const endDate = end ? new Date(end + 'T23:59:59Z') : null;

        if (startDate && creationDate < startDate) return false;
        if (endDate && creationDate > endDate) return false;
        
        return true;
    });

    return filteredLeads.reduce((acc, lead) => {
      (acc[lead.status] = acc[lead.status] || []).push(lead);
      return acc;
    }, {} as Record<FunnelStatus, Lead[]>);
  }, [leads, dateFilter]);
  
  const handleUpdateLeadStatus = useCallback((leadId: string, newStatus: FunnelStatus) => {
    const leadToUpdate = leads.find(l => l.id === leadId);
    if (!leadToUpdate || leadToUpdate.status === newStatus) return;

    const oldStatusTitle = funnelStages.find(s => s.id === leadToUpdate.status)?.title || 'um status anterior';
    const newStatusTitle = funnelStages.find(s => s.id === newStatus)?.title || 'um novo status';
    
    const historyEntry: HistoryEntry = {
        id: `hist-${Date.now()}`,
        date: new Date().toISOString(),
        type: 'status_change',
        content: `Status alterado de '${oldStatusTitle}' para '${newStatusTitle}'.`
    };

    setLeads(prevLeads => prevLeads.map(lead => 
      lead.id === leadId 
        ? { 
            ...lead, 
            status: newStatus,
            history: [historyEntry, ...(lead.history || [])] 
          } 
        : lead
    ));
  }, [leads, setLeads, funnelStages]);

  const handleAddNote = useCallback((leadId: string, noteContent: string) => {
    if (!noteContent.trim()) return;

    const historyEntry: HistoryEntry = {
        id: `hist-${Date.now()}`,
        date: new Date().toISOString(),
        type: 'note',
        content: noteContent.trim()
    };
    
    const updateLead = (lead: Lead) => ({ ...lead, history: [historyEntry, ...(lead.history || [])] });

    setLeads(prevLeads => prevLeads.map(lead => lead.id === leadId ? updateLead(lead) : lead));
    setSelectedLead(prev => prev && prev.id === leadId ? updateLead(prev) : prev);
  }, [setLeads]);

  // Calendar Event Handlers
  const handleToggleCalendarLink = useCallback((leadId: string) => {
    const updateLead = (lead: Lead) => ({ ...lead, googleCalendarLinked: !lead.googleCalendarLinked });
    setLeads(prev => prev.map(l => l.id === leadId ? updateLead(l) : l));
    setSelectedLead(prev => prev && prev.id === leadId ? updateLead(prev) : prev);
  }, [setLeads]);

  const handleScheduleEvent = useCallback((leadId: string, eventData: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = { ...eventData, id: `evt-${Date.now()}`};
    const updateLead = (lead: Lead) => ({...lead, calendarEvents: [...lead.calendarEvents, newEvent]});

    setLeads(prev => prev.map(l => l.id === leadId ? updateLead(l) : l));
    setSelectedLead(prev => prev && prev.id === leadId ? updateLead(prev) : prev);
  }, [setLeads]);

  const handleDeleteEvent = useCallback((leadId: string, eventId: string) => {
    const updateLead = (lead: Lead) => ({ ...lead, calendarEvents: lead.calendarEvents.filter(e => e.id !== eventId) });
    setLeads(prev => prev.map(l => l.id === leadId ? updateLead(l) : l));
    setSelectedLead(prev => prev && prev.id === leadId ? updateLead(prev) : prev);
  }, [setLeads]);

  // Campaign CRUD handlers
  const handleAddCampaign = useCallback((campaign: Omit<Campaign, 'id'>) => {
      const newCampaign = { ...campaign, id: `camp-${Date.now()}` };
      setCampaigns(prev => [...prev, newCampaign]);
  }, [setCampaigns]);

  const handleUpdateCampaign = useCallback((updatedCampaign: Campaign) => {
      setCampaigns(prev => prev.map(c => c.id === updatedCampaign.id ? updatedCampaign : c));
  }, [setCampaigns]);

  const handleDeleteCampaign = useCallback((campaignId: string) => {
      if (window.confirm('Excluir esta campanha irá desvinculá-la de todos os leads associados. Deseja continuar?')) {
          setCampaigns(prev => prev.filter(c => c.id !== campaignId));
          setLeads(prevLeads => 
              prevLeads.map(lead => 
                  lead.campaignId === campaignId ? { ...lead, campaignId: null } : lead
              )
          );
      }
  }, [setCampaigns, setLeads]);

  // Module CRUD handlers
  const handleAddModule = useCallback((module: Omit<Module, 'id'>) => {
      const newModule = { ...module, id: `module-${Date.now()}` };
      setAvailableModules(prev => [...prev, newModule]);
  }, [setAvailableModules]);

  const handleUpdateModule = useCallback((updatedModule: Module) => {
      setAvailableModules(prev => prev.map(m => m.id === updatedModule.id ? updatedModule : m));
  }, [setAvailableModules]);

  const handleDeleteModule = useCallback((moduleId: string) => {
      if (window.confirm('Atenção! Excluir um módulo o removerá de TODOS os leads existentes. Deseja continuar?')) {
          setAvailableModules(prev => prev.filter(m => m.id !== moduleId));
          setLeads(prevLeads => 
              prevLeads.map(lead => {
                  const hasModule = lead.modules.some(m => m.id === moduleId);
                  if (hasModule) {
                      const updatedModules = lead.modules.filter(m => m.id !== moduleId);
                      const newTotalValue = updatedModules.reduce((sum, mod) => sum + mod.price, 0);
                      return { ...lead, modules: updatedModules, totalValue: newTotalValue };
                  }
                  return lead;
              })
          );
      }
  }, [setAvailableModules, setLeads]);
  
  // Template CRUD handlers
  const handleAddTemplate = useCallback((template: Omit<CommunicationTemplate, 'id'>) => {
      const newTemplate = { ...template, id: `tpl-${Date.now()}` };
      setTemplates(prev => [...prev, newTemplate]);
  }, [setTemplates]);

  const handleUpdateTemplate = useCallback((updatedTemplate: CommunicationTemplate) => {
      setTemplates(prev => prev.map(t => t.id === updatedTemplate.id ? updatedTemplate : t));
  }, [setTemplates]);

  const handleDeleteTemplate = useCallback((templateId: string) => {
      if (window.confirm('Tem certeza de que deseja excluir este modelo de comunicação?')) {
          setTemplates(prev => prev.filter(t => t.id !== templateId));
      }
  }, [setTemplates]);

  const handleSaveFunnelStages = useCallback((newStages: FunnelStage[]) => {
      setFunnelStages(newStages);
      closeFunnelModal();
  }, [setFunnelStages, closeFunnelModal]);

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-neutral-light dark:bg-neutral-darkest text-neutral-dark dark:text-neutral-light font-sans">
      <Header 
        onAddLead={() => openLeadModal(null)} 
        onOpenModulesModal={openModulesModal} 
        onOpenFunnelModal={openFunnelModal}
        onOpenCampaignsModal={openCampaignsModal}
        onOpenTemplatesModal={openTemplatesModal}
        onLogout={handleLogout}
      />
      <main className="p-4 sm:p-6 lg:p-8">
        <FilterBar 
          filter={dateFilter}
          onFilterChange={setDateFilter}
          onClear={() => setDateFilter({ start: '', end: '' })}
        />
        <SalesFunnel 
          stages={funnelStages}
          leadsByStatus={leadsByStatus} 
          campaigns={campaigns}
          onUpdateLeadStatus={handleUpdateLeadStatus}
          onSelectLead={(lead) => openLeadModal(lead)} 
        />
      </main>
      {isLeadModalOpen && (
        <LeadModal
          lead={selectedLead}
          availableModules={availableModules}
          campaigns={campaigns}
          templates={templates}
          onClose={closeLeadModal}
          onSave={handleSaveLead}
          onDelete={handleDeleteLead}
          onAddNote={handleAddNote}
          onToggleCalendarLink={handleToggleCalendarLink}
          onScheduleEvent={handleScheduleEvent}
          onDeleteEvent={handleDeleteEvent}
        />
      )}
      {isModulesModalOpen && (
        <ModulesModal
          modules={availableModules}
          onClose={closeModulesModal}
          onAdd={handleAddModule}
          onUpdate={handleUpdateModule}
          onDelete={handleDeleteModule}
        />
      )}
      {isFunnelModalOpen && (
        <FunnelStagesModal
            stages={funnelStages}
            leadsByStatus={leadsByStatus}
            onClose={closeFunnelModal}
            onSave={handleSaveFunnelStages}
        />
      )}
      {isCampaignsModalOpen && (
        <CampaignsModal
            campaigns={campaigns}
            onClose={closeCampaignsModal}
            onAdd={handleAddCampaign}
            onUpdate={handleUpdateCampaign}
            onDelete={handleDeleteCampaign}
        />
      )}
      {isTemplatesModalOpen && (
        <CommunicationTemplatesModal
          templates={templates}
          onClose={closeTemplatesModal}
          onAdd={handleAddTemplate}
          onUpdate={handleUpdateTemplate}
          onDelete={handleDeleteTemplate}
        />
      )}
    </div>
  );
};

export default App;