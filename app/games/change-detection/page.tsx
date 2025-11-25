'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Eye, RefreshCcw, Info, Clock, Trophy, Zap, HelpCircle } from 'lucide-react';
import { saveTrainingSession } from '@/lib/progress-tracker';

interface Shape {
  id: number;
  type: 'circle' | 'square' | 'triangle' | 'star' | 'hexagon';
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
}

type ChangeType = 'color' | 'position' | 'size' | 'shape' | 'disappear';
type Difficulty = 'easy' | 'medium' | 'hard';

const COLORS = ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4'];
const SHAPES: Shape['type'][] = ['circle', 'square', 'triangle', 'star', 'hexagon'];

export default function ChangeDetectionGame() {
  const [gameState, setGameState] = useState<'idle' | 'showing' | 'blank' | 'changed' | 'feedback'>('idle');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [changedShapes, setChangedShapes] = useState<Shape[]>([]);
  const [changedShapeId, setChangedShapeId] = useState<number | null>(null);
  const [changeType, setChangeType] = useState<ChangeType>('color');
  const [roundStartTime, setRoundStartTime] = useState(0);
  const [totalRounds, setTotalRounds] = useState(0);
  const [correctRounds, setCorrectRounds] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState(0);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [cycleCount, setCycleCount] = useState(0);
  const [feedback, setFeedback] = useState<{ correct: boolean; id: number | null } | null>(null);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const cycleRef = useRef<NodeJS.Timeout | null>(null);

  // 生成形状
  const generateShapes = useCallback(() => {
    const count = difficulty === 'easy' ? 4 + level : difficulty === 'medium' ? 6 + level : 8 + level * 2;
    const actualCount = Math.min(count, 20);
    const newShapes: Shape[] = [];
    
    for (let i = 0; i < actualCount; i++) {
      let x, y;
      let attempts = 0;
      do {
        x = 50 + Math.random() * 500;
        y = 50 + Math.random() * 300;
        attempts++;
      } while (
        attempts < 50 &&
        newShapes.some(s => Math.hypot(s.x - x, s.y - y) < 60)
      );
      
      newShapes.push({
        id: i,
        type: SHAPES[Math.floor(Math.random() * SHAPES.length)],
        x,
        y,
        size: 30 + Math.random() * 20,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        rotation: Math.floor(Math.random() * 360),
      });
    }
    
    return newShapes;
  }, [difficulty, level]);

  // 应用变化
  const applyChange = useCallback((originalShapes: Shape[]): { shapes: Shape[], changedId: number, type: ChangeType } => {
    const changeTypes: ChangeType[] = ['color', 'position', 'size', 'shape'];
    if (difficulty !== 'easy') changeTypes.push('disappear');
    
    const type = changeTypes[Math.floor(Math.random() * changeTypes.length)];
    const targetIndex = Math.floor(Math.random() * originalShapes.length);
    const target = originalShapes[targetIndex];
    
    let newShapes = [...originalShapes];
    
    switch (type) {
      case 'color':
        const newColor = COLORS.filter(c => c !== target.color)[Math.floor(Math.random() * (COLORS.length - 1))];
        newShapes[targetIndex] = { ...target, color: newColor };
        break;
      case 'position':
        const moveDistance = difficulty === 'easy' ? 40 : difficulty === 'medium' ? 25 : 15;
        const angle = Math.random() * Math.PI * 2;
        newShapes[targetIndex] = {
          ...target,
          x: Math.max(50, Math.min(550, target.x + Math.cos(angle) * moveDistance)),
          y: Math.max(50, Math.min(350, target.y + Math.sin(angle) * moveDistance)),
        };
        break;
      case 'size':
        const sizeChange = difficulty === 'easy' ? 0.4 : difficulty === 'medium' ? 0.3 : 0.2;
        newShapes[targetIndex] = {
          ...target,
          size: target.size * (Math.random() > 0.5 ? 1 + sizeChange : 1 - sizeChange),
        };
        break;
      case 'shape':
        const newType = SHAPES.filter(s => s !== target.type)[Math.floor(Math.random() * (SHAPES.length - 1))];
        newShapes[targetIndex] = { ...target, type: newType };
        break;
      case 'disappear':
        newShapes = newShapes.filter((_, i) => i !== targetIndex);
        break;
    }
    
    return { shapes: newShapes, changedId: target.id, type };
  }, [difficulty]);

  // 开始新回合
  const startRound = useCallback(() => {
    const original = generateShapes();
    const { shapes: changed, changedId, type } = applyChange(original);
    
    setShapes(original);
    setChangedShapes(changed);
    setChangedShapeId(changedId);
    setChangeType(type);
    setFeedback(null);
    setShowHint(false);
    setCycleCount(0);
    
    // 开始闪烁循环
    setGameState('showing');
    startFlickerCycle(original, changed);
    setRoundStartTime(Date.now());
  }, [generateShapes, applyChange]);

  // 闪烁循环
  const startFlickerCycle = (original: Shape[], changed: Shape[]) => {
    let isOriginal = true;
    let cycles = 0;
    
    const showDuration = difficulty === 'easy' ? 1000 : difficulty === 'medium' ? 800 : 600;
    const blankDuration = difficulty === 'easy' ? 200 : difficulty === 'medium' ? 150 : 100;
    
    const cycle = () => {
      if (cycles >= 20) {
        // 超过20次循环，本轮失败
        handleTimeout();
        return;
      }
      
      if (isOriginal) {
        setShapes(original);
        setGameState('showing');
        cycleRef.current = setTimeout(() => {
          setGameState('blank');
          setTimeout(() => {
            isOriginal = false;
            cycle();
          }, blankDuration);
        }, showDuration);
      } else {
        setShapes(changed);
        setGameState('changed');
        setCycleCount(c => c + 1);
        cycleRef.current = setTimeout(() => {
          setGameState('blank');
          setTimeout(() => {
            isOriginal = true;
            cycles++;
            cycle();
          }, blankDuration);
        }, showDuration);
      }
    };
    
    cycle();
  };

  // 超时处理
  const handleTimeout = () => {
    if (cycleRef.current) clearTimeout(cycleRef.current);
    setStreak(0);
    setTotalRounds(r => r + 1);
    setFeedback({ correct: false, id: changedShapeId });
    setGameState('feedback');
    
    setTimeout(() => {
      if (level > 1) setLevel(l => l - 1);
      startRound();
    }, 2000);
  };

  // 点击处理
  const handleShapeClick = (shape: Shape) => {
    if (gameState !== 'showing' && gameState !== 'changed') return;
    if (cycleRef.current) clearTimeout(cycleRef.current);
    
    const rt = Date.now() - roundStartTime;
    const newTotalRounds = totalRounds + 1;
    setTotalRounds(newTotalRounds);
    
    if (shape.id === changedShapeId) {
      // 正确
      const baseScore = 100;
      const timeBonus = Math.max(0, 50 - Math.floor(rt / 200));
      const levelBonus = level * 20;
      const streakBonus = streak * 10;
      
      setScore(s => s + baseScore + timeBonus + levelBonus + streakBonus);
      setStreak(s => s + 1);
      setCorrectRounds(c => c + 1);
      setReactionTimes(rt => [...rt, Date.now() - roundStartTime]);
      setFeedback({ correct: true, id: shape.id });
      setGameState('feedback');
      
      // 每5轮保存进度
      if (newTotalRounds % 5 === 0) {
        saveProgress(newTotalRounds);
      }
      
      setTimeout(() => {
        setLevel(l => Math.min(l + 1, 15));
        startRound();
      }, 1500);
    } else {
      // 错误
      setStreak(0);
      setFeedback({ correct: false, id: changedShapeId });
      setGameState('feedback');
      
      setTimeout(() => {
        if (level > 1) setLevel(l => l - 1);
        startRound();
      }, 2000);
    }
  };

  // 保存进度
  const saveProgress = (rounds: number) => {
    const duration = (Date.now() - sessionStartTime) / 1000;
    const accuracy = rounds > 0 ? (correctRounds / rounds) * 100 : 0;
    const avgRT = reactionTimes.length > 0 
      ? reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length 
      : 0;
    
    saveTrainingSession({
      gameType: 'change-detection',
      timestamp: Date.now(),
      duration,
      score,
      difficulty: level,
      accuracy,
      rounds,
      metadata: {
        difficultyMode: difficulty,
        avgReactionTime: avgRT,
      }
    });
  };

  // 开始游戏
  const startGame = () => {
    setScore(0);
    setLevel(1);
    setStreak(0);
    setTotalRounds(0);
    setCorrectRounds(0);
    setReactionTimes([]);
    setSessionStartTime(Date.now());
    startRound();
  };

  // 清理
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (cycleRef.current) clearTimeout(cycleRef.current);
    };
  }, []);

  // 渲染形状
  const renderShape = (shape: Shape, isHighlighted: boolean = false) => {
    const style: React.CSSProperties = {
      position: 'absolute',
      left: shape.x - shape.size / 2,
      top: shape.y - shape.size / 2,
      width: shape.size,
      height: shape.size,
      transform: `rotate(${shape.rotation}deg)`,
      cursor: gameState === 'showing' || gameState === 'changed' ? 'pointer' : 'default',
      transition: 'transform 0.1s',
    };
    
    const highlightStyle = isHighlighted ? {
      boxShadow: feedback?.correct ? '0 0 20px 5px #10B981' : '0 0 20px 5px #EF4444',
      zIndex: 10,
    } : {};

    const renderSvg = () => {
      switch (shape.type) {
        case 'circle':
          return (
            <svg width="100%" height="100%" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="18" fill={shape.color} />
            </svg>
          );
        case 'square':
          return (
            <svg width="100%" height="100%" viewBox="0 0 40 40">
              <rect x="2" y="2" width="36" height="36" fill={shape.color} rx="2" />
            </svg>
          );
        case 'triangle':
          return (
            <svg width="100%" height="100%" viewBox="0 0 40 40">
              <polygon points="20,2 38,38 2,38" fill={shape.color} />
            </svg>
          );
        case 'star':
          return (
            <svg width="100%" height="100%" viewBox="0 0 40 40">
              <polygon 
                points="20,2 24,15 38,15 27,24 31,38 20,29 9,38 13,24 2,15 16,15" 
                fill={shape.color} 
              />
            </svg>
          );
        case 'hexagon':
          return (
            <svg width="100%" height="100%" viewBox="0 0 40 40">
              <polygon 
                points="20,2 36,10 36,30 20,38 4,30 4,10" 
                fill={shape.color} 
              />
            </svg>
          );
      }
    };

    return (
      <div
        key={shape.id}
        style={{ ...style, ...highlightStyle }}
        onClick={() => handleShapeClick(shape)}
        className="hover:scale-110 transition-transform"
      >
        {renderSvg()}
      </div>
    );
  };

  const getChangeTypeText = () => {
    const texts: Record<ChangeType, string> = {
      color: '颜色变化',
      position: '位置移动',
      size: '大小变化',
      shape: '形状变化',
      disappear: '消失',
    };
    return texts[changeType];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-950 dark:to-purple-950/20 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <Link href="/games" className="inline-flex items-center text-gray-600 hover:text-purple-600 transition-colors">
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
              
              {/* Idle State */}
              {gameState === 'idle' && (
                <div className="flex flex-col items-center justify-center min-h-[500px] text-center p-8">
                  <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-6">
                    <Eye className="w-10 h-10 text-purple-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">变化盲视训练</h2>
                  <p className="text-gray-600 dark:text-gray-400 max-w-md mb-8">
                    两幅图像交替闪烁，找出其中发生变化的物体，训练变化检测能力
                  </p>
                  
                  {/* Difficulty Selection */}
                  <div className="mb-8">
                    <p className="text-sm text-gray-500 mb-2">选择难度</p>
                    <div className="flex gap-3">
                      {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
                        <button
                          key={d}
                          onClick={() => setDifficulty(d)}
                          className={`px-6 py-3 rounded-lg font-medium transition-all ${
                            difficulty === d 
                              ? 'bg-purple-600 text-white' 
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                          }`}
                        >
                          {d === 'easy' ? '简单' : d === 'medium' ? '中等' : '困难'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button 
                    onClick={startGame}
                    className="px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all flex items-center text-lg shadow-lg"
                  >
                    <Play className="w-6 h-6 mr-2" />
                    开始训练
                  </button>
                </div>
              )}

              {/* Playing States */}
              {(gameState === 'showing' || gameState === 'changed' || gameState === 'blank' || gameState === 'feedback') && (
                <div className="relative min-h-[500px]">
                  {/* Status Bar */}
                  <div className="flex justify-between items-center mb-4 px-4">
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        gameState === 'showing' ? 'bg-blue-100 text-blue-600' :
                        gameState === 'changed' ? 'bg-purple-100 text-purple-600' :
                        gameState === 'blank' ? 'bg-gray-100 text-gray-600' :
                        'bg-green-100 text-green-600'
                      }`}>
                        {gameState === 'showing' ? '图像A' :
                         gameState === 'changed' ? '图像B' :
                         gameState === 'blank' ? '...' :
                         '结果'}
                      </span>
                      <span className="text-sm text-gray-500">循环 {cycleCount}</span>
                    </div>
                    <button
                      onClick={() => setShowHint(!showHint)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <HelpCircle className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Hint */}
                  {showHint && gameState !== 'feedback' && (
                    <div className="absolute top-16 right-4 bg-yellow-100 dark:bg-yellow-900/30 px-4 py-2 rounded-lg text-sm text-yellow-800 dark:text-yellow-200 z-20">
                      提示: 寻找{getChangeTypeText()}
                    </div>
                  )}

                  {/* Shape Display Area */}
                  <div className={`relative w-full h-[400px] rounded-xl overflow-hidden transition-all ${
                    gameState === 'blank' ? 'bg-gray-300 dark:bg-gray-700' : 'bg-gray-50 dark:bg-gray-800'
                  }`}>
                    {gameState !== 'blank' && shapes.map(shape => 
                      renderShape(shape, feedback !== null && shape.id === feedback.id)
                    )}
                  </div>

                  {/* Feedback Overlay */}
                  {feedback && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm pointer-events-none">
                      <div className={`px-8 py-4 rounded-2xl ${feedback.correct ? 'bg-green-500' : 'bg-red-500'} text-white text-center`}>
                        <div className="text-2xl font-bold mb-1">
                          {feedback.correct ? '正确!' : '错误'}
                        </div>
                        <div className="text-sm opacity-90">
                          变化类型: {getChangeTypeText()}
                        </div>
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
                <Info className="w-5 h-5 mr-2 text-purple-500" />
                科学背景
              </h3>
              <div className="prose prose-sm text-gray-600 dark:text-gray-400">
                <p>
                  <strong>变化盲视 (Change Blindness)</strong> 是视觉认知中的一个重要现象：人们常常无法注意到视野中发生的明显变化。
                </p>
                <p className="text-sm mt-2">
                  <strong>训练价值：</strong>
                </p>
                <ul className="list-disc pl-4 space-y-1 text-sm">
                  <li>提高视觉工作记忆</li>
                  <li>增强场景感知能力</li>
                  <li>改善变化检测敏感度</li>
                  <li>应用于驾驶安全、医学影像等</li>
                </ul>
                
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <p className="text-xs text-gray-500 font-medium mb-2">关键文献:</p>
                  <p className="text-xs text-gray-500 italic">
                    Rensink, R. A., O'Regan, J. K., & Clark, J. J. (1997). To see or not to see: The need for attention to perceive changes in scenes.
                    <span className="block mt-1">Psychological Science, 8(5), 368-373.</span>
                  </p>
                  <p className="text-xs text-gray-500 italic mt-2">
                    Simons, D. J., & Levin, D. T. (1998). Failure to detect changes to people during a real-world interaction.
                    <span className="block mt-1">Psychonomic Bulletin & Review.</span>
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
                      {reactionTimes.length > 0 
                        ? `${Math.round(reactionTimes.reduce((a,b) => a+b, 0) / reactionTimes.length)}ms`
                        : '-'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">完成轮次</span>
                    <span className="font-bold">{totalRounds}</span>
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
