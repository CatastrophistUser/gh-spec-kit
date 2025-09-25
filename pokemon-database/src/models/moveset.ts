import type { PokemonMove } from '../types';

export type Moveset = PokemonMove;

export function groupMovesByMethod(moves: PokemonMove[]) {
  return moves.reduce((acc: Record<string, PokemonMove[]>, m) => {
    m.version_group_details.forEach(d => {
      const method = d.move_learn_method.name;
      acc[method] = acc[method] || [];
      acc[method].push(m);
    });
    return acc;
  }, {} as Record<string, PokemonMove[]>);
}
