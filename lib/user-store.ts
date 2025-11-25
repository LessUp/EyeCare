// User Store - 用户状态管理系统
// 使用 localStorage 进行持久化存储

export type MembershipTier = 'free' | 'basic' | 'premium' | 'professional';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  membershipTier: MembershipTier;
  membershipExpiry?: number; // timestamp
  createdAt: number;
  lastLoginAt: number;
  profile: UserProfile;
  preferences: UserPreferences;
}

export interface UserProfile {
  age?: number;
  gender?: 'male' | 'female' | 'other';
  occupation?: string;
  eyeConditions?: string[]; // 已有的眼部问题
  screenTime?: number; // 每日屏幕时间（小时）
  wearGlasses?: boolean;
  prescription?: {
    left?: number;
    right?: number;
  };
}

export interface UserPreferences {
  language: 'en' | 'zh';
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  dailyReminder: boolean;
  reminderTime?: string; // HH:mm format
}

export interface TestResult {
  id: string;
  testType: 'acuity' | 'color' | 'contrast' | 'field' | 'micro' | 'gabor' | 'mot';
  timestamp: number;
  score: number;
  details: Record<string, any>;
  aiAnalysis?: AIAnalysisResult;
}

export interface AIAnalysisResult {
  summary: string;
  riskLevel: 'low' | 'medium' | 'high';
  recommendations: string[];
  scientificReferences: string[];
  nextSteps: string[];
}

const USER_KEY = 'eyecare_user';
const TEST_RESULTS_KEY = 'eyecare_test_results';

// 生成唯一ID
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// 获取当前用户
export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const data = localStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

// 创建新用户（注册）
export function createUser(email: string, name: string, password: string): User {
  const user: User = {
    id: generateId(),
    email,
    name,
    membershipTier: 'free',
    createdAt: Date.now(),
    lastLoginAt: Date.now(),
    profile: {},
    preferences: {
      language: 'zh',
      theme: 'system',
      notifications: true,
      dailyReminder: false,
    },
  };
  
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    // 存储密码hash（实际应用中应该在服务端处理）
    localStorage.setItem(`${USER_KEY}_auth`, btoa(password));
  }
  
  return user;
}

// 登录
export function loginUser(email: string, password: string): User | null {
  if (typeof window === 'undefined') return null;
  
  const user = getCurrentUser();
  if (!user || user.email !== email) return null;
  
  const storedPassword = localStorage.getItem(`${USER_KEY}_auth`);
  if (storedPassword !== btoa(password)) return null;
  
  user.lastLoginAt = Date.now();
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  
  return user;
}

// 登出
export function logoutUser(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(`${USER_KEY}_auth`);
}

// 更新用户信息
export function updateUser(updates: Partial<User>): User | null {
  const user = getCurrentUser();
  if (!user) return null;
  
  const updatedUser = { ...user, ...updates };
  
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
  }
  
  return updatedUser;
}

// 更新用户档案
export function updateUserProfile(profile: Partial<UserProfile>): User | null {
  const user = getCurrentUser();
  if (!user) return null;
  
  user.profile = { ...user.profile, ...profile };
  
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
  
  return user;
}

// 升级会员
export function upgradeMembership(tier: MembershipTier, durationDays: number): User | null {
  const user = getCurrentUser();
  if (!user) return null;
  
  user.membershipTier = tier;
  user.membershipExpiry = Date.now() + durationDays * 24 * 60 * 60 * 1000;
  
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
  
  return user;
}

// 检查会员状态
export function checkMembershipStatus(): { isActive: boolean; tier: MembershipTier; daysRemaining: number } {
  const user = getCurrentUser();
  
  if (!user) {
    return { isActive: false, tier: 'free', daysRemaining: 0 };
  }
  
  if (user.membershipTier === 'free') {
    return { isActive: true, tier: 'free', daysRemaining: Infinity };
  }
  
  const now = Date.now();
  const expiry = user.membershipExpiry || 0;
  const daysRemaining = Math.max(0, Math.ceil((expiry - now) / (24 * 60 * 60 * 1000)));
  
  return {
    isActive: now < expiry,
    tier: user.membershipTier,
    daysRemaining,
  };
}

// 获取测试结果历史
export function getTestResults(): TestResult[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const data = localStorage.getItem(TEST_RESULTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

// 保存测试结果
export function saveTestResult(result: Omit<TestResult, 'id'>): TestResult {
  const testResult: TestResult = {
    ...result,
    id: generateId(),
  };
  
  if (typeof window !== 'undefined') {
    const results = getTestResults();
    results.push(testResult);
    // 保留最近500条记录
    const trimmed = results.slice(-500);
    localStorage.setItem(TEST_RESULTS_KEY, JSON.stringify(trimmed));
  }
  
  return testResult;
}

// 获取特定类型的测试结果
export function getTestResultsByType(testType: string): TestResult[] {
  return getTestResults().filter(r => r.testType === testType);
}

// 获取测试统计
export function getTestStatistics() {
  const results = getTestResults();
  
  const stats = {
    totalTests: results.length,
    testsByType: {} as Record<string, number>,
    averageScores: {} as Record<string, number>,
    recentTrend: 'stable' as 'improving' | 'declining' | 'stable',
    lastTestDate: results.length > 0 ? results[results.length - 1].timestamp : null,
  };
  
  // 按类型统计
  results.forEach(r => {
    stats.testsByType[r.testType] = (stats.testsByType[r.testType] || 0) + 1;
  });
  
  // 计算平均分
  const scoresByType: Record<string, number[]> = {};
  results.forEach(r => {
    if (!scoresByType[r.testType]) scoresByType[r.testType] = [];
    scoresByType[r.testType].push(r.score);
  });
  
  Object.entries(scoresByType).forEach(([type, scores]) => {
    stats.averageScores[type] = scores.reduce((a, b) => a + b, 0) / scores.length;
  });
  
  // 计算趋势
  if (results.length >= 10) {
    const recent = results.slice(-5);
    const older = results.slice(-10, -5);
    const recentAvg = recent.reduce((a, b) => a + b.score, 0) / recent.length;
    const olderAvg = older.reduce((a, b) => a + b.score, 0) / older.length;
    
    if (recentAvg > olderAvg * 1.05) stats.recentTrend = 'improving';
    else if (recentAvg < olderAvg * 0.95) stats.recentTrend = 'declining';
  }
  
  return stats;
}

// 会员权益配置
export const membershipBenefits = {
  free: {
    name: '免费版',
    nameEn: 'Free',
    price: 0,
    features: [
      '基础视力测试',
      '每日1次训练游戏',
      '基础知识库访问',
      '7天历史记录',
    ],
    featuresEn: [
      'Basic vision tests',
      '1 training game per day',
      'Basic knowledge base',
      '7-day history',
    ],
    limits: {
      dailyTests: 3,
      dailyGames: 1,
      historyDays: 7,
      aiAnalysis: false,
      shareCards: false,
      exportData: false,
    },
  },
  basic: {
    name: '基础会员',
    nameEn: 'Basic',
    price: 19.9,
    features: [
      '所有视力测试',
      '每日5次训练游戏',
      '完整知识库访问',
      '30天历史记录',
      '基础数据分析',
    ],
    featuresEn: [
      'All vision tests',
      '5 training games per day',
      'Full knowledge base',
      '30-day history',
      'Basic analytics',
    ],
    limits: {
      dailyTests: 10,
      dailyGames: 5,
      historyDays: 30,
      aiAnalysis: false,
      shareCards: true,
      exportData: false,
    },
  },
  premium: {
    name: '高级会员',
    nameEn: 'Premium',
    price: 49.9,
    features: [
      '所有视力测试',
      '无限次训练游戏',
      '完整知识库 + 论文解读',
      '180天历史记录',
      '高级数据分析',
      'AI智能分析报告',
      '分享卡片功能',
    ],
    featuresEn: [
      'All vision tests',
      'Unlimited training games',
      'Full knowledge base + Papers',
      '180-day history',
      'Advanced analytics',
      'AI analysis reports',
      'Share card feature',
    ],
    limits: {
      dailyTests: Infinity,
      dailyGames: Infinity,
      historyDays: 180,
      aiAnalysis: true,
      shareCards: true,
      exportData: true,
    },
  },
  professional: {
    name: '专业版',
    nameEn: 'Professional',
    price: 99.9,
    features: [
      '所有高级会员功能',
      '永久历史记录',
      '专业级AI分析',
      '数据导出功能',
      '优先客服支持',
      '新功能抢先体验',
      '家庭共享（最多5人）',
    ],
    featuresEn: [
      'All Premium features',
      'Unlimited history',
      'Professional AI analysis',
      'Data export',
      'Priority support',
      'Early access to features',
      'Family sharing (up to 5)',
    ],
    limits: {
      dailyTests: Infinity,
      dailyGames: Infinity,
      historyDays: Infinity,
      aiAnalysis: true,
      shareCards: true,
      exportData: true,
    },
  },
};
