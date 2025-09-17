import { useState, useEffect } from 'react';
import { useInfinitePokemonList } from '../hooks/usePokemon';
import { usePokemonStore } from '../stores/pokemonStore';
import { useUserStore } from '../stores/userStore';
import PokemonCard from './PokemonCard';
import SearchBar from './SearchBar';
import FilterPanel from './FilterPanel';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

interface PokemonListProps {
  favoritesOnly?: boolean;
}

export default function PokemonList({ favoritesOnly = false }: PokemonListProps) {
  const { pokemonList, setPokemonList, error, setError } = usePokemonStore();
  const { favorites } = useUserStore();
  const [showFilters, setShowFilters] = useState(false);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: queryLoading,
    error: queryError,
  } = useInfinitePokemonList(20);

  // Update store when data changes
  useEffect(() => {
    if (data) {
      const allPokemon = data.pages.flatMap((page: any) => page.results);
      // Convert API results to Pokemon objects (simplified for now)
      const pokemonData = allPokemon.map((result, index) => ({
        id: index + 1,
        name: result.name,
        height: 0,
        weight: 0,
        base_experience: 0,
        order: index + 1,
        is_default: true,
        sprites: {
          front_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`,
          front_shiny: null,
          front_female: null,
          front_shiny_female: null,
          back_default: null,
          back_shiny: null,
          back_female: null,
          back_shiny_female: null,
          other: {
            'official-artwork': {
              front_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${index + 1}.png`,
              front_shiny: null,
            },
            dream_world: {
              front_default: null,
            },
            home: {
              front_default: null,
              front_shiny: null,
            },
          },
        },
        types: [{ slot: 1, type: { name: 'normal', url: '' } }],
        stats: [
          { base_stat: 50, effort: 0, stat: { name: 'hp', url: '' } },
          { base_stat: 50, effort: 0, stat: { name: 'attack', url: '' } },
          { base_stat: 50, effort: 0, stat: { name: 'defense', url: '' } },
          { base_stat: 50, effort: 0, stat: { name: 'special-attack', url: '' } },
          { base_stat: 50, effort: 0, stat: { name: 'special-defense', url: '' } },
          { base_stat: 50, effort: 0, stat: { name: 'speed', url: '' } },
        ],
        abilities: [],
        moves: [],
        species: {
          name: result.name,
          url: result.url,
        },
      }));
      setPokemonList(pokemonData);
    }
  }, [data, setPokemonList]);

  // Handle errors
  useEffect(() => {
    if (queryError) {
      setError(queryError.message);
    }
  }, [queryError, setError]);

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  // Filter Pokémon based on favorites if needed
  const filteredPokemon = favoritesOnly 
    ? pokemonList.filter(pokemon => favorites.pokemonIds.includes(pokemon.id))
    : pokemonList;

  if (queryLoading && pokemonList.length === 0) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 max-w-md">
          <SearchBar />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && <FilterPanel />}

      {/* Pokémon Grid */}
      {filteredPokemon.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 dark:text-gray-400 text-lg">
            {favoritesOnly ? 'No favorite Pokémon yet' : 'No Pokémon found'}
          </div>
          {favoritesOnly && (
            <p className="text-gray-400 dark:text-gray-500 mt-2">
              Start adding Pokémon to your favorites to see them here!
            </p>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredPokemon.map((pokemon) => (
              <PokemonCard key={pokemon.id} pokemon={pokemon} />
            ))}
          </div>

          {/* Load More Button */}
          {hasNextPage && (
            <div className="flex justify-center mt-8">
              <button
                onClick={handleLoadMore}
                disabled={isFetchingNextPage}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isFetchingNextPage ? (
                  <div className="flex items-center space-x-2">
                    <LoadingSpinner size="sm" />
                    <span>Loading...</span>
                  </div>
                ) : (
                  'Load More'
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
