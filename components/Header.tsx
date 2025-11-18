import React from 'react';
import { PlusCircleIcon, BriefcaseIcon, SettingsIcon, ColumnsIcon, MegaphoneIcon, MessageSquareTextIcon, GitHubIcon, LogOutIcon } from './icons';

interface HeaderProps {
  onAddLead: () => void;
  onOpenModulesModal: () => void;
  onOpenFunnelModal: () => void;
  onOpenCampaignsModal: () => void;
  onOpenTemplatesModal: () => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAddLead, onOpenModulesModal, onOpenFunnelModal, onOpenCampaignsModal, onOpenTemplatesModal, onLogout }) => {
  return (
    <header className="bg-white dark:bg-neutral-darkest shadow-md sticky top-0 z-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <BriefcaseIcon className="h-8 w-8 text-brand-primary" />
            <h1 className="text-xl sm:text-2xl font-bold text-neutral-darkest dark:text-neutral-light">
              CRM Funil de Vendas
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onLogout}
              className="p-2 text-neutral-dark dark:text-neutral-light rounded-full hover:bg-neutral-medium dark:hover:bg-neutral-dark transition-colors"
              aria-label="Sair do sistema"
            >
              <LogOutIcon className="h-6 w-6" />
            </button>
            <a
              href="https://github.com/aistudio-app/crm-funil-de-vendas"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-neutral-dark dark:text-neutral-light rounded-full hover:bg-neutral-medium dark:hover:bg-neutral-dark transition-colors"
              aria-label="Conectar ao GitHub"
            >
              <GitHubIcon className="h-6 w-6" />
            </a>
            <button
              onClick={onOpenTemplatesModal}
              className="p-2 text-neutral-dark dark:text-neutral-light rounded-full hover:bg-neutral-medium dark:hover:bg-neutral-dark transition-colors"
              aria-label="Gerenciar Modelos de Comunicação"
            >
              <MessageSquareTextIcon className="h-6 w-6" />
            </button>
             <button
              onClick={onOpenCampaignsModal}
              className="p-2 text-neutral-dark dark:text-neutral-light rounded-full hover:bg-neutral-medium dark:hover:bg-neutral-dark transition-colors"
              aria-label="Gerenciar Campanhas"
            >
              <MegaphoneIcon className="h-6 w-6" />
            </button>
            <button
              onClick={onOpenFunnelModal}
              className="p-2 text-neutral-dark dark:text-neutral-light rounded-full hover:bg-neutral-medium dark:hover:bg-neutral-dark transition-colors"
              aria-label="Gerenciar Etapas do Funil"
            >
              <ColumnsIcon className="h-6 w-6" />
            </button>
            <button
              onClick={onOpenModulesModal}
              className="p-2 text-neutral-dark dark:text-neutral-light rounded-full hover:bg-neutral-medium dark:hover:bg-neutral-dark transition-colors"
              aria-label="Gerenciar Módulos"
            >
              <SettingsIcon className="h-6 w-6" />
            </button>
            <button
              onClick={onAddLead}
              className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-brand-primary rounded-lg shadow-sm hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-secondary transition-all"
            >
              <PlusCircleIcon className="h-5 w-5" />
              <span className="hidden sm:inline">Adicionar Lead</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;