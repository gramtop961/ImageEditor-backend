export interface User {
  id: number;
  type: 'user';
  username: string;
  email: string;
  password?: string; // Will be hashed
  avatar?: string;
  gamesPlayed: number;
  gamesWon: number;
  gamesLost: number;
  gamesDrawn: number;
  totalScore: number;
  winRate: number;
  createdAt: Date;
  updatedAt?: Date;
  lastActive?: Date;
}

export interface CreateUserData {
  username: string;
  email: string;
  password: string;
  avatar?: string;
}

export interface UpdateUserData {
  username?: string;
  email?: string;
  avatar?: string;
  lastActive?: Date;
}