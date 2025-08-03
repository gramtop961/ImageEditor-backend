export interface LeaderboardEntry {
  id: number;
  type: 'leaderboard_entry';
  userId: number;
  username: string;
  avatar?: string;
  rank: number;
  totalScore: number;
  gamesPlayed: number;
  gamesWon: number;
  gamesLost: number;
  gamesDrawn: number;
  winRate: number;
  averageGameDuration: number;
  longestWinStreak: number;
  currentWinStreak: number;
  lastGameAt?: Date;
  createdAt: Date;
  updatedAt?: Date;
}

export interface GameResult {
  id: number;
  type: 'game_result';
  gameSessionId: number;
  playerId: number;
  username: string;
  result: 'win' | 'loss' | 'draw';
  scoreAwarded: number;
  gameDuration: number;
  movesCount: number;
  createdAt: Date;
}

export interface LeaderboardQuery {
  limit?: number;
  offset?: number;
  period?: 'all_time' | 'monthly' | 'weekly' | 'daily';
  sortBy?: 'totalScore' | 'winRate' | 'gamesWon' | 'winStreak';
  sortOrder?: 'asc' | 'desc';
}

export interface LeaderboardStats {
  totalPlayers: number;
  totalGames: number;
  topPlayer: {
    username: string;
    totalScore: number;
    winRate: number;
  };
  averageWinRate: number;
  mostActivePlayer: {
    username: string;
    gamesPlayed: number;
  };
}

export interface ScoreCalculation {
  baseScore: number;
  winBonus: number;
  speedBonus: number;
  streakBonus: number;
  totalScore: number;
}