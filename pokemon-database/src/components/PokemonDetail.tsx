import { useParams } from 'react-router-dom';
import { usePokemon, usePokemonSpecies } from '../hooks/usePokemon';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

export default function PokemonDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: pokemon, isLoading: pokemonLoading, error: pokemonError } = usePokemon(id!);
  const { data: species, isLoading: speciesLoading, error: speciesError } = usePokemonSpecies(id!);

  if (pokemonLoading || speciesLoading) {
    return <LoadingSpinner />;
  }

  if (pokemonError || speciesError) {
    return <ErrorMessage message="Failed to load Pokémon details" />;
  }

  if (!pokemon || !species) {
    return <ErrorMessage message="Pokémon not found" />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold capitalize">{pokemon.name}</h1>
              <p className="text-blue-100">#{pokemon.id.toString().padStart(3, '0')}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">
                {pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0)}
              </div>
              <div className="text-blue-100">Total BST</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center">
            <img
              src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default || ''}
              alt={pokemon.name}
              className="w-64 h-64 mx-auto object-contain"
            />
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Coming Soon!</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Detailed Pokémon information, stats charts, evolution chain, and moveset will be implemented in the next phase.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
