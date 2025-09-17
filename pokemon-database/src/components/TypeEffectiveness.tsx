import { useState, useEffect } from 'react';
import { useAllTypes } from '../hooks/usePokemon';
import { Search, Zap, Shield, X } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import type { Type } from '../types';

interface TypeEffectivenessProps {
  className?: string;
}

interface EffectivenessData {
  [type: string]: {
    [targetType: string]: number;
  };
}

export default function TypeEffectiveness({ className = '' }: TypeEffectivenessProps) {
  const { data: types, isLoading } = useAllTypes();
  const [effectivenessData, setEffectivenessData] = useState<EffectivenessData>({});
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Build effectiveness matrix when types are loaded
  useEffect(() => {
    if (types) {
      const data: EffectivenessData = {};
      
      types.forEach(type => {
        data[type.name] = {};
        
        // Initialize all type matchups as neutral (1x)
        types.forEach(targetType => {
          data[type.name][targetType.name] = 1;
        });
        
        // Apply damage relations
        const relations = type.damage_relations;
        
        // Double damage to
        relations.double_damage_to.forEach(target => {
          data[type.name][target.name] = 2;
        });
        
        // Half damage to
        relations.half_damage_to.forEach(target => {
          data[type.name][target.name] = 0.5;
        });
        
        // No damage to
        relations.no_damage_to.forEach(target => {
          data[type.name][target.name] = 0;
        });
      });
      
      setEffectivenessData(data);
    }
  }, [types]);

  const getTypeColor = (typeName: string) => {
    const typeColors: { [key: string]: string } = {
      normal: 'bg-gray-500',
      fire: 'bg-red-500',
      water: 'bg-blue-500',
      electric: 'bg-yellow-500',
      grass: 'bg-green-500',
      ice: 'bg-cyan-500',
      fighting: 'bg-red-600',
      poison: 'bg-purple-500',
      ground: 'bg-yellow-600',
      flying: 'bg-indigo-500',
      psychic: 'bg-pink-500',
      bug: 'bg-lime-500',
      rock: 'bg-yellow-700',
      ghost: 'bg-purple-600',
      dragon: 'bg-indigo-600',
      dark: 'bg-gray-700',
      steel: 'bg-gray-400',
      fairy: 'bg-pink-300',
    };
    return typeColors[typeName] || 'bg-gray-500';
  };

  const getEffectivenessColor = (multiplier: number) => {
    if (multiplier === 0) return 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400';
    if (multiplier === 0.5) return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
    if (multiplier === 1) return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300';
    if (multiplier === 2) return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
    return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300';
  };

  const getEffectivenessText = (multiplier: number) => {
    if (multiplier === 0) return 'No Effect';
    if (multiplier === 0.5) return 'Not Very Effective';
    if (multiplier === 1) return 'Normal';
    if (multiplier === 2) return 'Super Effective';
    return 'Normal';
  };

  const toggleType = (typeName: string) => {
    setSelectedTypes(prev => 
      prev.includes(typeName) 
        ? prev.filter(t => t !== typeName)
        : [...prev, typeName]
    );
  };

  const clearSelection = () => {
    setSelectedTypes([]);
  };

  const filteredTypes = types?.filter(type => 
    type.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getCombinedEffectiveness = (targetType: string) => {
    if (selectedTypes.length === 0) return 1;
    
    let combinedMultiplier = 1;
    selectedTypes.forEach(attackingType => {
      const multiplier = effectivenessData[attackingType]?.[targetType] || 1;
      combinedMultiplier *= multiplier;
    });
    
    return combinedMultiplier;
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading type effectiveness data..." />;
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Type Effectiveness Calculator</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Calculate type effectiveness and weaknesses
          </p>
        </div>
        {selectedTypes.length > 0 && (
          <button
            onClick={clearSelection}
            className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <X className="w-4 h-4" />
            <span>Clear Selection</span>
          </button>
        )}
      </div>

      {/* Type Selection */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Select Attacking Types</h3>
        
        {/* Search */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search types..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        {/* Type Grid */}
        <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-9 gap-2">
          {filteredTypes.map((type) => (
            <button
              key={type.name}
              onClick={() => toggleType(type.name)}
              className={`p-3 rounded-lg text-white font-medium transition-all ${
                selectedTypes.includes(type.name)
                  ? `${getTypeColor(type.name)} ring-2 ring-blue-500 ring-offset-2`
                  : `${getTypeColor(type.name)} hover:opacity-80`
              }`}
            >
              {type.name}
            </button>
          ))}
        </div>

        {/* Selected Types */}
        {selectedTypes.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Selected Types:</h4>
            <div className="flex flex-wrap gap-2">
              {selectedTypes.map((typeName) => (
                <span
                  key={typeName}
                  className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getTypeColor(typeName)}`}
                >
                  {typeName}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Effectiveness Results */}
      {selectedTypes.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Effectiveness Against All Types</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {types?.map((type) => {
              const effectiveness = getCombinedEffectiveness(type.name);
              return (
                <div
                  key={type.name}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    effectiveness === 0
                      ? 'border-gray-300 dark:border-gray-600'
                      : effectiveness < 1
                      ? 'border-red-300 dark:border-red-600'
                      : effectiveness > 1
                      ? 'border-green-300 dark:border-green-600'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getTypeColor(type.name)}`}>
                      {type.name}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getEffectivenessColor(effectiveness)}`}>
                      {effectiveness}x
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {getEffectivenessText(effectiveness)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Reference */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Quick Reference</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
              <Zap className="w-4 h-4 mr-2 text-green-500" />
              Super Effective (2x)
            </h4>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              These types deal double damage to the selected type(s).
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
              <Shield className="w-4 h-4 mr-2 text-red-500" />
              Not Very Effective (0.5x)
            </h4>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              These types deal half damage to the selected type(s).
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
