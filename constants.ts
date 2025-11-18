import { FunnelStage, Module, Campaign, CommunicationTemplate } from './types';

export const DEFAULT_FUNNEL_STAGES: FunnelStage[] = [
  { id: 'new-lead', title: 'Novo Lead', color: 'bg-blue-500' },
  { id: 'contacted', title: 'Contactado', color: 'bg-sky-500' },
  { id: 'proposal', title: 'Proposta', color: 'bg-indigo-500' },
  { id: 'negotiation', title: 'Negociação', color: 'bg-purple-500' },
  { id: 'won', title: 'Ganhou', color: 'bg-status-won' },
  { id: 'lost', title: 'Perdeu', color: 'bg-status-lost' },
];

export const DEFAULT_MODULES: Module[] = [
  { id: 'module-fin', name: 'Financeiro', price: 15000 },
  { id: 'module-stock', name: 'Estoque', price: 12000 },
  { id: 'module-rh', name: 'RH', price: 10000 },
  { id: 'module-sales', name: 'Vendas (CRM)', price: 18000 },
  { id: 'module-bi', name: 'Business Intelligence', price: 25000 },
  { id: 'module-prod', name: 'Produção (PCP)', price: 22000 },
];

export const DEFAULT_CAMPAIGNS: Campaign[] = [
  { id: 'camp-1', name: 'Google Ads Q4', source: 'Google', color: 'bg-red-500' },
  { id: 'camp-2', name: 'Feirão de Software', source: 'Landing Page', color: 'bg-blue-500' },
  { id: 'camp-3', name: 'Reels Patrocinado', source: 'Instagram', color: 'bg-pink-500' },
  { id: 'camp-4', name: 'Indicação de Parceiro', source: 'Outro', color: 'bg-gray-500' },
];

export const DEFAULT_COMMUNICATION_TEMPLATES: CommunicationTemplate[] = [
  { id: 'tpl-1', title: 'Primeiro Contato (Pós-Levantada de Mão)', body: 'Olá {{lead.name}},\n\nMeu nome é [Seu Nome] e falo em nome da [Sua Empresa].\n\nVi que você demonstrou interesse em nosso software de gestão. Gostaria de agendar uma breve conversa para entender melhor os desafios da {{lead.company}} e como podemos ajudar.\n\nQual seria o melhor horário para você?\n\nAtenciosamente,' },
  { id: 'tpl-2', title: 'Follow-up (Pós-Proposta)', body: 'Olá {{lead.name}},\n\nTudo bem?\n\nGostaria de saber se você teve a oportunidade de analisar a proposta que enviei para a {{lead.company}}.\n\nFico à disposição para esclarecer qualquer dúvida que tenha surgido.\n\nUm abraço,' }
];
