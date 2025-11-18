import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Lead, Module, HistoryEntryType, CalendarEvent, Campaign, CommunicationTemplate } from '../types';
import { XIcon, SaveIcon, TrashIcon, WhatsAppIcon, PlusCircleIcon, ArrowRightIcon, MessageSquareIcon, ClockIcon, CalendarIcon, LinkIcon, UnlinkIcon } from './icons';

interface ScheduleEventModalProps {
    onClose: () => void;
    onSave: (event: Omit<CalendarEvent, 'id'>) => void;
}

const ScheduleEventModal: React.FC<ScheduleEventModalProps> = ({ onClose, onSave }) => {
    const [title, setTitle] = useState('');
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title && start && end) {
            onSave({ title, start: new Date(start).toISOString(), end: new Date(end).toISOString() });
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-neutral-dark w-full max-w-md rounded-lg shadow-xl" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="p-4 border-b dark:border-neutral-darkest">
                        <h3 className="text-lg font-bold">Agendar Evento</h3>
                    </div>
                    <div className="p-6 space-y-4">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium">Título do Evento</label>
                            <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-neutral-darkest border border-neutral-medium dark:border-neutral-dark rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary" />
                        </div>
                        <div>
                            <label htmlFor="start" className="block text-sm font-medium">Início</label>
                            <input type="datetime-local" id="start" value={start} onChange={e => setStart(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-neutral-darkest border border-neutral-medium dark:border-neutral-dark rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary" />
                        </div>
                        <div>
                            <label htmlFor="end" className="block text-sm font-medium">Fim</label>
                            <input type="datetime-local" id="end" value={end} onChange={e => setEnd(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-neutral-darkest border border-neutral-medium dark:border-neutral-dark rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary" />
                        </div>
                    </div>
                    <div className="flex justify-end items-center p-4 bg-neutral-light dark:bg-neutral-darkest/50 rounded-b-lg">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-lg mr-2 hover:bg-neutral-medium dark:hover:bg-neutral-dark">Cancelar</button>
                        <button type="submit" className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-brand-primary rounded-lg shadow-sm hover:bg-brand-secondary">
                            <SaveIcon className="h-5 w-5" />
                            Salvar Evento
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


interface LeadModalProps {
  lead: Lead | null;
  availableModules: Module[];
  campaigns: Campaign[];
  templates: CommunicationTemplate[];
  onClose: () => void;
  onSave: (lead: Lead) => void;
  onDelete: (leadId: string) => void;
  onAddNote: (leadId: string, note: string) => void;
  onToggleCalendarLink: (leadId: string) => void;
  onScheduleEvent: (leadId: string, event: Omit<CalendarEvent, 'id'>) => void;
  onDeleteEvent: (leadId: string, eventId: string) => void;
}

const LeadModal: React.FC<LeadModalProps> = ({ lead, availableModules, campaigns, templates, onClose, onSave, onDelete, onAddNote, onToggleCalendarLink, onScheduleEvent, onDeleteEvent }) => {
  const [formData, setFormData] = useState<Partial<Lead>>({
    name: '',
    company: '',
    ramo: '',
    email: '',
    phone: '',
    modules: [],
    totalValue: 0,
    campaignId: null,
    history: [],
    googleCalendarLinked: false,
    calendarEvents: []
  });
  const [newNote, setNewNote] = useState('');
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [parsedTemplateBody, setParsedTemplateBody] = useState('');
  const [copySuccess, setCopySuccess] = useState('');
  
  const detailsRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (lead) {
      setFormData(lead);
    } else {
      setFormData({
        name: '',
        company: '',
        ramo: '',
        email: '',
        phone: '',
        modules: [],
        totalValue: 0,
        campaignId: null,
        history: [],
        googleCalendarLinked: false,
        calendarEvents: [],
      });
    }
    setSelectedTemplateId('');
    setParsedTemplateBody('');
  }, [lead]);

  useEffect(() => {
    if (selectedTemplateId && lead) {
      const template = templates.find(t => t.id === selectedTemplateId);
      if (template) {
        let body = template.body;
        body = body.replace(/{{lead.name}}/g, lead.name || '[Nome do Lead]');
        body = body.replace(/{{lead.company}}/g, lead.company || '[Nome da Empresa]');
        setParsedTemplateBody(body);
      }
    } else {
      setParsedTemplateBody('');
    }
  }, [selectedTemplateId, lead, templates]);

  const handleCopyToClipboard = () => {
    if (!parsedTemplateBody) return;
    navigator.clipboard.writeText(parsedTemplateBody).then(() => {
      setCopySuccess('Copiado!');
      setTimeout(() => setCopySuccess(''), 2000);
    }, () => {
      setCopySuccess('Falha ao copiar');
       setTimeout(() => setCopySuccess(''), 2000);
    });
  };

  const handleScrollTo = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleModuleChange = (module: Module, isChecked: boolean) => {
    setFormData(prev => {
      const currentModules = prev.modules || [];
      const newModules = isChecked
        ? [...currentModules, { ...module }]
        : currentModules.filter(m => m.id !== module.id);
      return { ...prev, modules: newModules };
    });
  };

  const handleModulePriceChange = (moduleId: string, newPrice: string) => {
    const price = parseFloat(newPrice) || 0;
    setFormData(prev => {
        const updatedModules = (prev.modules || []).map(m => 
            m.id === moduleId ? { ...m, price: price } : m
        );
        return { ...prev, modules: updatedModules };
    });
  };

  useEffect(() => {
    const total = formData.modules?.reduce((sum, module) => sum + module.price, 0) || 0;
    setFormData(prev => ({ ...prev, totalValue: total }));
  }, [formData.modules]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Lead);
  };

  const handleDelete = () => {
    if (lead?.id) {
      onDelete(lead.id);
    }
  };
  
  const handleAddNote = () => {
    if (lead?.id && newNote.trim()) {
      onAddNote(lead.id, newNote);
      setNewNote('');
    }
  };

  const renderHistoryIcon = (type: HistoryEntryType) => {
    const iconClass = "h-5 w-5 rounded-full p-0.5";
    switch (type) {
        case 'creation':
            return <PlusCircleIcon className={`${iconClass} bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300`} />;
        case 'status_change':
            return <ArrowRightIcon className={`${iconClass} bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-300`} />;
        case 'note':
            return <MessageSquareIcon className={`${iconClass} bg-yellow-100 text-yellow-600 dark:bg-yellow-900/50 dark:text-yellow-300`} />;
        default:
            return null;
    }
  };

  const selectedModuleIds = useMemo(() => {
    return new Set(formData.modules?.map(m => m.id));
  }, [formData.modules]);

  return (
    <>
    <div className="fixed inset-0 bg-black bg-opacity-60 z-40 flex justify-center items-center p-4 transition-opacity duration-300" onClick={onClose}>
      <div
        className="bg-white dark:bg-neutral-dark w-full max-w-lg rounded-xl shadow-2xl transform transition-transform duration-300 scale-95 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-neutral-medium dark:border-neutral-darkest">
          <h2 className="text-xl font-bold">{lead ? 'Editar Lead' : 'Adicionar Novo Lead'}</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-neutral-medium dark:hover:bg-neutral-darkest transition-colors">
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        
        {lead && (
            <div className="p-3 flex items-center gap-4 border-b border-neutral-medium dark:border-neutral-darkest bg-neutral-light dark:bg-neutral-dark/50">
                <button type="button" onClick={() => handleScrollTo(detailsRef)} className="text-sm font-semibold text-brand-primary hover:underline">
                    Ir para Detalhes
                </button>
                <button type="button" onClick={() => handleScrollTo(historyRef)} className="text-sm font-semibold text-brand-primary hover:underline">
                    Ir para Histórico
                </button>
            </div>
        )}

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          <div className="p-6 space-y-4 flex-1 overflow-y-auto">
            {/* Lead Details */}
            <div ref={detailsRef} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium">Nome</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-neutral-darkest border border-neutral-medium dark:border-neutral-dark rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary" />
              </div>
              <div>
                <label htmlFor="company" className="block text-sm font-medium">Empresa</label>
                <input type="text" id="company" name="company" value={formData.company} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-neutral-darkest border border-neutral-medium dark:border-neutral-dark rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary" />
              </div>
              <div>
                <label htmlFor="ramo" className="block text-sm font-medium">Ramo de Atividade</label>
                <input type="text" id="ramo" name="ramo" value={formData.ramo} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-neutral-darkest border border-neutral-medium dark:border-neutral-dark rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium">Email</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-neutral-darkest border border-neutral-medium dark:border-neutral-dark rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary" />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium">Telefone</label>
                <div className="relative">
                  <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-neutral-darkest border border-neutral-medium dark:border-neutral-dark rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary" />
                  {formData.phone && (
                    <a href={`https://wa.me/${formData.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="absolute inset-y-0 right-0 flex items-center pr-3 text-green-500 hover:text-green-400">
                      <WhatsAppIcon className="h-6 w-6" />
                    </a>
                  )}
                </div>
              </div>
               <div>
                <label htmlFor="campaignId" className="block text-sm font-medium">Campanha de Origem</label>
                <select 
                    id="campaignId" 
                    name="campaignId" 
                    value={formData.campaignId || ''} 
                    onChange={handleChange} 
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-neutral-darkest border border-neutral-medium dark:border-neutral-dark rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary"
                >
                    <option value="">Nenhuma</option>
                    {campaigns.map(campaign => (
                        <option key={campaign.id} value={campaign.id}>{campaign.name}</option>
                    ))}
                </select>
              </div>
            </div>
            {/* Modules Section */}
            <div>
              <label className="block text-sm font-medium mb-2">Módulos do Sistema</label>
              <div className="space-y-3 p-3 bg-neutral-light dark:bg-neutral-darkest/50 rounded-lg">
                {availableModules.map(module => {
                  const isSelected = selectedModuleIds.has(module.id);
                  const currentModulePrice = formData.modules?.find(m => m.id === module.id)?.price;
                  return (
                    <div key={module.id} className={`p-3 rounded-md transition-colors ${isSelected ? 'bg-blue-100 dark:bg-blue-900/30' : 'hover:bg-neutral-medium dark:hover:bg-neutral-dark'}`}>
                      <div className="flex items-center justify-between">
                        <label htmlFor={module.id} className="flex items-center space-x-3 cursor-pointer">
                          <input type="checkbox" id={module.id} name={module.name} checked={isSelected} onChange={(e) => handleModuleChange(module, e.target.checked)} className="h-5 w-5 rounded text-brand-primary focus:ring-brand-secondary" />
                          <span className="flex-1 text-sm font-semibold">{module.name}</span>
                        </label>
                        {!isSelected && <span className="text-xs text-gray-500 dark:text-gray-400">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(module.price)}</span>}
                      </div>
                      {isSelected && (
                        <div className="mt-2 pl-8">
                          <label htmlFor={`${module.id}-price`} className="text-xs font-medium">Valor do Módulo (R$):</label>
                          <input type="number" id={`${module.id}-price`} value={currentModulePrice ?? module.price} onChange={(e) => handleModulePriceChange(module.id, e.target.value)} className="mt-1 block w-full px-2 py-1 text-sm bg-white dark:bg-neutral-darkest border border-neutral-medium dark:border-neutral-dark rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary" placeholder="0.00" />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex justify-between items-center">
              <span className="font-bold text-lg text-brand-primary dark:text-brand-secondary">Valor Total do Contrato:</span>
              <span className="font-bold text-xl text-neutral-darkest dark:text-neutral-light">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(formData.totalValue || 0)}
              </span>
            </div>

            {/* Communication Templates Section */}
            {lead && (
              <div>
                <div className="border-t border-neutral-medium dark:border-neutral-darkest/50 my-4"></div>
                 <h3 className="text-lg font-semibold mb-3">Modelos de Comunicação</h3>
                 <div className="p-4 bg-neutral-light dark:bg-neutral-darkest/50 rounded-lg space-y-3">
                   <select
                      value={selectedTemplateId}
                      onChange={e => setSelectedTemplateId(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-neutral-darkest border border-neutral-medium dark:border-neutral-dark rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary"
                   >
                     <option value="">Selecione um modelo...</option>
                     {templates.map(template => (
                       <option key={template.id} value={template.id}>{template.title}</option>
                     ))}
                   </select>
                   {parsedTemplateBody && (
                     <div className="relative">
                        <textarea
                          readOnly
                          value={parsedTemplateBody}
                          className="w-full px-3 py-2 bg-white dark:bg-neutral-darkest border border-neutral-medium dark:border-neutral-dark rounded-md shadow-sm min-h-[150px] resize-y"
                          rows={6}
                        />
                        <button
                          type="button"
                          onClick={handleCopyToClipboard}
                          className="absolute top-2 right-2 px-3 py-1 text-xs font-semibold text-white bg-brand-primary rounded-md hover:bg-brand-secondary"
                        >
                          {copySuccess || 'Copiar'}
                        </button>
                     </div>
                   )}
                 </div>
              </div>
            )}


            {/* Calendar Integration Section */}
            {lead && (
              <div>
                <div className="border-t border-neutral-medium dark:border-neutral-darkest/50 my-4"></div>
                 <h3 className="text-lg font-semibold mb-3">Integração com Agenda</h3>
                 <div className="p-4 bg-neutral-light dark:bg-neutral-darkest/50 rounded-lg">
                    {formData.googleCalendarLinked ? (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <p className="text-sm font-medium text-green-600 dark:text-green-400">Sincronizado com Google Agenda.</p>
                                <button type="button" onClick={() => onToggleCalendarLink(lead.id)} className="flex items-center gap-2 text-sm text-red-500 hover:text-red-400">
                                    <UnlinkIcon className="h-4 w-4" /> Desvincular
                                </button>
                            </div>
                             <div className="space-y-2">
                                {(formData.calendarEvents || []).map(event => (
                                    <div key={event.id} className="flex justify-between items-center text-sm p-2 bg-white dark:bg-neutral-dark rounded-md">
                                        <div>
                                            <p className="font-semibold">{event.title}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {new Date(event.start).toLocaleString('pt-BR')} - {new Date(event.end).toLocaleTimeString('pt-BR')}
                                            </p>
                                        </div>
                                        <button type="button" onClick={() => onDeleteEvent(lead.id, event.id)} className="p-1 text-red-500 hover:text-red-400">
                                            <TrashIcon className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                             </div>
                            <button type="button" onClick={() => setIsScheduleModalOpen(true)} className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-brand-secondary rounded-lg hover:bg-brand-primary">
                                <CalendarIcon className="h-5 w-5" /> Agendar Evento
                            </button>
                        </div>
                    ) : (
                        <button type="button" onClick={() => onToggleCalendarLink(lead.id)} className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-neutral-dark dark:bg-neutral-darkest rounded-lg hover:bg-neutral-darkest dark:hover:bg-neutral-dark">
                            <LinkIcon className="h-5 w-5" /> Sincronizar com Google Agenda
                        </button>
                    )}
                 </div>
              </div>
            )}


            {/* History Section */}
            {lead && (
            <div ref={historyRef}>
              <div className="border-t border-neutral-medium dark:border-neutral-darkest/50 my-4"></div>
              <div>
                <h3 className="text-lg font-semibold mb-3">Histórico de Interações</h3>
                <div className="space-y-4">
                    <div className="flex flex-col gap-2">
                        <textarea 
                            value={newNote} 
                            onChange={(e) => setNewNote(e.target.value)} 
                            placeholder="Adicionar uma anotação detalhada..." 
                            className="flex-1 px-3 py-2 bg-white dark:bg-neutral-darkest border border-neutral-medium dark:border-neutral-dark rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary min-h-[80px] resize-y"
                            rows={4}
                        />
                        <button 
                            type="button" 
                            onClick={handleAddNote} 
                            disabled={!newNote.trim()} 
                            className="self-end px-4 py-2 text-sm font-medium text-white bg-brand-primary rounded-lg shadow-sm hover:bg-brand-secondary disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                        >
                            Salvar Anotação
                        </button>
                    </div>
                  <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                    {(formData.history || []).map(entry => (
                      <div key={entry.id} className="flex gap-3 items-start">
                        <div className="mt-1">{renderHistoryIcon(entry.type)}</div>
                        <div className="flex-1">
                          <p className="text-sm text-neutral-darkest dark:text-neutral-light whitespace-pre-wrap">{entry.content}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            <ClockIcon className="h-3 w-3" />
                            {new Date(entry.date).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))}
                    {(formData.history || []).length === 0 && <p className="text-center text-sm text-gray-500 py-4">Nenhum histórico para este lead.</p>}
                  </div>
                </div>
              </div>
            </div>
            )}
          </div>
          <div className="flex justify-between items-center p-4 bg-neutral-light dark:bg-neutral-darkest/50 rounded-b-xl mt-auto">
            {lead && (
              <button type="button" onClick={handleDelete} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-status-lost rounded-lg shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors">
                <TrashIcon className="h-5 w-5" />
                Excluir
              </button>
            )}
            {!lead && <div />}
            <button type="submit" className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-brand-primary rounded-lg shadow-sm hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-secondary transition-colors">
              <SaveIcon className="h-5 w-5" />
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
    {isScheduleModalOpen && lead && (
        <ScheduleEventModal 
            onClose={() => setIsScheduleModalOpen(false)}
            onSave={(event) => {
                onScheduleEvent(lead.id, event);
                setIsScheduleModalOpen(false);
            }}
        />
    )}
    </>
  );
};

export default LeadModal;