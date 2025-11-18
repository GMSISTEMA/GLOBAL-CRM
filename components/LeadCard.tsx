import React from 'react';
import { Lead, Campaign, CampaignSource } from '../types';
import { BuildingIcon, DollarSignIcon, UserIcon, WhatsAppIcon, PhoneIcon, TagIcon, GoogleIcon, InstagramIcon, GlobeIcon, MegaphoneIcon, AlertTriangleIcon } from './icons';

interface LeadCardProps {
  lead: Lead;
  campaigns: Campaign[];
  onClick: () => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd: () => void;
}

const CampaignSourceIcon: React.FC<{ source: CampaignSource, className?: string }> = ({ source, className = "h-4 w-4" }) => {
    switch(source) {
        case 'Google': return <GoogleIcon className={`${className} text-red-500`} />;
        case 'Instagram': return <InstagramIcon className={`${className} text-pink-500`} />;
        case 'Landing Page': return <GlobeIcon className={`${className} text-blue-500`} />;
        default: return <MegaphoneIcon className={`${className} text-gray-500`} />;
    }
};

const LeadCard: React.FC<LeadCardProps> = ({ lead, campaigns, onClick, onDragStart, onDragEnd }) => {

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    const phone = lead.phone.replace(/\D/g, '');
    if (phone) {
      window.open(`https://wa.me/${phone}`, '_blank', 'noopener,noreferrer');
    }
  };

  const handlePhoneClick = (e: React.MouseEvent) => {
      e.stopPropagation();
  };

  const campaign = lead.campaignId ? campaigns.find(c => c.id === lead.campaignId) : null;
  
  const isOverdue = React.useMemo(() => {
    if (!lead.lastContact) {
      return false;
    }
    const lastContactDate = new Date(lead.lastContact);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return lastContactDate < sevenDaysAgo;
  }, [lead.lastContact]);

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className="bg-white dark:bg-neutral-darkest p-4 rounded-lg shadow-md cursor-grab active:cursor-grabbing transition-all hover:-translate-y-1 hover:scale-[1.02] hover:shadow-xl border border-neutral-200 dark:border-neutral-700 border-l-4 border-brand-secondary"
    >
      <div className="flex items-center space-x-3 mb-2">
        <UserIcon className="h-5 w-5 text-neutral-dark dark:text-neutral-light" />
        <div className="flex items-center gap-2 min-w-0">
          <p className="font-bold text-lg text-neutral-darkest dark:text-neutral-light truncate" title={lead.name}>{lead.name}</p>
          {isOverdue && (
            <div className="relative group flex-shrink-0">
              <AlertTriangleIcon className="h-5 w-5 text-amber-500" />
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max text-center text-xs text-white bg-neutral-darkest py-1 px-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                Contato há mais de 7 dias
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="space-y-2 text-sm text-neutral-dark dark:text-neutral-light">
        <div className="flex items-center space-x-2">
          <BuildingIcon className="h-4 w-4 text-gray-500" />
          <span 
            className="truncate hover:underline cursor-pointer" 
            title={lead.company}
            onClick={onClick}
          >
            {lead.company}
          </span>
        </div>
        {lead.ramo && (
          <div className="flex items-center space-x-2">
            <TagIcon className="h-4 w-4 text-gray-500" />
            <span 
              className="truncate hover:underline cursor-pointer" 
              title={lead.ramo}
              onClick={onClick}
            >
              {lead.ramo}
            </span>
          </div>
        )}
         {campaign && (
          <div className="flex items-center space-x-2">
            <CampaignSourceIcon source={campaign.source} />
            <span className="truncate text-xs font-semibold" title={campaign.name}>
              {campaign.name}
            </span>
          </div>
        )}
        <div className="flex items-center justify-between pt-2 border-t border-neutral-200 dark:border-neutral-700 mt-2">
          <div className="flex items-center space-x-2">
            <DollarSignIcon className="h-4 w-4 text-green-500" />
            <span className="font-semibold">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(lead.totalValue)}</span>
          </div>
          {lead.phone && (
            <div className="flex items-center gap-3">
               <a
                href={`tel:${lead.phone.replace(/\D/g, '')}`}
                onClick={handlePhoneClick}
                className="text-blue-500 hover:text-blue-400 transition-colors"
                aria-label="Ligar para o contato"
              >
                <PhoneIcon className="h-5 w-5" />
              </a>
              <a
                href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleWhatsAppClick}
                className="text-green-500 hover:text-green-400 transition-colors"
                aria-label="Contactar no WhatsApp"
              >
                <WhatsAppIcon className="h-6 w-6" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadCard;