import { useState } from 'react';
import { Pokemon, Move } from '../types';
import { useMove } from '../hooks/usePokemon';
import LoadingSpinner from './LoadingSpinner';

interface MovesetDisplayProps {
  pokemon: Pokemon;
  className?: string;
}

interface MoveItemProps {
  moveId: string;
  level?: number;
  method: string;
}

function MoveItem({ moveId, level, method }: MoveItemProps) {
  const { data: move, isLoading } = useMove(moveId);

  if (isLoading) {
    return <LoadingSpinner size="sm" />;
  }

  if (!move) {
    return null;
  }

  const getMethodColor = (methodName: string) => {
    const colors: { [key: string]: string } = {
      'level-up': 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
      'machine': 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200',
      'egg': 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
      'tutor': 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
    };
    return colors[methodName] || 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200';
  };

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
      <div className="flex-1">
        <div className="font-medium text-gray-900 dark:text-white capitalize">
          {move.name.replace('-', ' ')}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {move.type.name} • {move.damage_class.name} • {move.power || '--'} power • {move.accuracy || '--'}% acc
        </div>
      </div>
      <div className="flex items-center space-x-2">
        {level && (
          <span className="text-sm font-mono text-gray-500 dark:text-gray-400">
            Lv.{level}
          </span>
        )}
        <span className={`px-2 py-1 rounded text-xs font-medium ${getMethodColor(method)}`}>
          {method.replace('-', ' ')}
        </span>
      </div>
    </div>
  );
}

export default function MovesetDisplay({ pokemon, className = '' }: MovesetDisplayProps) {
  const [activeCategory, setActiveCategory] = useState<'level-up' | 'machine' | 'egg' | 'tutor'>('level-up');

  // Organize moves by learning method
  const movesByMethod = pokemon.moves.reduce((acc, moveData) => {
    moveData.version_group_details.forEach(detail => {
      const method = detail.move_learn_method.name;
      if (!acc[method]) {
        acc[method] = [];
      }
      acc[method].push({
        moveId: moveData.move.name,
        level: detail.level_learned_at,
        method: method,
      });
    });
    return acc;
  }, {} as Record<string, Array<{ moveId: string; level: number; method: string }>>);

  const categories = [
    { id: 'level-up', label: 'Level Up', count: movesByMethod['level-up']?.length || 0 },
    { id: 'machine', label: 'TM/TR/HM', count: movesByMethod['machine']?.length || 0 },
    { id: 'egg', label: 'Egg Moves', count: movesByMethod['egg']?.length || 0 },
    { id: 'tutor', label: 'Tutor', count: movesByMethod['tutor']?.length || 0 },
  ];

  const currentMoves = movesByMethod[activeCategory] || [];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeCategory === category.id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {category.label} ({category.count})
          </button>
        ))}
      </div>

      {/* Moves List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {currentMoves.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No moves found for this category
          </div>
        ) : (
          currentMoves
            .sort((a, b) => (a.level || 0) - (b.level || 0))
            .map((move, index) => (
              <MoveItem
                key={`${move.moveId}-${index}`}
                moveId={move.moveId}
                level={move.level}
                method={move.method}
              />
            ))
        )}
      </div>
    </div>
  );
}
