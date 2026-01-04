export enum WordType {
  NOUN = 'noun',
  VERB = 'verb',
  ADJECTIVE = 'adjective'
}

export interface WordData {
  text: string;
  jp: string;
  type: WordType;
}

export interface Enemy {
  id: string;
  x: number;
  y: number;
  wordData: WordData;
  speed: number;
  width: number;
  height: number;
  isHit: boolean; // For flash effect
}

export interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
}

export enum GameState {
  MENU,
  PLAYING,
  GAME_OVER
}

export enum GameMode {
  NORMAL = 'normal',
  IMABARI = 'imabari'
}

export interface GameStats {
  score: number;
  hp: number;
  wave: number;
}