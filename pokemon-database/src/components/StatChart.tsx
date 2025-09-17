import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Pokemon } from '../types';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface StatChartProps {
  pokemon: Pokemon;
  className?: string;
}

export default function StatChart({ pokemon, className = '' }: StatChartProps) {
  const stats = pokemon.stats.map(stat => ({
    name: stat.stat.name.replace('-', ' ').toUpperCase(),
    value: stat.base_stat,
  }));

  const data = {
    labels: stats.map(stat => stat.name),
    datasets: [
      {
        label: pokemon.name,
        data: stats.map(stat => stat.value),
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(59, 130, 246, 1)',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.label}: ${context.parsed.r}`;
          }
        }
      },
    },
    scales: {
      r: {
        beginAtZero: true,
        max: 255,
        ticks: {
          stepSize: 50,
        },
        grid: {
          color: 'rgba(156, 163, 175, 0.3)',
        },
        angleLines: {
          color: 'rgba(156, 163, 175, 0.3)',
        },
        pointLabels: {
          color: 'rgba(75, 85, 99, 1)',
          font: {
            size: 12,
            weight: 'bold' as const,
          },
        },
      },
    },
  };

  return (
    <div className={`w-full h-64 ${className}`}>
      <Radar data={data} options={options} />
    </div>
  );
}
