import type { Pokemon as ApiPokemon } from '../types';

// Lightweight application model that mirrors API types for now
export type PokemonModel = ApiPokemon;

export function fromApiPokemon(p: ApiPokemon): PokemonModel {
  // For now, return the API shape directly. Transformations can be added later.
  return p;
}

export function getTotalBST(p: ApiPokemon): number {
  return p.stats.reduce((sum, s) => sum + s.base_stat, 0);
}
