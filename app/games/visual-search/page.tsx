'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Search, RefreshCcw, Info, Clock, Zap, Trophy } from 'lucide-react';
import { saveTrainingSession } from '@/lib/progress-tracker';

interface Target {
  id: number;
  x: number;
  y: number;
  rotation: number;
  isTarget: boolean;
  shape: 'T' | 'L';
  color: string;
  found?: boolean;
}

type SearchMode = 'feature' | 'conjunction' | 'spatial';

const COLORS = {
  red: '#EF4444',
  blue: '#3B82F6',
  green: '#10B981',
  purple: '#8B5CF6',
};

export default function VisualSearchGame() {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'feedback' | 'gameover'>('idle');
  const [mode, setMode] = useState<SearchMode>('feature');
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [targets, setTargets] = useState<Target[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [reactionTime, setReactionTime] = useState<number[]>([]);
  const [roundStartTime, setRoundStartTime] = useState(0);
  const [totalRounds, setTotalRounds] = useState(0);
  const [correctRounds, setCorrectRounds] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState(0);
  const [feedback, setFeedback] = useState<{ correct: boolean; time: number } | null>(null);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 根据模式和难度生成目标
  const generateTargets = useCallback(() => {
    const itemCount = 12 + level * 4; // 16, 20, 24...
    const newTargets: Target[] = [];
    const gridSize = Math.ceil(Math.sqrt(itemCount * 1.5));
    const cellWidth = 600 / gridSize;
    const cellHeight = 400 / gridSize;
    
    // 确定目标特征
    const targetShape: 'T' | 'L' = 'T';
    const targetColor = 'red';
    const targetRotation = 0;
    
    // 根据模式设置干扰项特征
    const getDistractorProps = (index: number): Partial<Target> => {
      switch (mode) {
        case 'feature':
          // 特征搜索：目标和干扰项只有一个特征不同（形状）
          return {
            shape: 'L',
            color: targetColor,
            rotation: [0, 90, 180, 270][Math.floor(Math.random() * 4)],
          };
        case 'conjunction':
          // 结合搜索：需要同时匹配多个特征
          const conjColors = ['red', 'blue'];
          const conjShapes: ('T' | 'L')[] = ['T', 'L'];
          // 干扰项要么颜色对但形状错，要么形状对但颜色错
          if (index % 2 === 0) {
            return {
              shape: 'L',
              color: 'red',
              rotation: [0, 90, 180, 270][Math.floor(Math.random() * 4)],
            };
          } else {
            return {
              shape: 'T',
              color: 'blue',
              rotation: [0, 90, 180, 270][Math.floor(Math.random() * 4)],
            };
          }
        case 'spatial':
          // 空间搜索：相同形状但不同朝向
          return {
            shape: 'T',
            color: targetColor,
            rotation: [90, 180, 270][Math.floor(Math.random() * 3)],
          };
        default:
          return { shape: 'L', color: 'blue', rotation: 0 };
      }
    };
    
    // 随机选择目标位置
    const targetIndex = Math.floor(Math.random() * itemCount);
    
    for (let i = 0; i < itemCount; i++) {
      const gridX = i % gridSize;
      const gridY = Math.floor(i / gridSize);
      
      const isTarget = i === targetIndex;
      const props = isTarget ? {} : getDistractorProps(i);
      
      newTargets.push({
        id: i,
        x: gridX * cellWidth + cellWidth / 2 + (Math.random() - 0.5) * cellWidth * 0.5,
        y: gridY * cellHeight + cellHeight / 2 + (Math.random() - 0.5) * cellHeight * 0.5,
        rotation: isTarget ? targetRotation : (props.rotation || 0),
        isTarget,
        shape: isTarget ? targetShape : (props.shape || 'L'),
        color: isTarget ? COLORS[targetColor as keyof typeof COLORS] : COLORS[(props.color || 'blue') as keyof typeof COLORS],
      });
    }
    
    setTargets(newTargets);
  }, [level, mode]);

  // 开始新回合
  const startRound = useCallback(() => {
    generateTargets();
    setGameState('playing');
    setRoundStartTime(Date.now());
    setFeedback(null);
    
    // 设置时间限制
    const timeLimit = Math.max(3000, 8000 - level * 500);
    setTimeLeft(timeLimit);
    
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 100) {
          handleTimeout();
          return 0;
        }
        return prev - 100;
      });
    }, 100);
  }, [generateTargets, level]);

  // 超时处理
  const handleTimeout = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setStreak(0);
    setTotalRounds(r => r + 1);
    setFeedback({ correct: false, time: 0 });
    setGameState('feedback');
    
    setTimeout(() => {
      if (level > 1) setLevel(l => l - 1);
      startRound();
    }, 1500);
  };

  // 点击处理
  const handleClick = (target: Target) => {
    if (gameState !== 'playing') return;
    if (timerRef.current) clearInterval(timerRef.current);
    
    const rt = Date.now() - roundStartTime;
    const newTotalRounds = totalRounds + 1;
    setTotalRounds(newTotalRounds);
    
    if (target.isTarget) {
      // 正确
      const timeBonus = Math.max(0, Math.floor((timeLeft / 1000) * 10));
      const levelBonus = level * 50;
      const streakBonus = streak * 10;
      const roundScore = 100 + timeBonus + levelBonus + streakBonus;
      
      setScore(s => s + roundScore);
      setStreak(s => s + 1);
      setBestStreak(b => Math.max(b, streak + 1));
      setCorrectRounds(c => c + 1);
      setReactionTime(rt => [...rt, Date.now() - roundStartTime]);
      setFeedback({ correct: true, time: rt });
      
      // 标记目标为已找到
      setTargets(targets.map(t => t.id === target.id ? { ...t, found: true } : t));
      setGameState('feedback');
      
      // 每5轮保存进度
      if (newTotalRounds % 5 === 0) {
        saveProgress(newTotalRounds);
      }
      
      setTimeout(() => {
        setLevel(l => Math.min(l + 1, 20));
        startRound();
      }, 1000);
    } else {
      // 错误
      setStreak(0);
      setFeedback({ correct: false, time: rt });
      
      // 显示正确目标
      setTargets(targets.map(t => t.isTarget ? { ...t, found: true } : t));
      setGameState('feedback');
      
      setTimeout(() => {
        if (level > 1) setLevel(l => l - 1);
        startRound();
      }, 1500);
    }
  };

  // 保存进度
  const saveProgress = (rounds: number) => {
    const duration = (Date.now() - sessionStartTime) / 1000;
    const accuracy = rounds > 0 ? (correctRounds / rounds) * 100 : 0;
    const avgRT = reactionTime.length > 0 
      ? reactionTime.reduce((a, b) => a + b, 0) / reactionTime.length 
      : 0;
    
    saveTrainingSession({
      gameType: 'visual-search',
      timestamp: Date.now(),
      duration,
      score,
      difficulty: level,
      accuracy,
      rounds,
      metadata: {
        mode,
        avgReactionTime: avgRT,
        bestStreak,
      }
    });
  };

  // 开始游戏
  const startGame = () => {
    setScore(0);
    setLevel(1);
    setStreak(0);
    setBestStreak(0);
    setTotalRounds(0);
    setCorrectRounds(0);
    setReactionTime([]);
    setSessionStartTime(Date.now());
    startRound();
  };

  // 清理定时器
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // 渲染形状
  const renderShape = (target: Target) => {
    const size = 24;
    const style: React.CSSProperties = {
      position: 'absolute',
      left: target.x - size / 2,
      top: target.y - size / 2,
      width: size,
      height: size,
      transform: `rotate(${target.rotation}deg)`,
      cursor: gameState === 'playing' ? 'pointer' : 'default',
      transition: 'all 0.2s',
    };

    if (target.found) {
      return (
        <div
          key={target.id}
          style={{
            ...style,
            borderRadius: '50%',
            backgroundColor: target.isTarget ? '#10B981' : '#EF4444',
            boxShadow: target.isTarget ? '0 0 20px #10B981' : '0 0 10px #EF4444',
          }}
        />
      );
    }

    // T形或L形
    if (target.shape === 'T') {
      return (
        <div key={target.id} style={style} onClick={() => handleClick(target)}>
          <svg width={size} height={size} viewBox="0 0 24 24">
            <rect x="2" y="2" width="20" height="6" fill={target.color} rx="1" />
            <rect x="9" y="2" width="6" height="20" fill={target.color} rx="1" />
          </svg>
        </div>
      );
    } else {
      return (
        <div key={target.id} style={style} onClick={() => handleClick(target)}>
          <svg width={size} height={size} viewBox="0 0 24 24">
            <rect x="2" y="2" width="6" height="20" fill={target.color} rx="1" />
            <rect x="2" y="16" width="20" height="6" fill={target.color} rx="1" />
          </svg>
        </div>
      );
    }
  };

  const getModeInfo = () => {
    switch (mode) {
      case 'feature':
        return {
          title: '特征搜索',
          titleEn: 'Feature Search',
          desc: '找到唯一的红色T形',
          descEn: 'Find the only red T shape',
        };
      case 'conjunction':
        return {
          title: '结合搜索',
          titleEn: 'Conjunction Search',
          desc: '找到红色且为T形的目标',
          descEn: 'Find the red T among red Ls and blue Ts',
        };
      case 'spatial':
        return {
          title: '空间搜索',
          titleEn: 'Spatial Search',
          desc: '找到朝上的T形',
          descEn: 'Find the upright T among rotated Ts',
        };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-950 dark:to-slate-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <Link href="/games" className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回游戏列表
          </Link>
          <div className="flex items-center space-x-4">
            <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm">
              <span className="text-gray-500 text-sm block">难度</span>
              <span className="text-xl font-bold text-purple-600">{level}</span>
            </div>
            <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm">
              <span className="text-gray-500 text-sm block">连击</span>
              <span className="text-xl font-bold text-orange-500">{streak}🔥</span>
            </div>
            <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm">
              <span className="text-gray-500 text-sm block">得分</span>
              <span className="text-xl font-bold text-indigo-600">{score}</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Game Area */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-4 relative overflow-hidden">
              {/* Timer Bar */}
              {gameState === 'playing' && (
                <div className="absolute top-0 left-0 right-0 h-2 bg-gray-200 dark:bg-gray-700">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-100"
                    style={{ width: `${(timeLeft / (8000 - level * 500)) * 100}%` }}
                  />
                </div>
              )}

              {/* Idle State */}
              {gameState === 'idle' && (
                <div className="flex flex-col items-center justify-center min-h-[500px] text-center p-8">
                  <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6">
                    <Search className="w-10 h-10 text-blue-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">视觉搜索训练</h2>
                  <p className="text-gray-600 dark:text-gray-400 max-w-md mb-8">
                    在众多干扰项中快速找到目标，训练视觉注意力和搜索效率
                  </p>
                  
                  {/* Mode Selection */}
                  <div className="flex gap-3 mb-8">
                    {(['feature', 'conjunction', 'spatial'] as SearchMode[]).map((m) => (
                      <button
                        key={m}
                        onClick={() => setMode(m)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          mode === m 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                        }`}
                      >
                        {m === 'feature' ? '特征' : m === 'conjunction' ? '结合' : '空间'}
                      </button>
                    ))}
                  </div>

                  <button 
                    onClick={startGame}
                    className="px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all flex items-center text-lg shadow-lg"
                  >
                    <Play className="w-6 h-6 mr-2" />
                    开始训练
                  </button>
                </div>
              )}

              {/* Playing State */}
              {(gameState === 'playing' || gameState === 'feedback') && (
                <div className="relative min-h-[500px] pt-4">
                  {/* Mode Info */}
                  <div className="text-center mb-4">
                    <span className="text-sm text-gray-500">{getModeInfo().title}：</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{getModeInfo().desc}</span>
                  </div>

                  {/* Search Area */}
                  <div className="relative w-full h-[400px] bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden">
                    {targets.map(renderShape)}
                  </div>

                  {/* Feedback */}
                  {feedback && (
                    <div className={`absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm`}>
                      <div className={`px-8 py-4 rounded-2xl ${feedback.correct ? 'bg-green-500' : 'bg-red-500'} text-white text-center`}>
                        <div className="text-2xl font-bold mb-1">
                          {feedback.correct ? '正确!' : '错误'}
                        </div>
                        {feedback.correct && feedback.time > 0 && (
                          <div className="text-sm opacity-90">
                            反应时间: {feedback.time}ms
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Info Panel */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <Info className="w-5 h-5 mr-2 text-blue-500" />
                科学背景
              </h3>
              <div className="prose prose-sm text-gray-600 dark:text-gray-400">
                <p>
                  <strong>视觉搜索 (Visual Search)</strong> 是认知心理学中研究注意力的经典范式。
                </p>
                <p className="text-sm mt-2">
                  Anne Treisman的<strong>特征整合理论</strong>表明：
                </p>
                <ul className="list-disc pl-4 space-y-1 text-sm">
                  <li>特征搜索是自动化的（并行处理）</li>
                  <li>结合搜索需要注意力（串行处理）</li>
                  <li>训练可以提高搜索效率</li>
                </ul>
                
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <p className="text-xs text-gray-500 font-medium mb-2">关键文献:</p>
                  <p className="text-xs text-gray-500 italic">
                    Treisman, A. M., & Gelade, G. (1980). A feature-integration theory of attention.
                    <span className="block mt-1">Cognitive Psychology, 12(1), 97-136.</span>
                  </p>
                  <p className="text-xs text-gray-500 italic mt-2">
                    Wolfe, J. M. (2021). Guided Search 6.0: An updated model of visual search.
                    <span className="block mt-1">Psychonomic Bulletin & Review, 28, 1060-1092.</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Stats */}
            {totalRounds > 0 && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Trophy className="w-5 h-5 mr-2 text-amber-500" />
                  本轮统计
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">正确率</span>
                    <span className="font-bold">{((correctRounds / totalRounds) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">平均反应</span>
                    <span className="font-bold">
                      {reactionTime.length > 0 
                        ? `${Math.round(reactionTime.reduce((a,b) => a+b, 0) / reactionTime.length)}ms`
                        : '-'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">最佳连击</span>
                    <span className="font-bold text-orange-500">{bestStreak}🔥</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
