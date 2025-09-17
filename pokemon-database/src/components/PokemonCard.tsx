import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Pokemon } from '../types';
import { useUserStore } from '../stores/userStore';
import { pokeApiService } from '../services/pokeapi';

interface PokemonCardProps {
  pokemon: Pokemon;
}

export default function PokemonCard({ pokemon }: PokemonCardProps) {
  const { isFavorite, toggleFavorite } = useUserStore();
  const isFav = isFavorite(pokemon.id);

  const primaryType = pokemon.types[0]?.type.name || 'normal';
  const typeColor = `type-${primaryType}`;

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(pokemon.id);
  };

  return (
    <Link
      to={`/pokemon/${pokemon.id}`}
      className="pokemon-card group relative overflow-hidden"
    >
      {/* Background gradient based on type */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br from-${typeColor}-100 to-${typeColor}-200 dark:from-${typeColor}-800 dark:to-${typeColor}-900 opacity-20`}
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

      {/* Pokémon image */}
      <div className="relative z-0 flex justify-center items-center h-32 bg-white/50 dark:bg-gray-800/50">
        <img
          src={pokeApiService.getPokemonImageUrl(pokemon.id)}
          alt={pokemon.name}
          className="w-20 h-20 object-contain transition-transform group-hover:scale-110"
          loading="lazy"
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
              className={`type-badge bg-${type.type.name}-500 text-white text-xs px-2 py-1 rounded-full`}
            >
              {type.type.name}
            </span>
          ))}
        </div>

        {/* Base stats total */}
        <div className="text-center">
          <div className="text-xs text-gray-500 dark:text-gray-400">Total</div>
          <div className="font-semibold text-gray-900 dark:text-white">
            {pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0)}
          </div>
        </div>
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
    </Link>
  );
}
