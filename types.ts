export interface FishOption {
  id: string;
  name: string;
  color: string;
  textColor: string;
}

export enum GameState {
  IDLE = 'IDLE',
  SPINNING = 'SPINNING',
  RESULT = 'RESULT',
}