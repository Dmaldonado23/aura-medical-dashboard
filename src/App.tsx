import React, { useState, useEffect } from 'react';
import { SectionType, Settings, VitalSign, Alert, Task, TimelineEvent, DataSource } from './types';
import { LocalStorage } from './utils/localStorage';
import CorrelationChart from './components/charts/CorrelationChart';
import SearchModal from './components/modals/SearchModal';
import SettingsModal from './components/modals/SettingsModal';
import ExportModal from './components/modals/ExportModal';

// Mock data
const mockVitalSigns: VitalSign[] = [
  {
    label: 'Frecuencia Cardíaca',
    value: '72 bpm',
    source: 'Oura Ring',
    lastUpdate: 'Hace 2h',
    icon: '❤️',
    color: 'red'
  },
  {
    label: 'Nivel de Actividad',
    value: '8,450',
    source: 'HealthKit',
    lastUpdate: 'Hoy',
    icon: '🚶',
    color: 'blue'
  },
  {
    label: 'Glucosa',
    value: '95 mg/dL',
    source: 'Monitor CGM',
    lastUpdate: 'Hace 15min',
    icon: '🩸',
    color: 'yellow'
  },
  {
    label: 'Próxima Cita',
    value: '3 días',
    source: 'EHR',
    lastUpdate: 'Cardiología',
    icon: '📅',
    color: 'green'
  }
];

const mockAlerts: Alert[] = [
  {
    id: '1',
    type: 'Media',
    title: 'Disminución en Actividad Física',
    description: '30% menos actividad esta semana. Correlacionado con aumento en presión arterial.',
    patient: 'María González',
    date: '2024-01-15',
    source: 'HealthKit',
    severity: 'Media',
    icon: '⚠️'
  },
  {
    id: '2',
    type: 'Baja',
    title: 'Patrón de Sueño Irregular',
    description: 'Variabilidad del 40% en horarios de sueño. Considerar evaluación del sueño.',
    patient: 'María González',
    date: '2024-01-14',
    source: 'Oura Ring',
    severity: 'Baja',
    icon: '💡'
  },
  {
    id: '3',
    type: 'Positiva',
    title: 'Adherencia a Medicación',
    description: 'Excelente adherencia del 95% en las últimas 2 semanas.',
    patient: 'María González',
    date: '2024-01-13',
    source: 'Sistema de Adherencia',
    severity: 'Baja',
    icon: '✅'
  }
];

const mockTimelineEvents: TimelineEvent[] = [
  {
    id: '1',
    type: 'Consulta',
    title: 'Consulta Cardiológica',
    description: 'Evaluación rutinaria. Presión arterial estable. Continuar con medicación actual.',
    date: 'Hace 2 días',
    source: 'EHR - Hospital Central',
    color: 'blue'
  },
  {
    id: '2',
    type: 'Sueño',
    title: 'Resumen de Sueño',
    description: '7h 23min de sueño. Calidad: Buena. REM: 1h 45min.',
    date: 'Anoche',
    source: 'Oura Ring',
    color: 'purple'
  },
  {
    id: '3',
    type: 'Medicación',
    title: 'Medicación Tomada',
    description: 'Lisinopril 10mg - Confirmado por sensor inteligente',
    date: 'Hace 3 horas',
    source: 'Sistema de Adherencia',
    color: 'green'
  }
];

const mockDataSources: DataSource[] = [
  {
    id: '1',
    name: 'EHR Clínica Central',
    description: 'Sistema de historiales médicos electrónicos',
    status: 'Conectado',
    lastSync: 'Hace 5 minutos',
    dataTypes: ['Historiales', 'Citas', 'Resultados']
  },
  {
    id: '2',
    name: 'Oura Ring',
    description: 'Dispositivo de monitoreo de sueño y actividad',
    status: 'Conectado',
    lastSync: 'Hace 2 horas',
    dataTypes: ['Sueño', 'FC', 'Actividad']
  },
  {
    id: '3',
    name: 'Apple HealthKit',
    description: 'Plataforma de datos de salud de iOS',
    status: 'Conectado',
    lastSync: 'Hace 1 hora',
    dataTypes: ['Pasos', 'Peso', 'Presión']
  },
  {
    id: '4',
    name: 'Monitor CGM',
    description: 'Monitor continuo de glucosa',
    status: 'Sincronizando',
    lastSync: 'Hace 15 minutos',
    dataTypes: ['Glucosa en tiempo real']
  }
];

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Revisar resultados de laboratorio',
    description: 'Analizar niveles de colesterol y ajustar medicación si es necesario',
    priority: 'Alta',
    assignee: 'Dr. García',
    dueDate: 'Hoy',
    completed: false
  },
  {
    id: '2',
    title: 'Seguimiento de adherencia a medicación',
    description: 'Contactar al paciente sobre la falta de sincronización del sistema de medicación',
    priority: 'Media',
    assignee: 'Enfermera López',
    dueDate: 'Mañana',
    completed: false
  },
  {
    id: '3',
    title: 'Programar cita de seguimiento',
    description: 'Cita programada para evaluación cardiológica en 3 días',
    priority: 'Media',
    assignee: 'Dr. García',
    dueDate: 'Completada',
    completed: true
  }
];

const App: React.FC = () => {
  // State management
  const [currentSection, setCurrentSection] = useState<SectionType>('dashboard');
  const [isSearchModalOpen, setSearchModalOpen] = useState(false);
  const [isSettingsModalOpen, setSettingsModalOpen] = useState(false);
  const [isExportModalOpen, setExportModalOpen] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<'sleep-glucose' | 'activity-bp' | 'stress-hr'>('sleep-glucose');
  const [settings, setSettings] = useState<Settings>({
    theme: 'light',
    refreshRate: 30,
    enableNotifications: true,
    enableSounds: false,
    autoSave: true
  });

  // Load settings on component mount
  useEffect(() => {
    const savedSettings = LocalStorage.load<Settings>('settings');
    if (savedSettings) {
      setSettings(savedSettings);
      applySettings(savedSettings);
    }
  }, []);

  // Apply settings
  const applySettings = (newSettings: Settings) => {
    // Apply theme
    if (newSettings.theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }

    console.log('Settings applied:', newSettings);
  };

  // Handle settings change
  const handleSettingsChange = (newSettings: Settings) => {
    setSettings(newSettings);
    applySettings(newSettings);
  };

  // Section management
  const showSection = (sectionName: SectionType) => {
    setCurrentSection(sectionName);
  };

  // Get section info
  const getSectionInfo = (section: SectionType) => {
    const sectionInfo = {
      dashboard: {
        title: 'Dashboard Principal',
        subtitle: 'Resumen integral del paciente'
      },
      timeline: {
        title: 'Línea de Tiempo',
        subtitle: 'Historial cronológico del paciente'
      },
      datasources: {
        title: 'Fuentes de Datos',
        subtitle: 'Estado de las integraciones'
      },
      tasks: {
        title: 'Tareas Clínicas',
        subtitle: 'Acciones pendientes y completadas'
      },
      alerts: {
        title: 'Alertas Proactivas',
        subtitle: 'Notificaciones y recomendaciones del sistema'
      }
    };
    return sectionInfo[section];
  };

  const currentSectionInfo = getSectionInfo(currentSection);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg sidebar-transition z-40">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800 gradient-text">Aura</h1>
                <p className="text-xs text-gray-500">Inteligencia Médica</p>
              </div>
            </div>
            <div className="flex space-x-1">
              <button
                onClick={() => setSearchModalOpen(true)}
                className="p-1 text-gray-500 hover:text-primary-600 transition-colors focus-trap"
                title="Búsqueda avanzada"
                aria-label="Abrir búsqueda avanzada"
              >
                <span className="text-lg">🔍</span>
              </button>
              <button
                onClick={() => setSettingsModalOpen(true)}
                className="p-1 text-gray-500 hover:text-primary-600 transition-colors focus-trap"
                title="Configuraciones"
                aria-label="Abrir configuraciones"
              >
                <span className="text-lg">⚙️</span>
              </button>
            </div>
          </div>
        </div>
        
        <nav className="mt-6" role="navigation" aria-label="Navegación principal">
          <div className="px-4 space-y-2">
            <button
              onClick={() => showSection('dashboard')}
              className={`nav-item w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg hover:bg-primary-50 transition-colors focus-trap ${
                currentSection === 'dashboard' ? 'active' : ''
              }`}
              aria-current={currentSection === 'dashboard' ? 'page' : undefined}
            >
              <span className="text-xl" aria-hidden="true">📊</span>
              <span className="font-medium">Dashboard</span>
            </button>
            <button
              onClick={() => showSection('timeline')}
              className={`nav-item w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg hover:bg-primary-50 transition-colors focus-trap ${
                currentSection === 'timeline' ? 'active' : ''
              }`}
              aria-current={currentSection === 'timeline' ? 'page' : undefined}
            >
              <span className="text-xl" aria-hidden="true">⏰</span>
              <span className="font-medium">Línea de Tiempo</span>
            </button>
            <button
              onClick={() => showSection('datasources')}
              className={`nav-item w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg hover:bg-primary-50 transition-colors focus-trap ${
                currentSection === 'datasources' ? 'active' : ''
              }`}
              aria-current={currentSection === 'datasources' ? 'page' : undefined}
            >
              <span className="text-xl" aria-hidden="true">🔗</span>
              <span className="font-medium">Fuentes de Datos</span>
            </button>
            <button
              onClick={() => showSection('tasks')}
              className={`nav-item w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg hover:bg-primary-50 transition-colors focus-trap ${
                currentSection === 'tasks' ? 'active' : ''
              }`}
              aria-current={currentSection === 'tasks' ? 'page' : undefined}
            >
              <span className="text-xl" aria-hidden="true">✅</span>
              <span className="font-medium">Tareas Clínicas</span>
            </button>
            <button
              onClick={() => showSection('alerts')}
              className={`nav-item w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg hover:bg-primary-50 transition-colors focus-trap ${
                currentSection === 'alerts' ? 'active' : ''
              }`}
              aria-current={currentSection === 'alerts' ? 'page' : undefined}
            >
              <span className="text-xl" aria-hidden="true">⚠️</span>
              <span className="font-medium">Alertas Proactivas</span>
            </button>
          </div>
        </nav>

        {/* User Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium">👨‍⚕️</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Dr. García</p>
              <p className="text-xs text-gray-500 truncate">Cardiólogo</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="ml-64 flex-1 content-transition">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{currentSectionInfo.title}</h2>
              <p className="text-sm text-gray-600 mt-1">{currentSectionInfo.subtitle}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setExportModalOpen(true)}
                className="px-3 py-2 bg-success-500 text-white text-sm rounded-lg hover:bg-success-600 transition-colors flex items-center space-x-2 focus-trap"
              >
                <span aria-hidden="true">📊</span>
                <span>Exportar</span>
              </button>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Paciente Actual</p>
                <p className="text-xs text-gray-500">María González - ID: 12345</p>
              </div>
              <div className="w-2 h-2 bg-success-500 rounded-full pulse-dot" aria-label="Estado: Conectado"></div>
            </div>
          </div>
        </header>

        {/* Section Content */}
        <div className="p-6">
          {/* Dashboard Section */}
          {currentSection === 'dashboard' && (
            <div className="space-y-6 animate-fade-in">
              {/* Patient Identity Card */}
              <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">MG</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">María González</h3>
                      <p className="text-gray-600">45 años • ID: MPI-12345</p>
                      <p className="text-sm text-gray-500">Última actualización: Hace 5 minutos</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-success-100 text-success-800">
                      <div className="w-2 h-2 bg-success-500 rounded-full mr-2"></div>
                      Estable
                    </div>
                  </div>
                </div>
              </section>

              {/* Digital Vital Signs */}
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Signos Vitales Digitales</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {mockVitalSigns.map((vital, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 card-hover">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">{vital.label}</p>
                          <p className="text-2xl font-bold text-gray-900">{vital.value}</p>
                          <p className="text-xs text-gray-500">{vital.source} • {vital.lastUpdate}</p>
                        </div>
                        <div className={`w-12 h-12 bg-${vital.color}-100 rounded-lg flex items-center justify-center`}>
                          <span className={`text-${vital.color}-600 text-xl`} aria-hidden="true">{vital.icon}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Charts and Alerts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Correlation Chart */}
                <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">Correlación de Métricas</h4>
                    <select
                      value={selectedMetric}
                      onChange={(e) => setSelectedMetric(e.target.value as typeof selectedMetric)}
                      className="text-sm border border-gray-300 rounded-md px-3 py-1 focus-trap"
                    >
                      <option value="sleep-glucose">Sueño vs Glucosa</option>
                      <option value="activity-bp">Actividad vs Presión</option>
                      <option value="stress-hr">Estrés vs Frecuencia Cardíaca</option>
                    </select>
                  </div>
                  <CorrelationChart metric={selectedMetric} />
                </section>

                {/* Proactive Alerts */}
                <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Alertas Proactivas</h4>
                  <div className="space-y-4">
                    {mockAlerts.map((alert) => (
                      <div
                        key={alert.id}
                        className={`flex items-start space-x-3 p-3 rounded-lg border ${
                          alert.type === 'Media' ? 'bg-warning-50 border-warning-200' :
                          alert.type === 'Baja' ? 'bg-primary-50 border-primary-200' :
                          'bg-success-50 border-success-200'
                        }`}
                      >
                        <span className={`text-lg ${
                          alert.type === 'Media' ? 'text-warning-600' :
                          alert.type === 'Baja' ? 'text-primary-600' :
                          'text-success-600'
                        }`} aria-hidden="true">
                          {alert.icon}
                        </span>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                          <p className="text-xs text-gray-600 mt-1">{alert.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          )}

          {/* Timeline Section */}
          {currentSection === 'timeline' && (
            <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-fade-in">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Línea de Tiempo del Paciente</h3>
              <div className="relative">
                <div className="absolute left-8 top-0 bottom-0 w-0.5 timeline-line"></div>
                
                <div className="space-y-6">
                  {mockTimelineEvents.map((event) => (
                    <div key={event.id} className="relative flex items-start space-x-4">
                      <div className={`relative z-10 w-4 h-4 bg-${event.color}-500 rounded-full border-2 border-white shadow`}></div>
                      <div className={`flex-1 bg-${event.color}-50 rounded-lg p-4 border border-${event.color}-200`}>
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-gray-900">
                            <span className="mr-2" aria-hidden="true">
                              {event.type === 'Consulta' ? '🏥' : event.type === 'Sueño' ? '💍' : '💊'}
                            </span>
                            {event.title}
                          </h5>
                          <span className="text-xs text-gray-500">{event.date}</span>
                        </div>
                        <p className="text-sm text-gray-600">{event.description}</p>
                        <div className={`mt-2 text-xs text-${event.color}-600`}>{event.source}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Data Sources Section */}
          {currentSection === 'datasources' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
              {mockDataSources.map((source) => (
                <div key={source.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 card-hover">
                  <div className="flex items-center justify-between mb-4">
                    <h5 className="font-medium text-gray-900">{source.name}</h5>
                    <div className={`w-3 h-3 rounded-full ${
                      source.status === 'Conectado' ? 'status-online' :
                      source.status === 'Sincronizando' ? 'status-warning' :
                      'status-error'
                    }`}></div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{source.description}</p>
                  <div className="text-xs text-gray-500 space-y-1">
                    <p>Última sincronización: {source.lastSync}</p>
                    <p>Estado: {source.status}</p>
                    <p>Datos: {source.dataTypes.join(', ')}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tasks Section */}
          {currentSection === 'tasks' && (
            <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-fade-in">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Tareas Clínicas Pendientes</h3>
                <button className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors focus-trap">
                  Nueva Tarea
                </button>
              </div>
              
              <div className="space-y-4">
                {mockTasks.map((task) => (
                  <div key={task.id} className={`flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors ${task.completed ? 'opacity-75' : ''}`}>
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => {/* Handle task completion */}}
                      className="w-5 h-5 text-primary-600 rounded focus-trap"
                    />
                    <div className="flex-1">
                      <h5 className={`font-medium text-gray-900 ${task.completed ? 'line-through' : ''}`}>
                        {task.title}
                      </h5>
                      <p className="text-sm text-gray-600">{task.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span>📅 Vence: {task.dueDate}</span>
                        <span>⚡ Prioridad: {task.priority}</span>
                        <span>👤 Asignado: {task.assignee}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Alerts Section */}
          {currentSection === 'alerts' && (
            <div className="space-y-6 animate-fade-in">
              <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Todas las Alertas</h3>
                <div className="space-y-4">
                  {mockAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`flex items-start space-x-4 p-4 rounded-lg border ${
                        alert.type === 'Crítica' ? 'bg-danger-50 border-danger-200' :
                        alert.type === 'Media' ? 'bg-warning-50 border-warning-200' :
                        alert.type === 'Baja' ? 'bg-primary-50 border-primary-200' :
                        'bg-success-50 border-success-200'
                      }`}
                    >
                      <span className={`text-2xl ${
                        alert.type === 'Crítica' ? 'text-danger-600' :
                        alert.type === 'Media' ? 'text-warning-600' :
                        alert.type === 'Baja' ? 'text-primary-600' :
                        'text-success-600'
                      }`} aria-hidden="true">
                        {alert.icon}
                      </span>
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900">{alert.title}</h5>
                        <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                        <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500">
                          <span>🕐 Detectado: {alert.date}</span>
                          <span>📊 Fuente: {alert.source}</span>
                          <span>⚡ Severidad: {alert.severity}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />
      
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        onSettingsChange={handleSettingsChange}
      />
      
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setExportModalOpen(false)}
      />
    </div>
  );
};

export default App;
