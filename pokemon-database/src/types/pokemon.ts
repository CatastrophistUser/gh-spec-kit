// Core Pokémon data types
export interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  order: number;
  is_default: boolean;
  sprites: PokemonSprites;
  types: PokemonType[];
  stats: PokemonStat[];
  abilities: PokemonAbility[];
  moves: PokemonMove[];
  species: {
    name: string;
    url: string;
  };
}

export interface PokemonSprites {
  front_default: string | null;
  front_shiny: string | null;
  front_female: string | null;
  front_shiny_female: string | null;
  back_default: string | null;
  back_shiny: string | null;
  back_female: string | null;
  back_shiny_female: string | null;
  other: {
    'official-artwork': {
      front_default: string | null;
      front_shiny: string | null;
    };
    dream_world: {
      front_default: string | null;
    };
    home: {
      front_default: string | null;
      front_shiny: string | null;
    };
  };
}

export interface PokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
}

export interface PokemonAbility {
  is_hidden: boolean;
  slot: number;
  ability: {
    name: string;
    url: string;
  };
}

export interface PokemonMove {
  move: {
    name: string;
    url: string;
  };
  version_group_details: Array<{
    level_learned_at: number;
    move_learn_method: {
      name: string;
      url: string;
    };
    version_group: {
      name: string;
      url: string;
    };
  }>;
}

// Species data types
export interface PokemonSpecies {
  id: number;
  name: string;
  order: number;
  gender_rate: number;
  capture_rate: number;
  base_happiness: number;
  is_baby: boolean;
  is_legendary: boolean;
  is_mythical: boolean;
  hatch_counter: number;
  has_gender_differences: boolean;
  forms_switchable: boolean;
  growth_rate: {
    name: string;
    url: string;
  };
  pokedex_numbers: Array<{
    entry_number: number;
    pokedex: {
      name: string;
      url: string;
    };
  }>;
  egg_groups: Array<{
    name: string;
    url: string;
  }>;
  color: {
    name: string;
    url: string;
  };
  shape: {
    name: string;
    url: string;
  };
  evolves_from_species: {
    name: string;
    url: string;
  } | null;
  evolution_chain: {
    url: string;
  };
  habitat: {
    name: string;
    url: string;
  } | null;
  generation: {
    name: string;
    url: string;
  };
  names: Array<{
    name: string;
    language: {
      name: string;
      url: string;
    };
  }>;
  flavor_text_entries: Array<{
    flavor_text: string;
    language: {
      name: string;
      url: string;
    };
    version: {
      name: string;
      url: string;
    };
  }>;
  form_descriptions: Array<{
    description: string;
    language: {
      name: string;
      url: string;
    };
  }>;
  genera: Array<{
    genus: string;
    language: {
      name: string;
      url: string;
    };
  }>;
  varieties: Array<{
    is_default: boolean;
    pokemon: {
      name: string;
      url: string;
    };
  }>;
}

// Evolution chain types
export interface EvolutionChain {
  id: number;
  baby_trigger_item: any;
  chain: EvolutionDetail;
}

export interface EvolutionDetail {
  is_baby: boolean;
  species: {
    name: string;
    url: string;
  };
  evolution_details: EvolutionDetails[];
  evolves_to: EvolutionDetail[];
}

export interface EvolutionDetails {
  item: {
    name: string;
    url: string;
  } | null;
  trigger: {
    name: string;
    url: string;
  };
  gender: number | null;
  held_item: {
    name: string;
    url: string;
  } | null;
  known_move: {
    name: string;
    url: string;
  } | null;
  known_move_type: {
    name: string;
    url: string;
  } | null;
  location: {
    name: string;
    url: string;
  } | null;
  min_level: number | null;
  min_happiness: number | null;
  min_beauty: number | null;
  min_affection: number | null;
  needs_overworld_rain: boolean;
  party_species: {
    name: string;
    url: string;
  } | null;
  party_type: {
    name: string;
    url: string;
  } | null;
  relative_physical_stats: number | null;
  time_of_day: string;
  trade_species: {
    name: string;
    url: string;
  } | null;
  turn_upside_down: boolean;
}

// Move types
export interface Move {
  id: number;
  name: string;
  accuracy: number | null;
  effect_chance: number | null;
  pp: number | null;
  priority: number;
  power: number | null;
  contest_combos: any;
  contest_type: {
    name: string;
    url: string;
  } | null;
  contest_effect: {
    url: string;
  } | null;
  damage_class: {
    name: string;
    url: string;
  };
  effect_entries: Array<{
    effect: string;
    language: {
      name: string;
      url: string;
    };
    short_effect: string;
  }>;
  effect_changes: any[];
  learned_by_pokemon: Array<{
    name: string;
    url: string;
  }>;
  flavor_text_entries: Array<{
    flavor_text: string;
    language: {
      name: string;
      url: string;
    };
    version_group: {
      name: string;
      url: string;
    };
  }>;
  generation: {
    name: string;
    url: string;
  };
  machines: any[];
  meta: {
    ailment: {
      name: string;
      url: string;
    };
    ailment_chance: number;
    category: {
      name: string;
      url: string;
    };
    crit_rate: number;
    drain: number;
    flinch_chance: number;
    healing: number;
    max_hits: number | null;
    max_turns: number | null;
    min_hits: number | null;
    min_turns: number | null;
    stat_chance: number;
  };
  names: Array<{
    name: string;
    language: {
      name: string;
      url: string;
    };
  }>;
  past_values: any[];
  stat_changes: Array<{
    change: number;
    stat: {
      name: string;
      url: string;
    };
  }>;
  super_contest_effect: {
    url: string;
  } | null;
  target: {
    name: string;
    url: string;
  };
  type: {
    name: string;
    url: string;
  };
}

// Type effectiveness types
export interface Type {
  id: number;
  name: string;
  damage_relations: {
    no_damage_to: Array<{
      name: string;
      url: string;
    }>;
    half_damage_to: Array<{
      name: string;
      url: string;
    }>;
    double_damage_to: Array<{
      name: string;
      url: string;
    }>;
    no_damage_from: Array<{
      name: string;
      url: string;
    }>;
    half_damage_from: Array<{
      name: string;
      url: string;
    }>;
    double_damage_from: Array<{
      name: string;
      url: string;
    }>;
  };
  game_indices: Array<{
    game_index: number;
    generation: {
      name: string;
      url: string;
    };
  }>;
  generation: {
    name: string;
    url: string;
  };
  move_damage_class: {
    name: string;
    url: string;
  } | null;
  names: Array<{
    name: string;
    language: {
      name: string;
      url: string;
    };
  }>;
  pokemon: Array<{
    slot: number;
    pokemon: {
      name: string;
      url: string;
    };
  }>;
  moves: Array<{
    name: string;
    url: string;
  }>;
}

// API response types
export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Array<{
    name: string;
    url: string;
  }>;
}

// Filter and search types
export interface PokemonFilters {
  search: string;
  types: string[];
  generation: string[];
  evolutionStage: string[];
  minBST: number;
  maxBST: number;
  color: string[];
  eggGroup: string[];
}

export interface PokemonSearchParams {
  limit: number;
  offset: number;
  search?: string;
  type?: string;
}

// User data types
export interface UserFavorites {
  pokemonIds: number[];
}

export interface UserTeam {
  id: string;
  name: string;
  pokemonIds: number[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  defaultView: 'grid' | 'list';
  itemsPerPage: number;
}

// Chart data types
export interface StatChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor: string | string[];
    borderColor: string | string[];
    borderWidth: number;
  }>;
}

export interface TypeEffectivenessData {
  [type: string]: {
    [targetType: string]: number; // 0, 0.5, 1, 2
  };
}
