// Progress Tracking System for Vision Training Games
// Uses localStorage for persistent data storage

export interface GameSession {
  gameType: 'gabor' | 'mot' | 'contrast' | 'vernier' | 'crowding' | 'visual-search' | 'schulte' | 'change-detection';
  timestamp: number;
  duration: number; // in seconds
  score: number;
  difficulty: number;
  accuracy: number; // 0-100
  rounds: number;
  metadata?: {
    bestContrast?: number;
    targetCount?: number;
    avgReactionTime?: number;
    mode?: string;
    gridSize?: number;
    mistakes?: number;
    avgClickInterval?: number;
    bestStreak?: number;
    difficultyMode?: string;
    [key: string]: any;
  };
}

export interface GameStats {
  gameType: string;
  totalSessions: number;
  totalDuration: number;
  averageScore: number;
  averageAccuracy: number;
  bestScore: number;
  lastPlayed: number;
  improvement: number; // percentage change
}

export interface TrainingStreak {
  current: number;
  longest: number;
  lastTrainingDate: string; // YYYY-MM-DD
}

const STORAGE_KEY = 'eyecare_training_history';
const STREAK_KEY = 'eyecare_training_streak';

// Get all training sessions
export function getTrainingSessions(): GameSession[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading training history:', error);
    return [];
  }
}

// Save a new training session
export function saveTrainingSession(session: GameSession): void {
  if (typeof window === 'undefined') return;
  
  try {
    const sessions = getTrainingSessions();
    sessions.push(session);
    
    // Keep only last 500 sessions to prevent storage bloat
    const trimmedSessions = sessions.slice(-500);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedSessions));
    
    // Update streak
    updateTrainingStreak();
  } catch (error) {
    console.error('Error saving training session:', error);
  }
}

// Get sessions for a specific game
export function getGameSessions(gameType: string): GameSession[] {
  return getTrainingSessions().filter(s => s.gameType === gameType);
}

// Get sessions within a date range
export function getSessionsInRange(startDate: Date, endDate: Date): GameSession[] {
  const sessions = getTrainingSessions();
  return sessions.filter(s => {
    const sessionDate = new Date(s.timestamp);
    return sessionDate >= startDate && sessionDate <= endDate;
  });
}

// Calculate statistics for a game type
export function getGameStats(gameType: string): GameStats | null {
  const sessions = getGameSessions(gameType);
  
  if (sessions.length === 0) return null;
  
  const totalDuration = sessions.reduce((sum, s) => sum + s.duration, 0);
  const totalScore = sessions.reduce((sum, s) => sum + s.score, 0);
  const totalAccuracy = sessions.reduce((sum, s) => sum + s.accuracy, 0);
  const bestScore = Math.max(...sessions.map(s => s.score));
  const lastPlayed = Math.max(...sessions.map(s => s.timestamp));
  
  // Calculate improvement (compare recent vs old sessions)
  const recentSessions = sessions.slice(-10);
  const oldSessions = sessions.slice(0, 10);
  
  let improvement = 0;
  if (oldSessions.length > 0 && recentSessions.length > 0) {
    const oldAvg = oldSessions.reduce((sum, s) => sum + s.accuracy, 0) / oldSessions.length;
    const recentAvg = recentSessions.reduce((sum, s) => sum + s.accuracy, 0) / recentSessions.length;
    improvement = ((recentAvg - oldAvg) / oldAvg) * 100;
  }
  
  return {
    gameType,
    totalSessions: sessions.length,
    totalDuration,
    averageScore: totalScore / sessions.length,
    averageAccuracy: totalAccuracy / sessions.length,
    bestScore,
    lastPlayed,
    improvement
  };
}

// Get overall training statistics
export function getOverallStats(): {
  totalSessions: number;
  totalHours: number;
  averageAccuracy: number;
  gamesPlayed: string[];
  weeklyActivity: number[];
} {
  const sessions = getTrainingSessions();
  
  const totalSessions = sessions.length;
  const totalHours = sessions.reduce((sum, s) => sum + s.duration, 0) / 3600;
  const averageAccuracy = sessions.length > 0 
    ? sessions.reduce((sum, s) => sum + s.accuracy, 0) / sessions.length 
    : 0;
  
  const gamesPlayed = Array.from(new Set(sessions.map(s => s.gameType)));
  
  // Calculate activity for the past 7 days
  const weeklyActivity = Array(7).fill(0);
  const now = new Date();
  
  sessions.forEach(session => {
    const sessionDate = new Date(session.timestamp);
    const daysDiff = Math.floor((now.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff >= 0 && daysDiff < 7) {
      weeklyActivity[6 - daysDiff]++;
    }
  });
  
  return {
    totalSessions,
    totalHours,
    averageAccuracy,
    gamesPlayed,
    weeklyActivity
  };
}

// Get training streak information
export function getTrainingStreak(): TrainingStreak {
  if (typeof window === 'undefined') {
    return { current: 0, longest: 0, lastTrainingDate: '' };
  }
  
  try {
    const data = localStorage.getItem(STREAK_KEY);
    return data ? JSON.parse(data) : { current: 0, longest: 0, lastTrainingDate: '' };
  } catch (error) {
    return { current: 0, longest: 0, lastTrainingDate: '' };
  }
}

// Update training streak
function updateTrainingStreak(): void {
  if (typeof window === 'undefined') return;
  
  const today = new Date().toISOString().split('T')[0];
  const streak = getTrainingStreak();
  
  if (streak.lastTrainingDate === today) {
    // Already trained today, no update needed
    return;
  }
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  
  if (streak.lastTrainingDate === yesterdayStr) {
    // Consecutive day, increment streak
    streak.current++;
  } else if (streak.lastTrainingDate === '') {
    // First training session
    streak.current = 1;
  } else {
    // Streak broken, reset
    streak.current = 1;
  }
  
  streak.longest = Math.max(streak.longest, streak.current);
  streak.lastTrainingDate = today;
  
  localStorage.setItem(STREAK_KEY, JSON.stringify(streak));
}

// Get performance data for charts (last N sessions)
export function getPerformanceData(gameType: string, limit: number = 30): {
  labels: string[];
  accuracy: number[];
  scores: number[];
  difficulty: number[];
} {
  const sessions = getGameSessions(gameType).slice(-limit);
  
  return {
    labels: sessions.map((s, i) => `#${i + 1}`),
    accuracy: sessions.map(s => s.accuracy),
    scores: sessions.map(s => s.score),
    difficulty: sessions.map(s => s.difficulty)
  };
}

// Export data as JSON
export function exportTrainingData(): string {
  const sessions = getTrainingSessions();
  const streak = getTrainingStreak();
  
  return JSON.stringify({
    sessions,
    streak,
    exportDate: new Date().toISOString()
  }, null, 2);
}

// Import data from JSON
export function importTrainingData(jsonData: string): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const data = JSON.parse(jsonData);
    
    if (data.sessions && Array.isArray(data.sessions)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data.sessions));
    }
    
    if (data.streak) {
      localStorage.setItem(STREAK_KEY, JSON.stringify(data.streak));
    }
    
    return true;
  } catch (error) {
    console.error('Error importing training data:', error);
    return false;
  }
}

// Clear all training data
export function clearTrainingData(): void {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(STREAK_KEY);
}
