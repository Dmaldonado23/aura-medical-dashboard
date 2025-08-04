import React, { useEffect, useRef, useState } from 'react';
import { Settings } from '../../types';
import { LocalStorage } from '../../utils/localStorage';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsChange: (settings: Settings) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onSettingsChange }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLSelectElement>(null);
  
  const [settings, setSettings] = useState<Settings>({
    theme: 'light',
    refreshRate: 30,
    enableNotifications: true,
    enableSounds: false,
    autoSave: true
  });

  // Load settings from localStorage when modal opens
  useEffect(() => {
    if (isOpen) {
      const savedSettings = LocalStorage.load<Settings>('settings');
      if (savedSettings) {
        setSettings(savedSettings);
      }

      // Focus management
      setTimeout(() => {
        firstInputRef.current?.focus();
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

  // Save settings
  const handleSave = () => {
    try {
      // Save to localStorage
      const success = LocalStorage.save('settings', settings);
      
      if (success) {
        // Notify parent component
        onSettingsChange(settings);
        
        // Show success notification
        showNotification('Configuraciones guardadas exitosamente', 'success');
        
        // Close modal
        onClose();
      } else {
        showNotification('Error al guardar configuraciones', 'error');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      showNotification('Error al guardar configuraciones', 'error');
    }
  };

  // Simple notification function (can be enhanced with a proper notification system)
  const showNotification = (message: string, type: 'success' | 'error') => {
    // This is a simple implementation - in a real app, you'd use a proper notification system
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transition-all duration-300 ${
      type === 'success' ? 'bg-success-500 text-white' : 'bg-danger-500 text-white'
    }`;
    notification.textContent = message;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'polite');

    document.body.appendChild(notification);

    // Auto remove after 3 seconds
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

  // Update settings state
  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings(prev => ({
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
      aria-labelledby="settings-modal-title"
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-md animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 id="settings-modal-title" className="text-lg font-semibold text-gray-900">
              Configuraciones
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 focus-trap"
              aria-label="Cerrar modal de configuraciones"
            >
              <span className="text-xl">✕</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {/* Theme Setting */}
          <div>
            <label htmlFor="theme-selector" className="block text-sm font-medium text-gray-700 mb-2">
              Tema:
            </label>
            <select
              id="theme-selector"
              ref={firstInputRef}
              value={settings.theme}
              onChange={(e) => updateSetting('theme', e.target.value as Settings['theme'])}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus-trap"
            >
              <option value="light">Claro</option>
              <option value="dark">Oscuro</option>
              <option value="auto">Automático</option>
            </select>
          </div>

          {/* Refresh Rate Setting */}
          <div>
            <label htmlFor="refresh-rate" className="block text-sm font-medium text-gray-700 mb-2">
              Frecuencia de actualización:
            </label>
            <select
              id="refresh-rate"
              value={settings.refreshRate}
              onChange={(e) => updateSetting('refreshRate', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus-trap"
            >
              <option value={10}>10 segundos</option>
              <option value={30}>30 segundos</option>
              <option value={60}>1 minuto</option>
              <option value={300}>5 minutos</option>
            </select>
          </div>

          {/* Notifications Setting */}
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.enableNotifications}
                onChange={(e) => updateSetting('enableNotifications', e.target.checked)}
                className="mr-2 focus-trap"
              />
              <span className="text-sm font-medium text-gray-700">Habilitar notificaciones</span>
            </label>
            <p className="text-xs text-gray-500 mt-1 ml-6">
              Recibir alertas y notificaciones del sistema
            </p>
          </div>

          {/* Sounds Setting */}
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.enableSounds}
                onChange={(e) => updateSetting('enableSounds', e.target.checked)}
                className="mr-2 focus-trap"
              />
              <span className="text-sm font-medium text-gray-700">Sonidos de alerta</span>
            </label>
            <p className="text-xs text-gray-500 mt-1 ml-6">
              Reproducir sonidos para alertas críticas
            </p>
          </div>

          {/* Auto Save Setting */}
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.autoSave}
                onChange={(e) => updateSetting('autoSave', e.target.checked)}
                className="mr-2 focus-trap"
              />
              <span className="text-sm font-medium text-gray-700">Guardado automático</span>
            </label>
            <p className="text-xs text-gray-500 mt-1 ml-6">
              Guardar cambios automáticamente
            </p>
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
            onClick={handleSave}
            className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 focus-trap"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
