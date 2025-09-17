import { Link } from 'react-router-dom';
import { Heart, Star } from 'lucide-react';
import { Pokemon } from '../types';
import { useUserStore } from '../stores/userStore';
import { pokeApiService } from '../services/pokeapi';

interface PokemonCardProps {
  pokemon: Pokemon;
  showShiny?: boolean;
}

export default function PokemonCard({ pokemon, showShiny = false }: PokemonCardProps) {
  const { isFavorite, toggleFavorite } = useUserStore();
  const isFav = isFavorite(pokemon.id);

  const primaryType = pokemon.types[0]?.type.name || 'normal';
  const typeColor = `type-${primaryType}`;
  const totalBST = pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(pokemon.id);
  };

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
      normal: 'from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900',
      fire: 'from-red-100 to-red-200 dark:from-red-800 dark:to-red-900',
      water: 'from-blue-100 to-blue-200 dark:from-blue-800 dark:to-blue-900',
      electric: 'from-yellow-100 to-yellow-200 dark:from-yellow-800 dark:to-yellow-900',
      grass: 'from-green-100 to-green-200 dark:from-green-800 dark:to-green-900',
      ice: 'from-cyan-100 to-cyan-200 dark:from-cyan-800 dark:to-cyan-900',
      fighting: 'from-red-100 to-red-300 dark:from-red-800 dark:to-red-900',
      poison: 'from-purple-100 to-purple-200 dark:from-purple-800 dark:to-purple-900',
      ground: 'from-yellow-100 to-yellow-300 dark:from-yellow-800 dark:to-yellow-900',
      flying: 'from-indigo-100 to-indigo-200 dark:from-indigo-800 dark:to-indigo-900',
      psychic: 'from-pink-100 to-pink-200 dark:from-pink-800 dark:to-pink-900',
      bug: 'from-lime-100 to-lime-200 dark:from-lime-800 dark:to-lime-900',
      rock: 'from-yellow-100 to-yellow-400 dark:from-yellow-800 dark:to-yellow-900',
      ghost: 'from-purple-100 to-purple-300 dark:from-purple-800 dark:to-purple-900',
      dragon: 'from-indigo-100 to-indigo-300 dark:from-indigo-800 dark:to-indigo-900',
      dark: 'from-gray-100 to-gray-300 dark:from-gray-800 dark:to-gray-900',
      steel: 'from-gray-100 to-gray-300 dark:from-gray-700 dark:to-gray-900',
      fairy: 'from-pink-100 to-pink-200 dark:from-pink-800 dark:to-pink-900',
    };
    return gradients[typeName] || 'from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900';
  };

  return (
    <Link
      to={`/pokemon/${pokemon.id}`}
      className="pokemon-card group relative overflow-hidden"
    >
      {/* Background gradient based on type */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br ${getBackgroundGradient(primaryType)} opacity-20`}
      />
      
      {/* Favorite button */}
      <button
        onClick={handleFavoriteClick}
        className={`absolute top-2 right-2 z-10 p-1.5 rounded-full transition-colors ${
          isFav
            ? 'bg-red-500 text-white'
            : 'bg-white/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-300 hover:bg-red-500 hover:text-white'
        }`}
        aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
      >
        <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
      </button>

      {/* Shiny indicator */}
      {showShiny && (
        <div className="absolute top-2 left-2 z-10">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
        </div>
      )}

      {/* Pokémon image */}
      <div className="relative z-0 flex justify-center items-center h-32 bg-white/50 dark:bg-gray-800/50">
        <img
          src={
            showShiny 
              ? pokeApiService.getPokemonImageUrl(pokemon.id, 'shiny')
              : pokeApiService.getPokemonImageUrl(pokemon.id)
          }
          alt={pokemon.name}
          className="w-20 h-20 object-contain transition-transform group-hover:scale-110"
          loading="lazy"
          onError={(e) => {
            // Fallback to default sprite if shiny fails
            if (showShiny) {
              (e.target as HTMLImageElement).src = pokeApiService.getPokemonImageUrl(pokemon.id);
            }
          }}
        />
      </div>

      {/* Pokémon info */}
      <div className="relative z-0 p-4 space-y-2">
        {/* ID and Name */}
        <div className="text-center">
          <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">
            #{pokemon.id.toString().padStart(3, '0')}
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white capitalize truncate">
            {pokemon.name}
          </h3>
        </div>

        {/* Types */}
        <div className="flex justify-center space-x-1">
          {pokemon.types.map((type, index) => (
            <span
              key={index}
              className={`type-badge ${getTypeColor(type.type.name)} text-white text-xs px-2 py-1 rounded-full`}
            >
              {type.type.name}
            </span>
          ))}
        </div>

        {/* Base stats total */}
        <div className="text-center">
          <div className="text-xs text-gray-500 dark:text-gray-400">Total</div>
          <div className="font-semibold text-gray-900 dark:text-white">
            {totalBST}
          </div>
        </div>

        {/* Individual stats preview */}
        <div className="grid grid-cols-3 gap-1 text-xs">
          <div className="text-center">
            <div className="text-gray-500 dark:text-gray-400">HP</div>
            <div className="font-medium">{pokemon.stats[0]?.base_stat || 0}</div>
          </div>
          <div className="text-center">
            <div className="text-gray-500 dark:text-gray-400">ATK</div>
            <div className="font-medium">{pokemon.stats[1]?.base_stat || 0}</div>
          </div>
          <div className="text-center">
            <div className="text-gray-500 dark:text-gray-400">DEF</div>
            <div className="font-medium">{pokemon.stats[2]?.base_stat || 0}</div>
          </div>
        </div>
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
    </Link>
  );
}
