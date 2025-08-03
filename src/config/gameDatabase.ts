import { Collection } from 'mongodb';
import { collection } from './database';
import { User } from '../models/User';
import { GameSession } from '../models/GameSession';
import { LeaderboardEntry, GameResult } from '../models/Leaderboard';

// Game-related database operations
export class GameDatabase {
  private collection: Collection;

  constructor() {
    this.collection = collection;
  }

  // Seed game database with sample data
  async seedGameData() {
    try {
      // Check if game users already exist
      const existingGameUsers = await this.collection.countDocuments({ type: 'user', username: { $exists: true } });
      
      if (existingGameUsers === 0) {
        console.log('Seeding game database with sample users...');
        
        const gameUsers: User[] = [
          {
            id: 101,
            type: 'user',
            username: 'player1',
            email: 'player1@example.com',
            gamesPlayed: 15,
            gamesWon: 8,
            gamesLost: 4,
            gamesDrawn: 3,
            totalScore: 850,
            winRate: 53.3,
            createdAt: new Date('2024-01-15'),
            lastActive: new Date()
          },
          {
            id: 102,
            type: 'user',
            username: 'player2',
            email: 'player2@example.com',
            gamesPlayed: 12,
            gamesWon: 7,
            gamesLost: 3,
            gamesDrawn: 2,
            totalScore: 720,
            winRate: 58.3,
            createdAt: new Date('2024-01-20'),
            lastActive: new Date()
          },
          {
            id: 103,
            type: 'user',
            username: 'player3',
            email: 'player3@example.com',
            gamesPlayed: 20,
            gamesWon: 12,
            gamesLost: 6,
            gamesDrawn: 2,
            totalScore: 1150,
            winRate: 60.0,
            createdAt: new Date('2024-01-10'),
            lastActive: new Date()
          },
          {
            id: 104,
            type: 'user',
            username: 'player4',
            email: 'player4@example.com',
            gamesPlayed: 8,
            gamesWon: 3,
            gamesLost: 4,
            gamesDrawn: 1,
            totalScore: 320,
            winRate: 37.5,
            createdAt: new Date('2024-01-25'),
            lastActive: new Date()
          }
        ];

        await this.collection.insertMany(gameUsers);
        console.log(`Inserted ${gameUsers.length} game users`);

        // Create leaderboard entries
        const leaderboardEntries: LeaderboardEntry[] = gameUsers.map((user, index) => ({
          id: 201 + index,
          type: 'leaderboard_entry',
          userId: user.id,
          username: user.username,
          rank: index + 1,
          totalScore: user.totalScore,
          gamesPlayed: user.gamesPlayed,
          gamesWon: user.gamesWon,
          gamesLost: user.gamesLost,
          gamesDrawn: user.gamesDrawn,
          winRate: user.winRate,
          averageGameDuration: 120 + Math.random() * 180,
          longestWinStreak: Math.floor(Math.random() * 5) + 1,
          currentWinStreak: Math.floor(Math.random() * 3),
          lastGameAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        }));

        await this.collection.insertMany(leaderboardEntries);
        console.log(`Inserted ${leaderboardEntries.length} leaderboard entries`);

        // Create some sample completed games
        const sampleGames: GameSession[] = [
          {
            id: 301,
            type: 'game_session',
            playerX: { userId: 101, username: 'player1' },
            playerO: { userId: 102, username: 'player2' },
            board: ['X', 'O', 'X', 'O', 'X', 'O', null, null, 'X'],
            currentPlayer: 'X',
            status: 'completed',
            winner: 'X',
            winningLine: [0, 4, 8],
            moves: [
              { playerId: 101, player: 'X', position: 0, timestamp: new Date(), moveNumber: 1 },
              { playerId: 102, player: 'O', position: 1, timestamp: new Date(), moveNumber: 2 },
              { playerId: 101, player: 'X', position: 2, timestamp: new Date(), moveNumber: 3 },
              { playerId: 102, player: 'O', position: 3, timestamp: new Date(), moveNumber: 4 },
              { playerId: 101, player: 'X', position: 4, timestamp: new Date(), moveNumber: 5 },
              { playerId: 102, player: 'O', position: 5, timestamp: new Date(), moveNumber: 6 },
              { playerId: 101, player: 'X', position: 8, timestamp: new Date(), moveNumber: 7 }
            ],
            startedAt: new Date(Date.now() - 300000),
            completedAt: new Date(),
            duration: 300,
            createdAt: new Date()
          }
        ];

        await this.collection.insertMany(sampleGames);
        console.log(`Inserted ${sampleGames.length} sample game sessions`);
      } else {
        console.log('Game data already exists. Skipping seed.');
      }
    } catch (error) {
      console.error('Error seeding game database:', error);
      throw error;
    }
  }

  // User operations
  async createUser(userData: Omit<User, 'id' | 'type' | 'gamesPlayed' | 'gamesWon' | 'gamesLost' | 'gamesDrawn' | 'totalScore' | 'winRate' | 'createdAt'>): Promise<User> {
    const items = await this.collection.find({}, { projection: { id: 1 } }).toArray();
    const maxId = items.length > 0 ? Math.max(...items.map((item: any) => item.id || 0)) : 0;
    const nextId = maxId + 1;

    const newUser: User = {
      id: nextId,
      type: 'user',
      gamesPlayed: 0,
      gamesWon: 0,
      gamesLost: 0,
      gamesDrawn: 0,
      totalScore: 0,
      winRate: 0,
      createdAt: new Date(),
      ...userData
    };

    await this.collection.insertOne(newUser);
    return newUser;
  }

  async getUserById(userId: number): Promise<User | null> {
    return await this.collection.findOne({ type: 'user', id: userId }) as User | null;
  }

  async getUserByUsername(username: string): Promise<User | null> {
    return await this.collection.findOne({ type: 'user', username }) as User | null;
  }

  async updateUserStats(userId: number, stats: Partial<User>): Promise<void> {
    await this.collection.updateOne(
      { type: 'user', id: userId },
      { $set: { ...stats, updatedAt: new Date() } }
    );
  }

  // Game session operations
  async createGameSession(playerXId: number, playerOId: number): Promise<GameSession> {
    const playerX = await this.getUserById(playerXId);
    const playerO = await this.getUserById(playerOId);

    if (!playerX || !playerO) {
      throw new Error('One or both players not found');
    }

    const items = await this.collection.find({}, { projection: { id: 1 } }).toArray();
    const maxId = items.length > 0 ? Math.max(...items.map((item: any) => item.id || 0)) : 0;
    const nextId = maxId + 1;

    const newGame: GameSession = {
      id: nextId,
      type: 'game_session',
      playerX: { userId: playerX.id, username: playerX.username },
      playerO: { userId: playerO.id, username: playerO.username },
      board: Array(9).fill(null),
      currentPlayer: 'X',
      status: 'waiting',
      moves: [],
      startedAt: new Date(),
      createdAt: new Date()
    };

    await this.collection.insertOne(newGame);
    return newGame;
  }

  async getGameSession(gameId: number): Promise<GameSession | null> {
    return await this.collection.findOne({ type: 'game_session', id: gameId }) as GameSession | null;
  }

  async updateGameSession(gameId: number, updates: Partial<GameSession>): Promise<void> {
    await this.collection.updateOne(
      { type: 'game_session', id: gameId },
      { $set: { ...updates, updatedAt: new Date() } }
    );
  }

  // Leaderboard operations
  async getLeaderboard(limit: number = 10): Promise<LeaderboardEntry[]> {
    return await this.collection
      .find({ type: 'leaderboard_entry' })
      .sort({ totalScore: -1 })
      .limit(limit)
      .toArray() as LeaderboardEntry[];
  }

  async updateLeaderboard(userId: number, stats: Partial<LeaderboardEntry>): Promise<void> {
    await this.collection.updateOne(
      { type: 'leaderboard_entry', userId },
      { $set: { ...stats, updatedAt: new Date() } },
      { upsert: true }
    );
  }

  // Game statistics
  async getGameStats() {
    const totalGames = await this.collection.countDocuments({ type: 'game_session' });
    const activeGames = await this.collection.countDocuments({ type: 'game_session', status: { $in: ['waiting', 'in_progress'] } });
    const completedGames = await this.collection.countDocuments({ type: 'game_session', status: 'completed' });

    return {
      totalGames,
      activeGames,
      completedGames,
      totalUsers: await this.collection.countDocuments({ type: 'user', username: { $exists: true } })
    };
  }
}

export const gameDatabase = new GameDatabase();