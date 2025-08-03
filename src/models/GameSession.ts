export type Player = 'X' | 'O' | null;
export type Board = Player[];

export interface GameSession {
  id: number;
  type: 'game_session';
  playerX: {
    userId: number;
    username: string;
  };
  playerO: {
    userId: number;
    username: string;
  };
  board: Board; // Array of 9 elements representing the 3x3 grid
  currentPlayer: 'X' | 'O';
  status: 'waiting' | 'in_progress' | 'completed' | 'abandoned';
  winner?: 'X' | 'O' | 'draw';
  winningLine?: number[]; // Indices of winning squares
  moves: GameMove[];
  startedAt: Date;
  completedAt?: Date;
  duration?: number; // Duration in seconds
  createdAt: Date;
  updatedAt?: Date;
}

export interface GameMove {
  playerId: number;
  player: 'X' | 'O';
  position: number; // 0-8 representing board position
  timestamp: Date;
  moveNumber: number;
}

export interface CreateGameSessionData {
  playerXId: number;
  playerOId: number;
}

export interface UpdateGameSessionData {
  board?: Board;
  currentPlayer?: 'X' | 'O';
  status?: 'waiting' | 'in_progress' | 'completed' | 'abandoned';
  winner?: 'X' | 'O' | 'draw';
  winningLine?: number[];
  completedAt?: Date;
  duration?: number;
}

export interface GameStats {
  totalGames: number;
  activeGames: number;
  completedGames: number;
  averageGameDuration: number;
  winDistribution: {
    X: number;
    O: number;
    draw: number;
  };
}