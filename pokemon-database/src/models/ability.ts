export interface AbilityModel {
  name: string;
  description?: string;
  is_hidden?: boolean;
}

export function toAbilityModel(name: string, is_hidden = false): AbilityModel {
  return { name, is_hidden };
}
