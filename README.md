# Aura - Plataforma de Inteligencia Médica Proactiva

Una aplicación moderna de dashboard médico construida con React, TypeScript, Tailwind CSS y Chart.js, diseñada para proporcionar una experiencia de usuario accesible y profesional para el monitoreo de pacientes.

## 🚀 Características

### Arquitectura Moderna
- **React 19** con TypeScript para type safety
- **Vite** como bundler moderno con hot reload
- **Tailwind CSS** para estilos utilitarios y diseño responsivo
- **Chart.js** para visualizaciones de datos interactivas
- **Gestión de dependencias local** (sin CDNs)

### Accesibilidad (A11y)
- **HTML Semántico** con etiquetas apropiadas (`<header>`, `<nav>`, `<main>`, `<section>`)
- **Modales completamente accesibles** con:
  - `role="dialog"` y `aria-modal="true"`
  - Gestión de foco (focus trapping)
  - Cierre con tecla Escape
  - Etiquetas ARIA apropiadas
- **Navegación por teclado** completa
- **Soporte para lectores de pantalla**

### Funcionalidades Principales
- **Dashboard Principal** con signos vitales en tiempo real
- **Línea de Tiempo** del paciente con eventos cronológicos
- **Fuentes de Datos** con estado de integraciones
- **Tareas Clínicas** con gestión de pendientes
- **Alertas Proactivas** con diferentes niveles de severidad
- **Búsqueda Avanzada** con filtros múltiples
- **Exportación de Reportes** en múltiples formatos
- **Configuraciones** personalizables

### Optimizaciones de Rendimiento
- **Tree-shaking** automático para JavaScript
- **PurgeCSS** integrado para eliminar CSS no utilizado
- **Code splitting** con chunks manuales
- **Lazy loading** de componentes
- **Minificación** automática en producción

## 📁 Estructura del Proyecto

```
/
├── public/
│   └── index.html              # Plantilla HTML principal
├── src/
│   ├── components/
│   │   ├── charts/
│   │   │   └── CorrelationChart.tsx    # Componente Chart.js
│   │   ├── modals/
│   │   │   ├── SearchModal.tsx         # Modal de búsqueda accesible
│   │   │   ├── SettingsModal.tsx       # Modal de configuraciones
│   │   │   └── ExportModal.tsx         # Modal de exportación
│   │   └── ui/                         # Componentes UI reutilizables
│   ├── styles/
│   │   └── main.css                    # Estilos principales con Tailwind
│   ├── types/
│   │   └── index.ts                    # Definiciones de tipos TypeScript
│   ├── utils/
│   │   └── localStorage.ts             # Utilidades para localStorage
│   ├── App.tsx                         # Componente principal
│   └── main.tsx                        # Punto de entrada
├── tailwind.config.js                  # Configuración de Tailwind CSS
├── vite.config.ts                      # Configuración de Vite
├── tsconfig.json                       # Configuración de TypeScript
└── package.json                        # Dependencias y scripts
```

## 🛠️ Instalación y Desarrollo

### Prerrequisitos
- Node.js 18+ 
- npm o yarn

### Instalación
```bash
# Clonar el repositorio
git clone <repository-url>
cd aura-medical-platform

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

### Scripts Disponibles
```bash
npm run dev      # Servidor de desarrollo (puerto 8000)
npm run build    # Build de producción
npm run preview  # Preview del build de producción
npm run lint     # Verificación de tipos TypeScript
```

## 🎨 Sistema de Diseño

### Colores Principales
- **Primary**: Azul (#3b82f6) - Elementos principales y navegación
- **Secondary**: Gris (#e5e7eb) - Elementos secundarios
- **Success**: Verde (#22c55e) - Estados positivos y confirmaciones
- **Warning**: Amarillo (#f59e0b) - Alertas de atención
- **Danger**: Rojo (#ef4444) - Alertas críticas y errores

### Tipografía
- **Fuente Principal**: Inter (Google Fonts)
- **Jerarquía**: h1-h6 con escalas apropiadas
- **Legibilidad**: Contraste optimizado para accesibilidad

### Componentes
- **Cards**: Con efectos hover y sombras sutiles
- **Botones**: Estados focus, hover y disabled
- **Modales**: Completamente accesibles con backdrop blur
- **Navegación**: Estados activos y focus visible

## 📊 Integración de Chart.js

### Características
- **Configuración Modular**: Separación clara entre datos, opciones y renderizado
- **Actualización Dinámica**: Uso de `chart.update()` en lugar de recrear
- **Responsive**: Adaptación automática a diferentes tamaños
- **Accesible**: Etiquetas ARIA y descripciones apropiadas

### Tipos de Gráficos
- **Correlación de Métricas**: Gráficos de línea con doble eje Y
- **Comparativas Temporales**: Visualización de tendencias
- **Estados en Tiempo Real**: Indicadores dinámicos

## 🔧 Configuración de Tailwind CSS

### Personalización
```javascript
// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: { /* Paleta personalizada */ },
        // ... más colores
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      }
    }
  }
}
```

### Utilidades Personalizadas
- **Transiciones**: Efectos suaves para sidebar y contenido
- **Animaciones**: Fade-in, slide-up, pulse para elementos dinámicos
- **Focus Management**: Estilos consistentes para navegación por teclado

## ♿ Accesibilidad

### Cumplimiento WCAG 2.1
- **Nivel AA** de contraste de colores
- **Navegación por teclado** completa
- **Lectores de pantalla** compatibles
- **Focus management** apropiado en modales

### Características Específicas
- **Skip links** para navegación rápida
- **Landmarks** semánticos apropiados
- **Live regions** para actualizaciones dinámicas
- **Reduced motion** respetado

## 🔒 Gestión de Estado

### LocalStorage
- **Persistencia** de configuraciones de usuario
- **Error handling** robusto
- **Hooks personalizados** para React integration
- **Limpieza automática** de datos obsoletos

### Estado de la Aplicación
- **React State** para UI temporal
- **Context API** para estado global (futuro)
- **Optimistic updates** para mejor UX

## 📱 Responsive Design

### Breakpoints
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

### Adaptaciones
- **Sidebar**: Colapsible en móviles
- **Grids**: Responsive con CSS Grid
- **Typography**: Escalas fluidas
- **Touch targets**: Mínimo 44px

## 🚀 Optimizaciones de Producción

### Build Process
- **Minificación**: CSS y JavaScript
- **Tree-shaking**: Eliminación de código no utilizado
- **Code splitting**: Chunks optimizados
- **Asset optimization**: Imágenes y fuentes

### Performance
- **Lazy loading**: Componentes bajo demanda
- **Memoization**: React.memo para componentes pesados
- **Virtual scrolling**: Para listas grandes (futuro)
- **Service workers**: Para caching (futuro)

## 🧪 Testing (Futuro)

### Estrategia de Testing
- **Unit Tests**: Jest + React Testing Library
- **Integration Tests**: Cypress
- **Accessibility Tests**: axe-core
- **Visual Regression**: Chromatic

## 📈 Monitoreo y Analytics (Futuro)

### Métricas
- **Core Web Vitals**: LCP, FID, CLS
- **User Experience**: Tiempo en página, interacciones
- **Error Tracking**: Sentry integration
- **Performance**: Bundle analyzer

## 🤝 Contribución

### Estándares de Código
- **ESLint**: Configuración estricta
- **Prettier**: Formateo automático
- **Husky**: Git hooks para calidad
- **Conventional Commits**: Mensajes estandarizados

### Pull Request Process
1. Fork del repositorio
2. Crear feature branch
3. Implementar cambios con tests
4. Verificar accesibilidad
5. Crear PR con descripción detallada

## 📄 Licencia

Este proyecto está bajo la licencia ISC. Ver el archivo `LICENSE` para más detalles.

## 🆘 Soporte

Para reportar bugs o solicitar features:
- **Issues**: GitHub Issues
- **Documentación**: Wiki del proyecto
- **Contacto**: [email de soporte]

---

**Desarrollado con ❤️ por el equipo de Aura Medical**
