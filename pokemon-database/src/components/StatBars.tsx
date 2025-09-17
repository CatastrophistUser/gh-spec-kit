import { Pokemon } from '../types';

interface StatBarsProps {
  pokemon: Pokemon;
  className?: string;
}

export default function StatBars({ pokemon, className = '' }: StatBarsProps) {
  const stats = pokemon.stats.map(stat => ({
    name: stat.stat.name.replace('-', ' ').toUpperCase(),
    value: stat.base_stat,
    max: 255,
  }));

  const getStatColor = (statName: string) => {
    const colors: { [key: string]: string } = {
      'HP': 'bg-red-500',
      'ATTACK': 'bg-orange-500',
      'DEFENSE': 'bg-blue-500',
      'SPECIAL ATTACK': 'bg-purple-500',
      'SPECIAL DEFENSE': 'bg-green-500',
      'SPEED': 'bg-yellow-500',
    };
    return colors[statName] || 'bg-gray-500';
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {stats.map((stat, index) => {
        const percentage = (stat.value / stat.max) * 100;
        return (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {stat.name}
              </span>
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                {stat.value}
              </span>
            </div>
            <div className="stat-bar">
              <div
                className={`stat-fill ${getStatColor(stat.name)}`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
