import { useState, useEffect, useMemo } from 'react';
import { useInfinitePokemonList, useMultiplePokemon } from '../hooks/usePokemon';
import { usePokemonStore } from '../stores/pokemonStore';
import { useUserStore } from '../stores/userStore';
import PokemonCard from './PokemonCard';
import SearchBar from './SearchBar';
import FilterPanel from './FilterPanel';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import type { Pokemon } from '../types';

interface PokemonListProps {
  favoritesOnly?: boolean;
}

export default function PokemonList({ favoritesOnly = false }: PokemonListProps) {
  const { pokemonList, setPokemonList, error, setError, filters } = usePokemonStore();
  const { favorites } = useUserStore();
  const [showFilters, setShowFilters] = useState(false);
  const [showShiny, setShowShiny] = useState(false);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: queryLoading,
    error: queryError,
  } = useInfinitePokemonList(20);

  // Get Pokémon IDs from API results
  const pokemonIds = useMemo(() => {
    if (!data) return [];
    return data.pages.flatMap((page: { results: Array<{ url: string }> }) => 
      page.results.map((result: { url: string }) => {
        const id = result.url.split('/').slice(-2, -1)[0];
        return parseInt(id, 10);
      })
    );
  }, [data]);

  // Fetch detailed Pokémon data
  const { data: detailedPokemon } = useMultiplePokemon(pokemonIds);

  // Update store when detailed data changes
  useEffect(() => {
    if (detailedPokemon && Array.isArray(detailedPokemon)) {
      setPokemonList(detailedPokemon);
    }
  }, [detailedPokemon, setPokemonList]);

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

  // Filter Pokémon based on search, filters, and favorites
  const filteredPokemon = useMemo(() => {
    let filtered = pokemonList;

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(pokemon => 
        pokemon.name.toLowerCase().includes(searchTerm) ||
        pokemon.id.toString().includes(searchTerm)
      );
    }

    // Apply type filters
    if (filters.types.length > 0) {
      filtered = filtered.filter(pokemon =>
        pokemon.types.some(type => filters.types.includes(type.type.name))
      );
    }

    // Apply BST filters
    const totalBST = (pokemon: Pokemon) => pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0);
    if (filters.minBST > 0) {
      filtered = filtered.filter(pokemon => totalBST(pokemon) >= filters.minBST);
    }
    if (filters.maxBST < 1000) {
      filtered = filtered.filter(pokemon => totalBST(pokemon) <= filters.maxBST);
    }

    // Apply favorites filter
    if (favoritesOnly) {
      filtered = filtered.filter(pokemon => favorites.pokemonIds.includes(pokemon.id));
    }

    return filtered;
  }, [pokemonList, filters, favoritesOnly, favorites.pokemonIds]);

  if (queryLoading && pokemonList.length === 0) {
    return <LoadingSpinner message="Loading Pokémon..." />;
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
        <div className="flex gap-2">
          <button
            onClick={() => setShowShiny(!showShiny)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              showShiny 
                ? 'bg-yellow-500 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-yellow-500 hover:text-white'
            }`}
          >
            {showShiny ? '★ Shiny' : '☆ Normal'}
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
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
          {/* Results count */}
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredPokemon.length} Pokémon
            {filters.search && ` matching "${filters.search}"`}
            {filters.types.length > 0 && ` with types: ${filters.types.join(', ')}`}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredPokemon.map((pokemon) => (
              <PokemonCard key={pokemon.id} pokemon={pokemon} showShiny={showShiny} />
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
