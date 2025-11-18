import React, { useState, useEffect } from 'react';
import { Campaign, CampaignSource } from '../types';
import { XIcon, SaveIcon, TrashIcon, PencilIcon, PlusCircleIcon } from './icons';

interface CampaignsModalProps {
  campaigns: Campaign[];
  onClose: () => void;
  onAdd: (campaign: Omit<Campaign, 'id'>) => void;
  onUpdate: (campaign: Campaign) => void;
  onDelete: (campaignId: string) => void;
}

const campaignSources: CampaignSource[] = ['Google', 'Instagram', 'Landing Page', 'Outro'];
const defaultColor = 'bg-gray-500';

const CampaignsModal: React.FC<CampaignsModalProps> = ({ campaigns, onClose, onAdd, onUpdate, onDelete }) => {
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [formData, setFormData] = useState({ name: '', source: 'Outro' as CampaignSource });

  useEffect(() => {
    if (editingCampaign) {
      setFormData({ name: editingCampaign.name, source: editingCampaign.source });
    } else {
      setFormData({ name: '', source: 'Outro' as CampaignSource });
    }
  }, [editingCampaign]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      alert('Por favor, preencha o nome da campanha.');
      return;
    }
    
    if (editingCampaign) {
      onUpdate({ ...editingCampaign, name: formData.name, source: formData.source });
    } else {
      onAdd({ name: formData.name, source: formData.source, color: defaultColor });
    }
    setEditingCampaign(null);
    setFormData({ name: '', source: 'Outro' as CampaignSource });
  };

  const handleEdit = (campaign: Campaign) => {
    setEditingCampaign(campaign);
  };
  
  const handleCancelEdit = () => {
    setEditingCampaign(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 transition-opacity duration-300" onClick={onClose}>
      <div
        className="bg-white dark:bg-neutral-dark w-full max-w-2xl rounded-xl shadow-2xl transform transition-transform duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-neutral-medium dark:border-neutral-darkest">
          <h2 className="text-xl font-bold">Gerenciar Campanhas de Marketing</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-neutral-medium dark:hover:bg-neutral-darkest transition-colors">
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-6 max-h-[70vh] flex flex-col">
          <div className="flex-1 overflow-y-auto mb-4 pr-2">
            <h3 className="text-lg font-semibold mb-2">Campanhas Atuais</h3>
            <div className="space-y-2">
              {campaigns.map(campaign => (
                <div key={campaign.id} className="flex items-center justify-between p-3 bg-neutral-light dark:bg-neutral-darkest/50 rounded-lg">
                  <div>
                    <p className="font-semibold">{campaign.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{campaign.source}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleEdit(campaign)} className="p-2 text-blue-500 hover:text-blue-400 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button onClick={() => onDelete(campaign.id)} className="p-2 text-red-500 hover:text-red-400 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
              {campaigns.length === 0 && <p className="text-center text-gray-500 dark:text-gray-400 py-4">Nenhuma campanha cadastrada.</p>}
            </div>
          </div>
          
          <div className="mt-auto pt-4 border-t border-neutral-medium dark:border-neutral-darkest">
            <h3 className="text-lg font-semibold mb-2">{editingCampaign ? 'Editando Campanha' : 'Adicionar Nova Campanha'}</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
              <div className="sm:col-span-1">
                <label htmlFor="name" className="block text-sm font-medium">Nome da Campanha</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-neutral-darkest border border-neutral-medium dark:border-neutral-dark rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary" />
              </div>
              <div className="sm:col-span-1">
                <label htmlFor="source" className="block text-sm font-medium">Origem</label>
                <select id="source" name="source" value={formData.source} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-neutral-darkest border border-neutral-medium dark:border-neutral-dark rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary">
                  {campaignSources.map(source => (
                    <option key={source} value={source}>{source}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-1 flex gap-2">
                 {editingCampaign && (
                    <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-neutral-darkest dark:text-neutral-light bg-neutral-medium dark:bg-neutral-dark rounded-lg shadow-sm hover:bg-neutral-300 dark:hover:bg-neutral-darkest"
                    >
                        Cancelar
                    </button>
                 )}
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-brand-primary rounded-lg shadow-sm hover:bg-brand-secondary"
                >
                  {editingCampaign ? <SaveIcon className="h-5 w-5" /> : <PlusCircleIcon className="h-5 w-5" />}
                  {editingCampaign ? 'Salvar' : 'Adicionar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignsModal;
