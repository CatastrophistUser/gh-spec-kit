import { 
  Pokemon, 
  PokemonSpecies, 
  EvolutionChain, 
  Move, 
  Type, 
  PokemonListResponse,
  PokemonSearchParams 
} from '../types';

const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';

class PokeApiService {
  private async fetchData<T>(url: string): Promise<T> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API fetch error:', error);
      throw error;
    }
  }

  // Pokémon list endpoints
  async getPokemonList(params: PokemonSearchParams): Promise<PokemonListResponse> {
    const searchParams = new URLSearchParams();
    searchParams.append('limit', params.limit.toString());
    searchParams.append('offset', params.offset.toString());
    
    if (params.search) {
      searchParams.append('search', params.search);
    }
    if (params.type) {
      searchParams.append('type', params.type);
    }

    const url = `${POKEAPI_BASE_URL}/pokemon?${searchParams.toString()}`;
    return this.fetchData<PokemonListResponse>(url);
  }

  async getPokemonByIdOrName(idOrName: string | number): Promise<Pokemon> {
    const url = `${POKEAPI_BASE_URL}/pokemon/${idOrName}`;
    return this.fetchData<Pokemon>(url);
  }

  async getPokemonSpecies(idOrName: string | number): Promise<PokemonSpecies> {
    const url = `${POKEAPI_BASE_URL}/pokemon-species/${idOrName}`;
    return this.fetchData<PokemonSpecies>(url);
  }

  async getEvolutionChain(id: number): Promise<EvolutionChain> {
    const url = `${POKEAPI_BASE_URL}/evolution-chain/${id}`;
    return this.fetchData<EvolutionChain>(url);
  }

  async getMove(idOrName: string | number): Promise<Move> {
    const url = `${POKEAPI_BASE_URL}/move/${idOrName}`;
    return this.fetchData<Move>(url);
  }

  async getType(idOrName: string | number): Promise<Type> {
    const url = `${POKEAPI_BASE_URL}/type/${idOrName}`;
    return this.fetchData<Type>(url);
  }

  async getAllTypes(): Promise<Type[]> {
    const url = `${POKEAPI_BASE_URL}/type`;
    const response = await this.fetchData<{ results: Array<{ name: string; url: string }> }>(url);
    
    // Fetch detailed type data for all types
    const typePromises = response.results.map(type => this.getType(type.name));
    return Promise.all(typePromises);
  }

  // Utility methods
  extractIdFromUrl(url: string): number {
    const matches = url.match(/\/(\d+)\/$/);
    return matches ? parseInt(matches[1], 10) : 0;
  }

  getPokemonImageUrl(id: number, variant: 'default' | 'shiny' = 'default'): string {
    const baseUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';
    if (variant === 'shiny') {
      return `${baseUrl}/shiny/${id}.png`;
    }
    return `${baseUrl}/${id}.png`;
  }

  getOfficialArtworkUrl(id: number, variant: 'default' | 'shiny' = 'default'): string {
    const baseUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork';
    if (variant === 'shiny') {
      return `${baseUrl}/shiny/${id}.png`;
    }
    return `${baseUrl}/${id}.png`;
  }
}

export const pokeApiService = new PokeApiService();
