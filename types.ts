export type FunnelStatus = string;

export interface Module {
  id: string;
  name: string;
  price: number;
}

export type HistoryEntryType = 'creation' | 'status_change' | 'note';

export interface HistoryEntry {
  id: string;
  date: string; // ISO string
  type: HistoryEntryType;
  content: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string; // ISO string
  end: string;   // ISO string
}

export type CampaignSource = 'Google' | 'Instagram' | 'Landing Page' | 'Outro';

export interface Campaign {
  id: string;
  name: string;
  source: CampaignSource;
  color: string;
}

export interface CommunicationTemplate {
  id: string;
  title: string;
  body: string;
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  ramo: string; // Ramo de atividade da empresa
  email: string;
  phone: string;
  totalValue: number;
  modules: Module[];
  status: FunnelStatus;
  campaignId?: string | null;
  lastContact?: string;
  history?: HistoryEntry[];
  googleCalendarLinked: boolean;
  calendarEvents: CalendarEvent[];
}

export interface FunnelStage {
  id: string;
  title: string;
  color: string;
}