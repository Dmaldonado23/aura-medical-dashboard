import React, { useEffect, useRef, useState } from 'react';
import { ExportOptions } from '../../types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const firstSelectRef = useRef<HTMLSelectElement>(null);
  
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    reportType: 'complete',
    format: 'pdf',
    dateFrom: '',
    dateTo: ''
  });

  // Set default dates when modal opens
  useEffect(() => {
    if (isOpen) {
      const today = new Date().toISOString().split('T')[0];
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      setExportOptions(prev => ({
        ...prev,
        dateFrom: weekAgo,
        dateTo: today
      }));

      // Focus management
      setTimeout(() => {
        firstSelectRef.current?.focus();
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

  // Generate report data based on type
  const generateReportData = (options: ExportOptions) => {
    const baseData = {
      patient: {
        name: 'María González',
        id: 'MPI-12345',
        age: 45,
        status: 'Estable'
      },
      exportDate: new Date().toISOString(),
      dateRange: { from: options.dateFrom, to: options.dateTo }
    };

    switch (options.reportType) {
      case 'complete':
        return {
          ...baseData,
          vitals: {
            heartRate: '72 bpm',
            activity: '8,450 steps',
            glucose: '95 mg/dL',
            nextAppointment: '3 días'
          },
          alerts: [
            { type: 'Crítica', title: 'Frecuencia Cardíaca Elevada', patient: 'María González', date: '2024-01-15' },
            { type: 'Media', title: 'Disminución en Actividad Física', patient: 'María González', date: '2024-01-14' }
          ],
          tasks: [
            { title: 'Revisar resultados de laboratorio', priority: 'Alta', assignee: 'Dr. García', due: '2024-01-15' }
          ],
          timeline: [
            { type: 'Consulta', title: 'Consulta Cardiológica', date: '2024-01-13', source: 'EHR' }
          ]
        };
      case 'vitals':
        return {
          ...baseData,
          vitals: {
            heartRate: '72 bpm',
            activity: '8,450 steps',
            glucose: '95 mg/dL',
            nextAppointment: '3 días'
          }
        };
      case 'alerts':
        return {
          ...baseData,
          alerts: [
            { type: 'Crítica', title: 'Frecuencia Cardíaca Elevada', patient: 'María González', date: '2024-01-15' },
            { type: 'Media', title: 'Disminución en Actividad Física', patient: 'María González', date: '2024-01-14' }
          ]
        };
      case 'timeline':
        return {
          ...baseData,
          timeline: [
            { type: 'Consulta', title: 'Consulta Cardiológica', date: '2024-01-13', source: 'EHR' },
            { type: 'Sueño', title: 'Resumen de Sueño', date: '2024-01-14', source: 'Oura Ring' }
          ]
        };
      case 'tasks':
        return {
          ...baseData,
          tasks: [
            { title: 'Revisar resultados de laboratorio', priority: 'Alta', assignee: 'Dr. García', due: '2024-01-15' },
            { title: 'Seguimiento de adherencia a medicación', priority: 'Media', assignee: 'Enfermera López', due: '2024-01-16' }
          ]
        };
      default:
        return baseData;
    }
  };

  // Download functions
  const downloadJSON = (data: any, filename: string) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadCSV = (data: any, filename: string) => {
    let csv = '';
    
    // Add patient info
    csv += 'Información del Paciente\n';
    csv += `Nombre,${data.patient.name}\n`;
    csv += `ID,${data.patient.id}\n`;
    csv += `Edad,${data.patient.age}\n`;
    csv += `Estado,${data.patient.status}\n\n`;

    // Add vitals if present
    if (data.vitals) {
      csv += 'Signos Vitales\n';
      csv += `Frecuencia Cardíaca,${data.vitals.heartRate}\n`;
      csv += `Actividad,${data.vitals.activity}\n`;
      csv += `Glucosa,${data.vitals.glucose}\n`;
      csv += `Próxima Cita,${data.vitals.nextAppointment}\n\n`;
    }

    // Add alerts if present
    if (data.alerts) {
      csv += 'Alertas\n';
      csv += 'Tipo,Título,Paciente,Fecha\n';
      data.alerts.forEach((alert: any) => {
        csv += `${alert.type},${alert.title},${alert.patient},${alert.date}\n`;
      });
      csv += '\n';
    }

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Export report
  const handleExport = () => {
    try {
      if (!exportOptions.dateFrom || !exportOptions.dateTo) {
        showNotification('Por favor seleccione un rango de fechas válido', 'error');
        return;
      }

      const reportData = generateReportData(exportOptions);
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `aura_report_${exportOptions.reportType}_${timestamp}`;

      switch (exportOptions.format) {
        case 'json':
          downloadJSON(reportData, `${filename}.json`);
          break;
        case 'csv':
          downloadCSV(reportData, `${filename}.csv`);
          break;
        case 'pdf':
          // Simulate PDF generation
          showNotification('Funcionalidad de PDF en desarrollo. En una aplicación real, se usaría una librería como jsPDF.', 'error');
          return;
        case 'xlsx':
          // Simulate Excel generation
          showNotification('Funcionalidad de Excel en desarrollo. En una aplicación real, se usaría una librería como SheetJS.', 'error');
          return;
      }

      showNotification(`Reporte ${exportOptions.reportType} exportado en formato ${exportOptions.format.toUpperCase()}`, 'success');
      onClose();
    } catch (error) {
      console.error('Error exporting report:', error);
      showNotification('Error al exportar el reporte', 'error');
    }
  };

  // Simple notification function
  const showNotification = (message: string, type: 'success' | 'error') => {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transition-all duration-300 ${
      type === 'success' ? 'bg-success-500 text-white' : 'bg-danger-500 text-white'
    }`;
    notification.textContent = message;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'polite');

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (notification.parentNode) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 3000);
  };

  // Handle backdrop click
  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  // Update export options
  const updateOption = <K extends keyof ExportOptions>(key: K, value: ExportOptions[K]) => {
    setExportOptions(prev => ({
      ...prev,
      [key]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 modal-backdrop"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-modal-title"
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-md animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 id="export-modal-title" className="text-lg font-semibold text-gray-900">
              Exportar Reporte
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 focus-trap"
              aria-label="Cerrar modal de exportación"
            >
              <span className="text-xl">✕</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {/* Report Type */}
          <div>
            <label htmlFor="report-type" className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de reporte:
            </label>
            <select
              id="report-type"
              ref={firstSelectRef}
              value={exportOptions.reportType}
              onChange={(e) => updateOption('reportType', e.target.value as ExportOptions['reportType'])}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus-trap"
            >
              <option value="complete">Reporte completo</option>
              <option value="vitals">Solo signos vitales</option>
              <option value="alerts">Solo alertas</option>
              <option value="timeline">Timeline del paciente</option>
              <option value="tasks">Tareas clínicas</option>
            </select>
          </div>

          {/* Export Format */}
          <div>
            <label htmlFor="export-format" className="block text-sm font-medium text-gray-700 mb-2">
              Formato:
            </label>
            <select
              id="export-format"
              value={exportOptions.format}
              onChange={(e) => updateOption('format', e.target.value as ExportOptions['format'])}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus-trap"
            >
              <option value="pdf">PDF</option>
              <option value="json">JSON</option>
              <option value="csv">CSV</option>
              <option value="xlsx">Excel</option>
            </select>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rango de fechas:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="export-date-from" className="block text-xs text-gray-500 mb-1">
                  Desde:
                </label>
                <input
                  id="export-date-from"
                  type="date"
                  value={exportOptions.dateFrom}
                  onChange={(e) => updateOption('dateFrom', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus-trap"
                />
              </div>
              <div>
                <label htmlFor="export-date-to" className="block text-xs text-gray-500 mb-1">
                  Hasta:
                </label>
                <input
                  id="export-date-to"
                  type="date"
                  value={exportOptions.dateTo}
                  onChange={(e) => updateOption('dateTo', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus-trap"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 focus-trap"
          >
            Cancelar
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-success-500 text-white rounded-md hover:bg-success-600 focus-trap"
          >
            Exportar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
