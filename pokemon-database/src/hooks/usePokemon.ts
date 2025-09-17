import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { pokeApiService } from '../services/pokeapi';
import { Pokemon, PokemonSpecies, EvolutionChain, Move, Type, PokemonSearchParams } from '../types';

// Query keys
export const pokemonKeys = {
  all: ['pokemon'] as const,
  lists: () => [...pokemonKeys.all, 'list'] as const,
  list: (params: PokemonSearchParams) => [...pokemonKeys.lists(), params] as const,
  details: () => [...pokemonKeys.all, 'detail'] as const,
  detail: (id: string | number) => [...pokemonKeys.details(), id] as const,
  species: (id: string | number) => [...pokemonKeys.all, 'species', id] as const,
  evolutionChain: (id: number) => [...pokemonKeys.all, 'evolution-chain', id] as const,
  move: (id: string | number) => [...pokemonKeys.all, 'move', id] as const,
  type: (id: string | number) => [...pokemonKeys.all, 'type', id] as const,
  types: () => [...pokemonKeys.all, 'types'] as const,
};

// Pokémon list hook
export function usePokemonList(params: PokemonSearchParams) {
  return useQuery({
    queryKey: pokemonKeys.list(params),
    queryFn: () => pokeApiService.getPokemonList(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Infinite Pokémon list hook
export function useInfinitePokemonList(limit: number = 20) {
  return useInfiniteQuery({
    queryKey: [...pokemonKeys.lists(), 'infinite'],
    queryFn: ({ pageParam = 0 }) => 
      pokeApiService.getPokemonList({ limit, offset: pageParam * limit }),
    getNextPageParam: (lastPage, pages) => {
      if (!lastPage.next) return undefined;
      return pages.length;
    },
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
}

// Individual Pokémon hook
export function usePokemon(id: string | number) {
  return useQuery({
    queryKey: pokemonKeys.detail(id),
    queryFn: () => pokeApiService.getPokemonByIdOrName(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
  });
}

// Pokémon species hook
export function usePokemonSpecies(id: string | number) {
  return useQuery({
    queryKey: pokemonKeys.species(id),
    queryFn: () => pokeApiService.getPokemonSpecies(id),
    enabled: !!id,
    staleTime: 15 * 60 * 1000, // 15 minutes
    cacheTime: 60 * 60 * 1000, // 1 hour
  });
}

// Evolution chain hook
export function useEvolutionChain(id: number) {
  return useQuery({
    queryKey: pokemonKeys.evolutionChain(id),
    queryFn: () => pokeApiService.getEvolutionChain(id),
    enabled: !!id,
    staleTime: 30 * 60 * 1000, // 30 minutes
    cacheTime: 2 * 60 * 60 * 1000, // 2 hours
  });
}

// Move hook
export function useMove(id: string | number) {
  return useQuery({
    queryKey: pokemonKeys.move(id),
    queryFn: () => pokeApiService.getMove(id),
    enabled: !!id,
    staleTime: 30 * 60 * 1000, // 30 minutes
    cacheTime: 2 * 60 * 60 * 1000, // 2 hours
  });
}

// Type hook
export function useType(id: string | number) {
  return useQuery({
    queryKey: pokemonKeys.type(id),
    queryFn: () => pokeApiService.getType(id),
    enabled: !!id,
    staleTime: 60 * 60 * 1000, // 1 hour
    cacheTime: 24 * 60 * 60 * 1000, // 24 hours
  });
}

// All types hook
export function useAllTypes() {
  return useQuery({
    queryKey: pokemonKeys.types(),
    queryFn: () => pokeApiService.getAllTypes(),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    cacheTime: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}

// Multiple Pokémon hook (for team building, comparison, etc.)
export function useMultiplePokemon(ids: (string | number)[]) {
  return useQuery({
    queryKey: [...pokemonKeys.details(), 'multiple', ids],
    queryFn: async () => {
      const promises = ids.map(id => pokeApiService.getPokemonByIdOrName(id));
      return Promise.all(promises);
    },
    enabled: ids.length > 0,
    staleTime: 10 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
  });
}
