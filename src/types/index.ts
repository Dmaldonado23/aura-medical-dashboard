export interface Patient {
  id: string;
  name: string;
  age: number;
  status: 'Estable' | 'Requiere Revisión' | 'Crítico';
  lastUpdate: string;
}

export interface VitalSign {
  label: string;
  value: string;
  source: string;
  lastUpdate: string;
  icon: string;
  color: string;
}

export interface Alert {
  id: string;
  type: 'Crítica' | 'Media' | 'Baja' | 'Positiva';
  title: string;
  description: string;
  patient: string;
  date: string;
  source: string;
  severity: 'Alta' | 'Media' | 'Baja';
  icon: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'Alta' | 'Media' | 'Baja';
  assignee: string;
  dueDate: string;
  completed: boolean;
}

export interface TimelineEvent {
  id: string;
  type: 'Consulta' | 'Sueño' | 'Medicación' | 'Laboratorio';
  title: string;
  description: string;
  date: string;
  source: string;
  color: string;
}

export interface DataSource {
  id: string;
  name: string;
  description: string;
  status: 'Conectado' | 'Desconectado' | 'Sincronizando';
  lastSync: string;
  dataTypes: string[];
}

export interface Settings {
  theme: 'light' | 'dark' | 'auto';
  refreshRate: number;
  enableNotifications: boolean;
  enableSounds: boolean;
  autoSave: boolean;
}

export type SectionType = 'dashboard' | 'timeline' | 'datasources' | 'tasks' | 'alerts';

export interface SearchFilters {
  patients: boolean;
  alerts: boolean;
  tasks: boolean;
  timeline: boolean;
  dateFrom?: string;
  dateTo?: string;
}

export interface SearchResult {
  type: string;
  title: string;
  subtitle: string;
  icon: string;
}

export interface ExportOptions {
  reportType: 'complete' | 'vitals' | 'alerts' | 'timeline' | 'tasks';
  format: 'pdf' | 'json' | 'csv' | 'xlsx';
  dateFrom: string;
  dateTo: string;
}
