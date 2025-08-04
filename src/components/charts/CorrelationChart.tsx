import React, { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface CorrelationChartProps {
  metric: 'sleep-glucose' | 'activity-bp' | 'stress-hr';
  className?: string;
}

// Chart configurations separated into data blocks
const chartConfigurations: Record<string, ChartData<'line'>> = {
  'sleep-glucose': {
    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    datasets: [
      {
        label: 'Horas de Sueño',
        data: [7.5, 6.8, 7.2, 8.1, 7.0, 8.5, 7.8],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        yAxisID: 'y',
        tension: 0.4,
      },
      {
        label: 'Glucosa (mg/dL)',
        data: [95, 102, 98, 88, 105, 85, 92],
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        yAxisID: 'y1',
        tension: 0.4,
      }
    ]
  },
  'activity-bp': {
    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    datasets: [
      {
        label: 'Pasos (miles)',
        data: [8.4, 6.2, 9.1, 7.8, 5.5, 10.2, 8.9],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        yAxisID: 'y',
        tension: 0.4,
      },
      {
        label: 'Presión Sistólica',
        data: [125, 132, 118, 122, 138, 115, 120],
        borderColor: 'rgb(168, 85, 247)',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        yAxisID: 'y1',
        tension: 0.4,
      }
    ]
  },
  'stress-hr': {
    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    datasets: [
      {
        label: 'Nivel de Estrés (1-10)',
        data: [3, 6, 4, 7, 8, 2, 3],
        borderColor: 'rgb(245, 158, 11)',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        yAxisID: 'y',
        tension: 0.4,
      },
      {
        label: 'FC Promedio',
        data: [68, 75, 70, 78, 82, 65, 69],
        borderColor: 'rgb(236, 72, 153)',
        backgroundColor: 'rgba(236, 72, 153, 0.1)',
        yAxisID: 'y1',
        tension: 0.4,
      }
    ]
  }
};

// Chart options configuration block
const getChartOptions = (): ChartOptions<'line'> => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index',
    intersect: false,
  },
  scales: {
    x: {
      display: true,
      title: {
        display: true,
        text: 'Días de la Semana',
        font: {
          family: 'Inter',
          size: 12,
        }
      },
      grid: {
        color: 'rgba(0, 0, 0, 0.1)',
      }
    },
    y: {
      type: 'linear',
      display: true,
      position: 'left',
      title: {
        display: true,
        text: 'Valor Primario',
        font: {
          family: 'Inter',
          size: 12,
        }
      },
      grid: {
        color: 'rgba(0, 0, 0, 0.1)',
      }
    },
    y1: {
      type: 'linear',
      display: true,
      position: 'right',
      title: {
        display: true,
        text: 'Valor Secundario',
        font: {
          family: 'Inter',
          size: 12,
        }
      },
      grid: {
        drawOnChartArea: false,
        color: 'rgba(0, 0, 0, 0.1)',
      },
    }
  },
  plugins: {
    legend: {
      position: 'top',
      labels: {
        font: {
          family: 'Inter',
          size: 12,
        },
        usePointStyle: true,
        padding: 20,
      }
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleFont: {
        family: 'Inter',
        size: 14,
      },
      bodyFont: {
        family: 'Inter',
        size: 12,
      },
      cornerRadius: 8,
      displayColors: true,
    }
  },
  elements: {
    point: {
      radius: 4,
      hoverRadius: 6,
    },
    line: {
      borderWidth: 2,
    }
  }
});

const CorrelationChart: React.FC<CorrelationChartProps> = ({ metric, className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<ChartJS<'line'> | null>(null);

  useEffect(() => {
    if (!canvasRef.current) {
      console.error('Canvas reference not found');
      return;
    }

    // Destroy existing chart instance
    if (chartInstance.current) {
      chartInstance.current.destroy();
      chartInstance.current = null;
    }

    try {
      // Get chart data and options
      const chartData = chartConfigurations[metric];
      const chartOptions = getChartOptions();

      if (!chartData) {
        console.error(`Chart configuration not found for metric: ${metric}`);
        return;
      }

      // Create new chart instance
      chartInstance.current = new ChartJS(canvasRef.current, {
        type: 'line',
        data: chartData,
        options: chartOptions,
      });

      console.log(`Chart created successfully for metric: ${metric}`);
    } catch (error) {
      console.error('Error creating chart:', error);
    }

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [metric]);

  // Method to update chart data dynamically (for future use)
  const updateChartData = (newData: ChartData<'line'>) => {
    if (chartInstance.current) {
      try {
        chartInstance.current.data = newData;
        chartInstance.current.update('active');
        console.log('Chart data updated successfully');
      } catch (error) {
        console.error('Error updating chart data:', error);
      }
    }
  };

  // Expose update method for parent components (removed for now, can be added with proper ref forwarding if needed)

  return (
    <div className={`relative w-full h-64 ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        role="img"
        aria-label={`Gráfico de correlación para ${metric}`}
      />
    </div>
  );
};

export default CorrelationChart;
