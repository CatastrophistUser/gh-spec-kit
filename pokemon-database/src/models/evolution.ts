export interface EvolutionStep {
  from: string;
  to: string;
  conditions?: string[];
}

export interface EvolutionChainModel {
  steps: EvolutionStep[];
}
