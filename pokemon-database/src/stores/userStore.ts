import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserFavorites, UserTeam, UserPreferences } from '../types';

interface UserState {
  // User data
  favorites: UserFavorites;
  teams: UserTeam[];
  preferences: UserPreferences;
  
  // Actions
  addToFavorites: (pokemonId: number) => void;
  removeFromFavorites: (pokemonId: number) => void;
  toggleFavorite: (pokemonId: number) => void;
  isFavorite: (pokemonId: number) => boolean;
  
  createTeam: (name: string) => string;
  updateTeam: (teamId: string, updates: Partial<UserTeam>) => void;
  deleteTeam: (teamId: string) => void;
  addPokemonToTeam: (teamId: string, pokemonId: number) => void;
  removePokemonFromTeam: (teamId: string, pokemonId: number) => void;
  getTeam: (teamId: string) => UserTeam | undefined;
  
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  resetUserData: () => void;
}

const initialFavorites: UserFavorites = {
  pokemonIds: [],
};

const initialPreferences: UserPreferences = {
  theme: 'system',
  defaultView: 'grid',
  itemsPerPage: 20,
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // Initial state
      favorites: initialFavorites,
      teams: [],
      preferences: initialPreferences,
      
      // Favorites actions
      addToFavorites: (pokemonId) => set((state) => ({
        favorites: {
          pokemonIds: [...state.favorites.pokemonIds, pokemonId],
        },
      })),
      
      removeFromFavorites: (pokemonId) => set((state) => ({
        favorites: {
          pokemonIds: state.favorites.pokemonIds.filter(id => id !== pokemonId),
        },
      })),
      
      toggleFavorite: (pokemonId) => {
        const { isFavorite, addToFavorites, removeFromFavorites } = get();
        if (isFavorite(pokemonId)) {
          removeFromFavorites(pokemonId);
        } else {
          addToFavorites(pokemonId);
        }
      },
      
      isFavorite: (pokemonId) => {
        const { favorites } = get();
        return favorites.pokemonIds.includes(pokemonId);
      },
      
      // Team actions
      createTeam: (name) => {
        const teamId = `team_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const newTeam: UserTeam = {
          id: teamId,
          name,
          pokemonIds: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        set((state) => ({
          teams: [...state.teams, newTeam],
        }));
        
        return teamId;
      },
      
      updateTeam: (teamId, updates) => set((state) => ({
        teams: state.teams.map(team =>
          team.id === teamId
            ? { ...team, ...updates, updatedAt: new Date() }
            : team
        ),
      })),
      
      deleteTeam: (teamId) => set((state) => ({
        teams: state.teams.filter(team => team.id !== teamId),
      })),
      
      addPokemonToTeam: (teamId, pokemonId) => set((state) => ({
        teams: state.teams.map(team => {
          if (team.id === teamId && !team.pokemonIds.includes(pokemonId) && team.pokemonIds.length < 6) {
            return {
              ...team,
              pokemonIds: [...team.pokemonIds, pokemonId],
              updatedAt: new Date(),
            };
          }
          return team;
        }),
      })),
      
      removePokemonFromTeam: (teamId, pokemonId) => set((state) => ({
        teams: state.teams.map(team =>
          team.id === teamId
            ? {
                ...team,
                pokemonIds: team.pokemonIds.filter(id => id !== pokemonId),
                updatedAt: new Date(),
              }
            : team
        ),
      })),
      
      getTeam: (teamId) => {
        const { teams } = get();
        return teams.find(team => team.id === teamId);
      },
      
      // Preferences actions
      updatePreferences: (newPreferences) => set((state) => ({
        preferences: { ...state.preferences, ...newPreferences },
      })),
      
      resetUserData: () => set({
        favorites: initialFavorites,
        teams: [],
        preferences: initialPreferences,
      }),
    }),
    {
      name: 'user-store',
    }
  )
);
