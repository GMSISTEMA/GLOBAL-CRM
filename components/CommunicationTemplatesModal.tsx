import React, { useState, useEffect } from 'react';
import { CommunicationTemplate } from '../types';
import { XIcon, SaveIcon, TrashIcon, PencilIcon, PlusCircleIcon } from './icons';

interface CommunicationTemplatesModalProps {
  templates: CommunicationTemplate[];
  onClose: () => void;
  onAdd: (template: Omit<CommunicationTemplate, 'id'>) => void;
  onUpdate: (template: CommunicationTemplate) => void;
  onDelete: (templateId: string) => void;
}

const CommunicationTemplatesModal: React.FC<CommunicationTemplatesModalProps> = ({ templates, onClose, onAdd, onUpdate, onDelete }) => {
  const [editingTemplate, setEditingTemplate] = useState<CommunicationTemplate | null>(null);
  const [formData, setFormData] = useState({ title: '', body: '' });

  useEffect(() => {
    if (editingTemplate) {
      setFormData({ title: editingTemplate.title, body: editingTemplate.body });
    } else {
      setFormData({ title: '', body: '' });
    }
  }, [editingTemplate]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.body) {
      alert('Por favor, preencha o título e o corpo do modelo.');
      return;
    }
    
    if (editingTemplate) {
      onUpdate({ ...editingTemplate, title: formData.title, body: formData.body });
    } else {
      onAdd({ title: formData.title, body: formData.body });
    }
    setEditingTemplate(null);
    setFormData({ title: '', body: '' });
  };

  const handleEdit = (template: CommunicationTemplate) => {
    setEditingTemplate(template);
  };
  
  const handleCancelEdit = () => {
    setEditingTemplate(null);
    setFormData({ title: '', body: '' });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 transition-opacity duration-300" onClick={onClose}>
      <div
        className="bg-white dark:bg-neutral-dark w-full max-w-3xl rounded-xl shadow-2xl transform transition-transform duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-neutral-medium dark:border-neutral-darkest">
          <h2 className="text-xl font-bold">Gerenciar Modelos de Comunicação</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-neutral-medium dark:hover:bg-neutral-darkest transition-colors">
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-6 max-h-[70vh] flex flex-col">
          <div className="flex-1 overflow-y-auto mb-4 pr-2">
            <h3 className="text-lg font-semibold mb-2">Modelos Salvos</h3>
            <div className="space-y-2">
              {templates.map(template => (
                <div key={template.id} className="flex items-start justify-between p-3 bg-neutral-light dark:bg-neutral-darkest/50 rounded-lg">
                  <div className="flex-1 mr-4">
                    <p className="font-semibold">{template.title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{template.body}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => handleEdit(template)} className="p-2 text-blue-500 hover:text-blue-400 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button onClick={() => onDelete(template.id)} className="p-2 text-red-500 hover:text-red-400 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
              {templates.length === 0 && <p className="text-center text-gray-500 dark:text-gray-400 py-4">Nenhum modelo cadastrado.</p>}
            </div>
          </div>
          
          <div className="mt-auto pt-4 border-t border-neutral-medium dark:border-neutral-darkest">
            <h3 className="text-lg font-semibold mb-2">{editingTemplate ? 'Editando Modelo' : 'Adicionar Novo Modelo'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium">Título do Modelo</label>
                <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-neutral-darkest border border-neutral-medium dark:border-neutral-dark rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary" />
              </div>
              <div>
                <label htmlFor="body" className="block text-sm font-medium">Corpo da Mensagem</label>
                 <textarea id="body" name="body" value={formData.body} onChange={handleChange} required rows={6} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-neutral-darkest border border-neutral-medium dark:border-neutral-dark rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary"></textarea>
                 <p className="text-xs text-gray-500 mt-1">
                   Use placeholders como <code className="bg-neutral-medium dark:bg-neutral-darkest/80 px-1 py-0.5 rounded">{'{{lead.name}}'}</code> e <code className="bg-neutral-medium dark:bg-neutral-darkest/80 px-1 py-0.5 rounded">{'{{lead.company}}'}</code>.
                 </p>
              </div>
              <div className="flex justify-end gap-2">
                 {editingTemplate && (
                    <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-neutral-darkest dark:text-neutral-light bg-neutral-medium dark:bg-neutral-dark rounded-lg shadow-sm hover:bg-neutral-300 dark:hover:bg-neutral-darkest"
                    >
                        Cancelar
                    </button>
                 )}
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-brand-primary rounded-lg shadow-sm hover:bg-brand-secondary"
                >
                  {editingTemplate ? <SaveIcon className="h-5 w-5" /> : <PlusCircleIcon className="h-5 w-5" />}
                  {editingTemplate ? 'Salvar Alterações' : 'Adicionar Modelo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunicationTemplatesModal;