export type Role = 'Raja' | 'Rani' | 'Chor' | 'Sipahi';
export type Player = {
  id: number;
  name: string;
  score: number;
  currentRole?: Role;
};

export type GameState = {
  players: Player[];
  round: number;
  phase: 'picking' | 'guessing' | 'results';
  availableChits: Role[];
  currentTurn: number;
};