import React, { useState, useEffect } from 'react';
import { Module } from '../types';
import { XIcon, SaveIcon, TrashIcon, PencilIcon, PlusCircleIcon } from './icons';

interface ModulesModalProps {
  modules: Module[];
  onClose: () => void;
  onAdd: (module: Omit<Module, 'id'>) => void;
  onUpdate: (module: Module) => void;
  onDelete: (moduleId: string) => void;
}

const ModulesModal: React.FC<ModulesModalProps> = ({ modules, onClose, onAdd, onUpdate, onDelete }) => {
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [formData, setFormData] = useState({ name: '', price: '' });

  useEffect(() => {
    if (editingModule) {
      setFormData({ name: editingModule.name, price: String(editingModule.price) });
    } else {
      setFormData({ name: '', price: '' });
    }
  }, [editingModule]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(formData.price);
    if (!formData.name || isNaN(price)) {
      alert('Por favor, preencha o nome e um preço válido.');
      return;
    }
    
    if (editingModule) {
      onUpdate({ ...editingModule, name: formData.name, price });
    } else {
      onAdd({ name: formData.name, price });
    }
    setEditingModule(null);
    setFormData({ name: '', price: '' });
  };

  const handleEdit = (module: Module) => {
    setEditingModule(module);
  };
  
  const handleCancelEdit = () => {
    setEditingModule(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 transition-opacity duration-300" onClick={onClose}>
      <div
        className="bg-white dark:bg-neutral-dark w-full max-w-2xl rounded-xl shadow-2xl transform transition-transform duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-neutral-medium dark:border-neutral-darkest">
          <h2 className="text-xl font-bold">Gerenciar Módulos do Sistema</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-neutral-medium dark:hover:bg-neutral-darkest transition-colors">
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-6 max-h-[70vh] flex flex-col">
          <div className="flex-1 overflow-y-auto mb-4 pr-2">
            <h3 className="text-lg font-semibold mb-2">Módulos Atuais</h3>
            <div className="space-y-2">
              {modules.map(module => (
                <div key={module.id} className="flex items-center justify-between p-3 bg-neutral-light dark:bg-neutral-darkest/50 rounded-lg">
                  <div>
                    <p className="font-semibold">{module.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(module.price)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleEdit(module)} className="p-2 text-blue-500 hover:text-blue-400 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button onClick={() => onDelete(module.id)} className="p-2 text-red-500 hover:text-red-400 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
              {modules.length === 0 && <p className="text-center text-gray-500 dark:text-gray-400 py-4">Nenhum módulo cadastrado.</p>}
            </div>
          </div>
          
          <div className="mt-auto pt-4 border-t border-neutral-medium dark:border-neutral-darkest">
            <h3 className="text-lg font-semibold mb-2">{editingModule ? 'Editando Módulo' : 'Adicionar Novo Módulo'}</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
              <div className="sm:col-span-1">
                <label htmlFor="name" className="block text-sm font-medium">Nome do Módulo</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-neutral-darkest border border-neutral-medium dark:border-neutral-dark rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary" />
              </div>
              <div className="sm:col-span-1">
                <label htmlFor="price" className="block text-sm font-medium">Preço (R$)</label>
                <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-neutral-darkest border border-neutral-medium dark:border-neutral-dark rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary" placeholder="15000.00" />
              </div>
              <div className="sm:col-span-1 flex gap-2">
                 {editingModule && (
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
                  {editingModule ? <SaveIcon className="h-5 w-5" /> : <PlusCircleIcon className="h-5 w-5" />}
                  {editingModule ? 'Salvar' : 'Adicionar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModulesModal;
