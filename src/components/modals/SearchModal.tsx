import React, { useEffect, useRef, useState } from 'react';
import { SearchFilters, SearchResult } from '../../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Mock search data
const searchData = {
  patients: [
    { id: 'MPI-12345', name: 'María González', age: 45, status: 'Estable' },
    { id: 'MPI-12346', name: 'Juan Pérez', age: 52, status: 'Requiere Revisión' },
    { id: 'MPI-12347', name: 'Ana Martínez', age: 38, status: 'Estable' }
  ],
  alerts: [
    { type: 'Crítica', title: 'Frecuencia Cardíaca Elevada', patient: 'María González', date: '2024-01-15' },
    { type: 'Media', title: 'Disminución en Actividad Física', patient: 'María González', date: '2024-01-14' },
    { type: 'Baja', title: 'Patrón de Sueño Irregular', patient: 'María González', date: '2024-01-13' }
  ],
  tasks: [
    { title: 'Revisar resultados de laboratorio', priority: 'Alta', assignee: 'Dr. García', due: '2024-01-15' },
    { title: 'Seguimiento de adherencia a medicación', priority: 'Media', assignee: 'Enfermera López', due: '2024-01-16' },
    { title: 'Evaluar patrón de sueño irregular', priority: 'Baja', assignee: 'Dr. García', due: '2024-01-20' }
  ],
  timeline: [
    { type: 'Consulta', title: 'Consulta Cardiológica', date: '2024-01-13', source: 'EHR' },
    { type: 'Sueño', title: 'Resumen de Sueño', date: '2024-01-14', source: 'Oura Ring' },
    { type: 'Medicación', title: 'Medicación Tomada', date: '2024-01-15', source: 'Sistema de Adherencia' }
  ]
};

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    patients: true,
    alerts: true,
    tasks: true,
    timeline: true,
    dateFrom: '',
    dateTo: ''
  });
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);

  // Focus management
  useEffect(() => {
    if (isOpen) {
      // Focus the input when modal opens
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);

      // Handle Escape key
      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          onClose();
        }
      };

      // Trap focus within modal
      const handleTabKey = (event: KeyboardEvent) => {
        if (event.key === 'Tab') {
          const focusableElements = modalRef.current?.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          
          if (focusableElements && focusableElements.length > 0) {
            const firstElement = focusableElements[0] as HTMLElement;
            const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

            if (event.shiftKey) {
              if (document.activeElement === firstElement) {
                event.preventDefault();
                lastElement.focus();
              }
            } else {
              if (document.activeElement === lastElement) {
                event.preventDefault();
                firstElement.focus();
              }
            }
          }
        }
      };

      document.addEventListener('keydown', handleEscape);
      document.addEventListener('keydown', handleTabKey);

      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.removeEventListener('keydown', handleTabKey);
      };
    }
  }, [isOpen, onClose]);

  // Perform search
  const performSearch = () => {
    if (!searchTerm.trim()) {
      alert('Por favor ingrese un término de búsqueda');
      return;
    }

    const searchResults: SearchResult[] = [];
    const term = searchTerm.toLowerCase();

    // Search in patients
    if (filters.patients) {
      searchData.patients.forEach(patient => {
        if (patient.name.toLowerCase().includes(term) || 
            patient.id.toLowerCase().includes(term) ||
            patient.status.toLowerCase().includes(term)) {
          searchResults.push({
            type: 'Paciente',
            title: patient.name,
            subtitle: `ID: ${patient.id} - ${patient.status}`,
            icon: '👤'
          });
        }
      });
    }

    // Search in alerts
    if (filters.alerts) {
      searchData.alerts.forEach(alert => {
        if (alert.title.toLowerCase().includes(term) ||
            alert.type.toLowerCase().includes(term)) {
          if (!filters.dateFrom || !filters.dateTo || 
              (alert.date >= filters.dateFrom && alert.date <= filters.dateTo)) {
            searchResults.push({
              type: 'Alerta',
              title: alert.title,
              subtitle: `${alert.type} - ${alert.patient}`,
              icon: '⚠️'
            });
          }
        }
      });
    }

    // Search in tasks
    if (filters.tasks) {
      searchData.tasks.forEach(task => {
        if (task.title.toLowerCase().includes(term) ||
            task.assignee.toLowerCase().includes(term)) {
          searchResults.push({
            type: 'Tarea',
            title: task.title,
            subtitle: `${task.priority} - ${task.assignee}`,
            icon: '✅'
          });
        }
      });
    }

    // Search in timeline
    if (filters.timeline) {
      searchData.timeline.forEach(event => {
        if (event.title.toLowerCase().includes(term) ||
            event.source.toLowerCase().includes(term)) {
          if (!filters.dateFrom || !filters.dateTo || 
              (event.date >= filters.dateFrom && event.date <= filters.dateTo)) {
            searchResults.push({
              type: 'Timeline',
              title: event.title,
              subtitle: `${event.source} - ${event.date}`,
              icon: '📅'
            });
          }
        }
      });
    }

    setResults(searchResults);
    setShowResults(true);
  };

  // Handle backdrop click
  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 modal-backdrop"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="search-modal-title"
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 id="search-modal-title" className="text-lg font-semibold text-gray-900">
              Búsqueda Avanzada
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 focus-trap"
              aria-label="Cerrar modal de búsqueda"
            >
              <span className="text-xl">✕</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <div className="space-y-4">
            {/* Search Categories */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar en:
              </label>
              <div className="flex flex-wrap gap-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.patients}
                    onChange={(e) => setFilters(prev => ({ ...prev, patients: e.target.checked }))}
                    className="mr-2 focus-trap"
                  />
                  <span className="text-sm">Pacientes</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.alerts}
                    onChange={(e) => setFilters(prev => ({ ...prev, alerts: e.target.checked }))}
                    className="mr-2 focus-trap"
                  />
                  <span className="text-sm">Alertas</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.tasks}
                    onChange={(e) => setFilters(prev => ({ ...prev, tasks: e.target.checked }))}
                    className="mr-2 focus-trap"
                  />
                  <span className="text-sm">Tareas</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.timeline}
                    onChange={(e) => setFilters(prev => ({ ...prev, timeline: e.target.checked }))}
                    className="mr-2 focus-trap"
                  />
                  <span className="text-sm">Timeline</span>
                </label>
              </div>
            </div>

            {/* Search Input */}
            <div>
              <label htmlFor="search-input" className="block text-sm font-medium text-gray-700 mb-2">
                Término de búsqueda:
              </label>
              <input
                id="search-input"
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && performSearch()}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus-trap"
                placeholder="Ingrese término de búsqueda..."
              />
            </div>

            {/* Date Filters */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filtros de fecha:
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="date-from" className="block text-xs text-gray-500 mb-1">
                    Desde:
                  </label>
                  <input
                    id="date-from"
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus-trap"
                  />
                </div>
                <div>
                  <label htmlFor="date-to" className="block text-xs text-gray-500 mb-1">
                    Hasta:
                  </label>
                  <input
                    id="date-to"
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus-trap"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 focus-trap"
            >
              Cancelar
            </button>
            <button
              onClick={performSearch}
              className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 focus-trap"
            >
              Buscar
            </button>
          </div>
        </div>

        {/* Search Results */}
        {showResults && (
          <div className="border-t border-gray-200 p-6 max-h-64 overflow-y-auto custom-scrollbar">
            <h4 className="font-medium text-gray-900 mb-3">Resultados de búsqueda:</h4>
            <div className="space-y-2">
              {results.length === 0 ? (
                <p className="text-gray-500 text-sm">No se encontraron resultados</p>
              ) : (
                results.map((result, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer focus-trap"
                    tabIndex={0}
                    role="button"
                    aria-label={`Resultado: ${result.title}`}
                  >
                    <span className="text-lg" aria-hidden="true">{result.icon}</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{result.title}</p>
                      <p className="text-xs text-gray-500">{result.type} - {result.subtitle}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchModal;
