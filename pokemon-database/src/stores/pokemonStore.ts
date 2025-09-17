import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Pokemon, PokemonFilters, UserFavorites, UserTeam, UserPreferences } from '../types';

interface PokemonState {
  // Pokémon data
  pokemonList: Pokemon[];
  selectedPokemon: Pokemon | null;
  isLoading: boolean;
  error: string | null;
  
  // Filters and search
  filters: PokemonFilters;
  searchQuery: string;
  
  // Pagination
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  
  // Actions
  setPokemonList: (pokemon: Pokemon[]) => void;
  setSelectedPokemon: (pokemon: Pokemon | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: Partial<PokemonFilters>) => void;
  setSearchQuery: (query: string) => void;
  setCurrentPage: (page: number) => void;
  setTotalPages: (pages: number) => void;
  setItemsPerPage: (items: number) => void;
  clearFilters: () => void;
  resetPagination: () => void;
}

const initialFilters: PokemonFilters = {
  search: '',
  types: [],
  generation: [],
  evolutionStage: [],
  minBST: 0,
  maxBST: 1000,
  color: [],
  eggGroup: [],
};

export const usePokemonStore = create<PokemonState>()(
  persist(
    (set, get) => ({
      // Initial state
      pokemonList: [],
      selectedPokemon: null,
      isLoading: false,
      error: null,
      filters: initialFilters,
      searchQuery: '',
      currentPage: 1,
      totalPages: 1,
      itemsPerPage: 20,
      
      // Actions
      setPokemonList: (pokemon) => set({ pokemonList: pokemon }),
      setSelectedPokemon: (pokemon) => set({ selectedPokemon: pokemon }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      
      setFilters: (newFilters) => set((state) => ({
        filters: { ...state.filters, ...newFilters },
        currentPage: 1, // Reset to first page when filters change
      })),
      
      setSearchQuery: (query) => set({ 
        searchQuery: query,
        currentPage: 1, // Reset to first page when search changes
      }),
      
      setCurrentPage: (page) => set({ currentPage: page }),
      setTotalPages: (pages) => set({ totalPages: pages }),
      setItemsPerPage: (items) => set({ 
        itemsPerPage: items,
        currentPage: 1, // Reset to first page when items per page changes
      }),
      
      clearFilters: () => set({ 
        filters: initialFilters,
        searchQuery: '',
        currentPage: 1,
      }),
      
      resetPagination: () => set({ currentPage: 1 }),
    }),
    {
      name: 'pokemon-store',
      partialize: (state) => ({
        filters: state.filters,
        searchQuery: state.searchQuery,
        itemsPerPage: state.itemsPerPage,
      }),
    }
  )
);
