import { pokeApiService } from './pokeapi';
import { fromApiPokemon, getTotalBST } from '../models/pokemon';

export async function getPokemonDetail(idOrName: string | number) {
  const pokemon = await pokeApiService.getPokemonByIdOrName(idOrName);
  const species = await pokeApiService.getPokemonSpecies(idOrName);
  // derive evolution chain id
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const evoUrl = (species && (species as any).evolution_chain && (species as any).evolution_chain.url) || null;
  const evoId = evoUrl ? pokeApiService.extractIdFromUrl(evoUrl) : 0;
  const evolution = evoId ? await pokeApiService.getEvolutionChain(evoId) : null;

  return {
    pokemon: fromApiPokemon(pokemon),
    species,
    evolution,
    totalBST: getTotalBST(pokemon),
  } as const;
}
