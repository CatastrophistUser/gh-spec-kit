import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePokemon, usePokemonSpecies } from '../hooks/usePokemon';
import { useUserStore } from '../stores/userStore';
import { pokeApiService } from '../services/pokeapi';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import StatChart from './StatChart';
import StatBars from './StatBars';
import MovesetDisplay from './MovesetDisplay';
import { Heart, Star, ArrowLeft, Weight, Ruler, Users, Zap } from 'lucide-react';

export default function PokemonDetail() {
  const { id } = useParams<{ id: string }>();
  const { isFavorite, toggleFavorite } = useUserStore();
  const [activeTab, setActiveTab] = useState<'stats' | 'moves' | 'info'>('stats');
  const [showShiny, setShowShiny] = useState(false);

  const { data: pokemon, isLoading: pokemonLoading, error: pokemonError } = usePokemon(id!);
  const { data: species, isLoading: speciesLoading, error: speciesError } = usePokemonSpecies(id!);

  if (pokemonLoading || speciesLoading) {
    return <LoadingSpinner message="Loading Pokémon details..." />;
  }

  if (pokemonError || speciesError) {
    return <ErrorMessage message="Failed to load Pokémon details" />;
  }

  if (!pokemon || !species) {
    return <ErrorMessage message="Pokémon not found" />;
  }

  const isFav = isFavorite(pokemon.id);
  const primaryType = pokemon.types[0]?.type.name || 'normal';
  const totalBST = pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0);

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

  const getBackgroundGradient = (typeName: string) => {
    const gradients: { [key: string]: string } = {
      normal: 'from-gray-500 to-gray-600',
      fire: 'from-red-500 to-red-600',
      water: 'from-blue-500 to-blue-600',
      electric: 'from-yellow-500 to-yellow-600',
      grass: 'from-green-500 to-green-600',
      ice: 'from-cyan-500 to-cyan-600',
      fighting: 'from-red-600 to-red-700',
      poison: 'from-purple-500 to-purple-600',
      ground: 'from-yellow-600 to-yellow-700',
      flying: 'from-indigo-500 to-indigo-600',
      psychic: 'from-pink-500 to-pink-600',
      bug: 'from-lime-500 to-lime-600',
      rock: 'from-yellow-700 to-yellow-800',
      ghost: 'from-purple-600 to-purple-700',
      dragon: 'from-indigo-600 to-indigo-700',
      dark: 'from-gray-700 to-gray-800',
      steel: 'from-gray-400 to-gray-500',
      fairy: 'from-pink-300 to-pink-400',
    };
    return gradients[typeName] || 'from-gray-500 to-gray-600';
  };

  const tabs = [
    { id: 'stats', label: 'Stats', icon: Zap },
    { id: 'moves', label: 'Moves', icon: Star },
    { id: 'info', label: 'Info', icon: Users },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Back Button */}
      <Link
        to="/"
        className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Pokédex</span>
      </Link>

      {/* Main Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className={`bg-gradient-to-r ${getBackgroundGradient(primaryType)} p-6 text-white`}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold capitalize">{pokemon.name}</h1>
              <p className="text-white/80 text-lg">#{pokemon.id.toString().padStart(3, '0')}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{totalBST}</div>
              <div className="text-white/80">Total BST</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Image and Basic Info */}
          <div className="flex flex-col lg:flex-row gap-8 mb-8">
            {/* Image */}
            <div className="flex-1 text-center">
              <div className="relative inline-block">
                <img
                  src={
                    showShiny 
                      ? pokemon.sprites.other['official-artwork'].front_shiny || pokemon.sprites.front_shiny || pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default || ''
                      : pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default || ''
                  }
                  alt={pokemon.name}
                  className="w-80 h-80 mx-auto object-contain"
                />
                <button
                  onClick={() => setShowShiny(!showShiny)}
                  className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                >
                  <Star className={`w-6 h-6 ${showShiny ? 'text-yellow-400 fill-current' : 'text-white'}`} />
                </button>
              </div>
            </div>

            {/* Basic Info */}
            <div className="flex-1 space-y-6">
              {/* Types */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Types</h3>
                <div className="flex space-x-2">
                  {pokemon.types.map((type, index) => (
                    <span
                      key={index}
                      className={`type-badge ${getTypeColor(type.type.name)} text-white px-4 py-2 rounded-full text-lg font-medium`}
                    >
                      {type.type.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Abilities */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Abilities</h3>
                <div className="space-y-2">
                  {pokemon.abilities.map((ability, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="text-gray-700 dark:text-gray-300 capitalize">
                        {ability.ability.name.replace('-', ' ')}
                      </span>
                      {ability.is_hidden && (
                        <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded">
                          Hidden
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Physical Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Ruler className="w-5 h-5 text-gray-500" />
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Height</div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {(pokemon.height / 10).toFixed(1)} m
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Weight className="w-5 h-5 text-gray-500" />
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Weight</div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {(pokemon.weight / 10).toFixed(1)} kg
                    </div>
                  </div>
                </div>
              </div>

              {/* Favorite Button */}
              <button
                onClick={() => toggleFavorite(pokemon.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  isFav
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-red-500 hover:text-white'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFav ? 'fill-current' : ''}`} />
                <span>{isFav ? 'Remove from Favorites' : 'Add to Favorites'}</span>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="mt-6">
            {activeTab === 'stats' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Base Stats</h3>
                  <StatBars pokemon={pokemon} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Stat Radar</h3>
                  <StatChart pokemon={pokemon} />
                </div>
              </div>
            )}

            {activeTab === 'moves' && (
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Moves</h3>
                <MovesetDisplay pokemon={pokemon} />
              </div>
            )}

            {activeTab === 'info' && (
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Species Info</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Base Happiness:</span>
                        <span className="text-gray-900 dark:text-white">{species.base_happiness}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Capture Rate:</span>
                        <span className="text-gray-900 dark:text-white">{species.capture_rate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Growth Rate:</span>
                        <span className="text-gray-900 dark:text-white capitalize">{species.growth_rate.name}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Flavor Text</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {species.flavor_text_entries.find(entry => entry.language.name === 'en')?.flavor_text || 'No description available'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
