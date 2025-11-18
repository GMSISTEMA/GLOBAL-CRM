import { Lead } from './types';
import { DEFAULT_MODULES } from './constants';

const [modFin, modStock, modRh, modSales, modBi, modProd] = DEFAULT_MODULES;

export const initialLeads: Lead[] = [
  {
    id: 'lead-1',
    name: 'Ana Silva',
    company: 'Tech Solutions Ltda.',
    ramo: 'Consultoria TI',
    email: 'ana.silva@techsolutions.com',
    phone: '(11) 98765-4321',
    modules: [modFin, modSales, modBi],
    totalValue: modFin.price + modSales.price + modBi.price,
    status: 'new-lead',
    campaignId: 'camp-1',
    lastContact: '2023-10-26',
    history: [
      { id: 'hist-1', date: '2023-10-26T10:00:00Z', type: 'creation', content: 'Lead criado no sistema.' }
    ],
    googleCalendarLinked: false,
    calendarEvents: []
  },
  {
    id: 'lead-2',
    name: 'Bruno Costa',
    company: 'Inova Corp',
    ramo: 'Startup',
    email: 'bruno.costa@inovacorp.com',
    phone: '(21) 91234-5678',
    modules: [modStock, modProd],
    totalValue: modStock.price + modProd.price,
    status: 'contacted',
    campaignId: 'camp-2',
    lastContact: '2023-10-28',
    history: [
      { id: 'hist-2-1', date: '2023-10-27T14:00:00Z', type: 'creation', content: 'Lead criado no sistema.' },
      { id: 'hist-2-2', date: '2023-10-28T11:30:00Z', type: 'status_change', content: 'Status alterado de \'Novo Lead\' para \'Contactado\'.' }
    ],
    googleCalendarLinked: true,
    calendarEvents: [
        { id: 'evt-1', title: 'Reunião de Apresentação', start: '2023-11-10T14:00:00Z', end: '2023-11-10T15:00:00Z' }
    ]
  },
  {
    id: 'lead-3',
    name: 'Carla Dias',
    company: 'Mercado Global',
    ramo: 'Varejo',
    email: 'carla.dias@mercadoglobal.com',
    phone: '(31) 99999-8888',
    modules: [modFin, modStock, modRh, modSales, modBi, modProd],
    totalValue: modFin.price + modStock.price + modRh.price + modSales.price + modBi.price + modProd.price,
    status: 'proposal',
    campaignId: 'camp-3',
    lastContact: '2023-11-01',
    history: [
       { id: 'hist-3-1', date: '2023-10-29T09:00:00Z', type: 'creation', content: 'Lead criado no sistema.' },
    ],
    googleCalendarLinked: false,
    calendarEvents: []
  },
  {
    id: 'lead-4',
    name: 'Daniel Martins',
    company: 'Logística Eficiente',
    ramo: 'Logística',
    email: 'daniel.martins@logistica.com',
    phone: '(41) 98877-6655',
    modules: [modStock, modProd],
    totalValue: modStock.price + modProd.price,
    status: 'negotiation',
    campaignId: 'camp-1',
    lastContact: '2023-11-02',
     history: [
       { id: 'hist-4-1', date: '2023-10-30T16:00:00Z', type: 'creation', content: 'Lead criado no sistema.' },
    ],
    googleCalendarLinked: false,
    calendarEvents: []
  },
  {
    id: 'lead-5',
    name: 'Eduarda Ferreira',
    company: 'Consultoria ABC',
    ramo: 'Serviços',
    email: 'eduarda.f@consultoriaabc.com',
    phone: '(51) 99654-3210',
    modules: [modBi],
    totalValue: modBi.price,
    status: 'won',
    lastContact: '2023-10-25',
     history: [
       { id: 'hist-5-1', date: '2023-10-20T11:00:00Z', type: 'creation', content: 'Lead criado no sistema.' },
    ],
    googleCalendarLinked: false,
    calendarEvents: []
  },
  {
    id: 'lead-6',
    name: 'Fábio Souza',
    company: 'Varejo TOP',
    ramo: 'E-commerce',
    email: 'fabio.souza@varejotop.com',
    phone: '(61) 98123-4567',
    modules: [modSales],
    totalValue: modSales.price,
    status: 'lost',
    campaignId: 'camp-3',
    lastContact: '2023-10-29',
     history: [
       { id: 'hist-6-1', date: '2023-10-22T17:00:00Z', type: 'creation', content: 'Lead criado no sistema.' },
    ],
    googleCalendarLinked: false,
    calendarEvents: []
  },
  {
    id: 'lead-7',
    name: 'Gabriela Lima',
    company: 'Indústria Forte',
    ramo: 'Indústria',
    email: 'gabriela.lima@industriaforte.com',
    phone: '(71) 99876-5432',
    modules: [modProd],
    totalValue: modProd.price,
    status: 'new-lead',
     history: [
       { id: 'hist-7-1', date: '2023-11-03T08:30:00Z', type: 'creation', content: 'Lead criado no sistema.' },
    ],
    googleCalendarLinked: false,
    calendarEvents: []
  }
];