'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Grid3X3, RefreshCcw, Info, Clock, Trophy, Zap, Target } from 'lucide-react';
import { saveTrainingSession } from '@/lib/progress-tracker';

type GridSize = 3 | 4 | 5 | 6 | 7;
type GameMode = 'classic' | 'reverse' | 'redblack';

interface Cell {
  value: number | string;
  x: number;
  y: number;
  clicked: boolean;
  isRed?: boolean;
}

export default function SchulteGame() {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'finished'>('idle');
  const [gridSize, setGridSize] = useState<GridSize>(5);
  const [mode, setMode] = useState<GameMode>('classic');
  const [grid, setGrid] = useState<Cell[]>([]);
  const [currentTarget, setCurrentTarget] = useState(1);
  const [maxTarget, setMaxTarget] = useState(25);
  const [startTime, setStartTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [bestTimes, setBestTimes] = useState<Record<string, number>>({});
  const [mistakes, setMistakes] = useState(0);
  const [totalGames, setTotalGames] = useState(0);
  const [clickTimes, setClickTimes] = useState<number[]>([]);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [isRedTurn, setIsRedTurn] = useState(true); // 用于红黑模式
  const [redTarget, setRedTarget] = useState(1);
  const [blackTarget, setBlackTarget] = useState(1);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 加载最佳时间
  useEffect(() => {
    const saved = localStorage.getItem('schulte-best-times');
    if (saved) {
      setBestTimes(JSON.parse(saved));
    }
  }, []);

  // 生成网格
  const generateGrid = useCallback(() => {
    const totalCells = gridSize * gridSize;
    let numbers: (number | string)[] = [];
    
    if (mode === 'redblack') {
      // 红黑模式：红色1-12，黑色1-12（5x5格子多出一个用X填充）
      const halfCount = Math.floor(totalCells / 2);
      const redNumbers = Array.from({ length: halfCount }, (_, i) => i + 1);
      const blackNumbers = Array.from({ length: halfCount }, (_, i) => i + 1);
      
      // 随机混合
      const combined: { value: number; isRed: boolean }[] = [
        ...redNumbers.map(n => ({ value: n, isRed: true })),
        ...blackNumbers.map(n => ({ value: n, isRed: false })),
      ];
      
      // 如果是奇数格子，添加一个X
      if (totalCells % 2 === 1) {
        combined.push({ value: 0, isRed: false }); // X用0表示
      }
      
      // 打乱
      for (let i = combined.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [combined[i], combined[j]] = [combined[j], combined[i]];
      }
      
      const newGrid: Cell[] = combined.map((item, index) => ({
        value: item.value === 0 ? 'X' : item.value,
        x: index % gridSize,
        y: Math.floor(index / gridSize),
        clicked: false,
        isRed: item.value === 0 ? undefined : item.isRed,
      }));
      
      setGrid(newGrid);
      setRedTarget(1);
      setBlackTarget(1);
      setIsRedTurn(true);
      setMaxTarget(Math.floor(totalCells / 2));
    } else {
      // 经典或倒序模式
      numbers = Array.from({ length: totalCells }, (_, i) => i + 1);
      
      // Fisher-Yates 打乱
      for (let i = numbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
      }
      
      const newGrid: Cell[] = numbers.map((num, index) => ({
        value: num,
        x: index % gridSize,
        y: Math.floor(index / gridSize),
        clicked: false,
      }));
      
      setGrid(newGrid);
      setCurrentTarget(mode === 'reverse' ? totalCells : 1);
      setMaxTarget(totalCells);
    }
    
    setMistakes(0);
    setClickTimes([]);
    setLastClickTime(0);
  }, [gridSize, mode]);

  // 开始游戏
  const startGame = () => {
    generateGrid();
    setGameState('playing');
    setStartTime(Date.now());
    setElapsedTime(0);
    
    timerRef.current = setInterval(() => {
      setElapsedTime(Date.now() - Date.now() + Date.now());
    }, 100);
  };

  // 更新计时器
  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 100);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, startTime]);

  // 点击处理
  const handleCellClick = (cell: Cell) => {
    if (gameState !== 'playing' || cell.clicked) return;
    if (cell.value === 'X') return;
    
    const now = Date.now();
    let isCorrect = false;
    
    if (mode === 'redblack') {
      // 红黑模式检查
      if (isRedTurn && cell.isRed && cell.value === redTarget) {
        isCorrect = true;
        setRedTarget(r => r + 1);
        setIsRedTurn(false);
      } else if (!isRedTurn && !cell.isRed && cell.value === blackTarget) {
        isCorrect = true;
        setBlackTarget(b => b + 1);
        setIsRedTurn(true);
      }
    } else {
      // 经典或倒序模式
      if (cell.value === currentTarget) {
        isCorrect = true;
        if (mode === 'reverse') {
          setCurrentTarget(c => c - 1);
        } else {
          setCurrentTarget(c => c + 1);
        }
      }
    }
    
    if (isCorrect) {
      // 记录点击间隔
      if (lastClickTime > 0) {
        setClickTimes(times => [...times, now - lastClickTime]);
      }
      setLastClickTime(now);
      
      // 更新格子状态
      setGrid(g => g.map(c => 
        c.x === cell.x && c.y === cell.y ? { ...c, clicked: true } : c
      ));
      
      // 检查是否完成
      const isFinished = mode === 'redblack' 
        ? (redTarget >= maxTarget && blackTarget >= maxTarget)
        : (mode === 'reverse' ? currentTarget <= 1 : currentTarget >= maxTarget);
      
      if (isFinished || 
          (mode === 'redblack' && redTarget >= maxTarget && !isRedTurn) ||
          (mode !== 'redblack' && (mode === 'reverse' ? currentTarget - 1 <= 0 : currentTarget + 1 > maxTarget))) {
        finishGame();
      }
    } else {
      setMistakes(m => m + 1);
    }
  };

  // 完成游戏
  const finishGame = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setGameState('finished');
    setTotalGames(g => g + 1);
    
    const finalTime = Date.now() - startTime;
    setElapsedTime(finalTime);
    
    // 保存最佳时间
    const key = `${mode}-${gridSize}`;
    if (!bestTimes[key] || finalTime < bestTimes[key]) {
      const newBestTimes = { ...bestTimes, [key]: finalTime };
      setBestTimes(newBestTimes);
      localStorage.setItem('schulte-best-times', JSON.stringify(newBestTimes));
    }
    
    // 保存进度
    saveProgress(finalTime);
  };

  // 保存进度
  const saveProgress = (time: number) => {
    const avgClickTime = clickTimes.length > 0 
      ? clickTimes.reduce((a, b) => a + b, 0) / clickTimes.length 
      : 0;
    
    saveTrainingSession({
      gameType: 'schulte',
      timestamp: Date.now(),
      duration: time / 1000,
      score: Math.max(0, 10000 - time - mistakes * 500),
      difficulty: gridSize,
      accuracy: Math.max(0, 100 - (mistakes / maxTarget) * 100),
      rounds: 1,
      metadata: {
        mode,
        gridSize,
        mistakes,
        avgClickInterval: avgClickTime,
      }
    });
  };

  // 格式化时间
  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const decimals = Math.floor((ms % 1000) / 100);
    return `${seconds}.${decimals}s`;
  };

  // 获取难度描述
  const getDifficultyInfo = () => {
    const info: Record<GridSize, { name: string; desc: string }> = {
      3: { name: '入门', desc: '9格 - 适合初学者' },
      4: { name: '简单', desc: '16格 - 基础训练' },
      5: { name: '标准', desc: '25格 - 经典舒尔特表' },
      6: { name: '困难', desc: '36格 - 挑战注意力' },
      7: { name: '专家', desc: '49格 - 极限挑战' },
    };
    return info[gridSize];
  };

  // 获取评级
  const getRating = () => {
    const timePerCell = elapsedTime / maxTarget;
    if (gridSize === 5) {
      if (timePerCell < 400) return { grade: 'S', color: 'text-purple-500', desc: '超凡' };
      if (timePerCell < 600) return { grade: 'A', color: 'text-green-500', desc: '优秀' };
      if (timePerCell < 800) return { grade: 'B', color: 'text-blue-500', desc: '良好' };
      if (timePerCell < 1000) return { grade: 'C', color: 'text-yellow-500', desc: '一般' };
      return { grade: 'D', color: 'text-gray-500', desc: '继续加油' };
    }
    // 其他尺寸的评级标准调整
    const baseTime = gridSize * 100;
    if (timePerCell < baseTime * 0.8) return { grade: 'S', color: 'text-purple-500', desc: '超凡' };
    if (timePerCell < baseTime) return { grade: 'A', color: 'text-green-500', desc: '优秀' };
    if (timePerCell < baseTime * 1.2) return { grade: 'B', color: 'text-blue-500', desc: '良好' };
    if (timePerCell < baseTime * 1.5) return { grade: 'C', color: 'text-yellow-500', desc: '一般' };
    return { grade: 'D', color: 'text-gray-500', desc: '继续加油' };
  };

  // 获取当前提示
  const getCurrentHint = () => {
    if (mode === 'redblack') {
      return isRedTurn 
        ? `找红色 ${redTarget}` 
        : `找黑色 ${blackTarget}`;
    }
    return mode === 'reverse' 
      ? `找 ${currentTarget} ↓` 
      : `找 ${currentTarget} ↑`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-950 dark:to-amber-950/20 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <Link href="/games" className="inline-flex items-center text-gray-600 hover:text-orange-600 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回游戏列表
          </Link>
          <div className="flex items-center space-x-4">
            <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm">
              <span className="text-gray-500 text-sm block">时间</span>
              <span className="text-xl font-bold text-orange-600 font-mono">{formatTime(elapsedTime)}</span>
            </div>
            <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm">
              <span className="text-gray-500 text-sm block">错误</span>
              <span className="text-xl font-bold text-red-500">{mistakes}</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Game Area */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
              
              {/* Idle State */}
              {gameState === 'idle' && (
                <div className="flex flex-col items-center justify-center min-h-[500px] text-center">
                  <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mb-6">
                    <Grid3X3 className="w-10 h-10 text-orange-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">舒尔特表格训练</h2>
                  <p className="text-gray-600 dark:text-gray-400 max-w-md mb-8">
                    按顺序快速点击数字，训练注意力广度和视觉搜索能力
                  </p>
                  
                  {/* Grid Size Selection */}
                  <div className="mb-6">
                    <p className="text-sm text-gray-500 mb-2">选择格子大小</p>
                    <div className="flex gap-2">
                      {([3, 4, 5, 6, 7] as GridSize[]).map((size) => (
                        <button
                          key={size}
                          onClick={() => setGridSize(size)}
                          className={`w-12 h-12 rounded-lg font-bold transition-all ${
                            gridSize === size 
                              ? 'bg-orange-600 text-white shadow-lg' 
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                          }`}
                        >
                          {size}×{size}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-2">{getDifficultyInfo().desc}</p>
                  </div>

                  {/* Mode Selection */}
                  <div className="mb-8">
                    <p className="text-sm text-gray-500 mb-2">选择模式</p>
                    <div className="flex gap-3">
                      {([
                        { key: 'classic', label: '顺序', icon: '1→25' },
                        { key: 'reverse', label: '倒序', icon: '25→1' },
                        { key: 'redblack', label: '红黑', icon: '🔴⚫' },
                      ] as { key: GameMode; label: string; icon: string }[]).map((m) => (
                        <button
                          key={m.key}
                          onClick={() => setMode(m.key)}
                          className={`px-4 py-2 rounded-lg font-medium transition-all ${
                            mode === m.key 
                              ? 'bg-orange-600 text-white' 
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                          }`}
                        >
                          <span className="block text-lg">{m.icon}</span>
                          <span className="text-xs">{m.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <button 
                    onClick={startGame}
                    className="px-10 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-bold hover:from-orange-600 hover:to-amber-600 transition-all flex items-center text-lg shadow-lg"
                  >
                    <Play className="w-6 h-6 mr-2" />
                    开始训练
                  </button>
                </div>
              )}

              {/* Playing State */}
              {gameState === 'playing' && (
                <div className="flex flex-col items-center">
                  {/* Current Target */}
                  <div className={`mb-4 px-6 py-2 rounded-full font-bold text-lg ${
                    mode === 'redblack' 
                      ? (isRedTurn ? 'bg-red-100 text-red-600' : 'bg-gray-800 text-white')
                      : 'bg-orange-100 text-orange-600'
                  }`}>
                    {getCurrentHint()}
                  </div>

                  {/* Grid */}
                  <div 
                    className="grid gap-2"
                    style={{ 
                      gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
                      width: `min(100%, ${gridSize * 70}px)`,
                    }}
                  >
                    {grid.map((cell, index) => (
                      <button
                        key={index}
                        onClick={() => handleCellClick(cell)}
                        disabled={cell.clicked || cell.value === 'X'}
                        className={`
                          aspect-square rounded-lg font-bold text-xl md:text-2xl transition-all
                          ${cell.clicked 
                            ? 'bg-green-500 text-white scale-95 opacity-50' 
                            : cell.value === 'X'
                              ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                              : mode === 'redblack' && cell.isRed !== undefined
                                ? cell.isRed
                                  ? 'bg-red-500 text-white hover:bg-red-600 active:scale-95'
                                  : 'bg-gray-800 text-white hover:bg-gray-700 active:scale-95'
                                : 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 hover:bg-orange-200 dark:hover:bg-orange-900/50 active:scale-95'
                          }
                        `}
                      >
                        {cell.value}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Finished State */}
              {gameState === 'finished' && (
                <div className="flex flex-col items-center justify-center min-h-[500px] text-center">
                  <div className={`text-8xl font-bold mb-4 ${getRating().color}`}>
                    {getRating().grade}
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {getRating().desc}
                  </p>
                  <p className="text-4xl font-mono font-bold text-orange-600 mb-6">
                    {formatTime(elapsedTime)}
                  </p>
                  
                  <div className="grid grid-cols-3 gap-6 mb-8 text-center">
                    <div>
                      <p className="text-gray-500 text-sm">平均速度</p>
                      <p className="text-xl font-bold">
                        {(elapsedTime / maxTarget).toFixed(0)}ms/格
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">错误次数</p>
                      <p className="text-xl font-bold text-red-500">{mistakes}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">最佳记录</p>
                      <p className="text-xl font-bold text-green-500">
                        {bestTimes[`${mode}-${gridSize}`] 
                          ? formatTime(bestTimes[`${mode}-${gridSize}`]) 
                          : formatTime(elapsedTime)}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button 
                      onClick={startGame}
                      className="px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-bold hover:from-orange-600 hover:to-amber-600 transition-all flex items-center"
                    >
                      <RefreshCcw className="w-5 h-5 mr-2" />
                      再来一局
                    </button>
                    <button 
                      onClick={() => setGameState('idle')}
                      className="px-8 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-200 transition-all"
                    >
                      更换模式
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Info Panel */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <Info className="w-5 h-5 mr-2 text-orange-500" />
                科学背景
              </h3>
              <div className="prose prose-sm text-gray-600 dark:text-gray-400">
                <p>
                  <strong>舒尔特表格 (Schulte Table)</strong> 是由德国心理学家Walter Schulte发明的注意力训练工具。
                </p>
                <p className="text-sm mt-2">
                  <strong>训练效果：</strong>
                </p>
                <ul className="list-disc pl-4 space-y-1 text-sm">
                  <li>扩大视觉注意广度</li>
                  <li>提高视觉搜索效率</li>
                  <li>增强专注力和抗干扰能力</li>
                  <li>改善阅读速度</li>
                </ul>
                
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <p className="text-xs text-gray-500 font-medium mb-2">参考标准 (5×5表):</p>
                  <ul className="text-xs text-gray-500 space-y-1">
                    <li>• 优秀: &lt;25秒 (每格&lt;1秒)</li>
                    <li>• 良好: 25-30秒</li>
                    <li>• 一般: 30-50秒</li>
                    <li>• 需加强: &gt;50秒</li>
                  </ul>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <p className="text-xs text-gray-500 font-medium mb-2">关键文献:</p>
                  <p className="text-xs text-gray-500 italic">
                    Thorpe, S. J., Gegenfurtner, K. R., et al. (2001). Detection of animals in natural images using far peripheral vision.
                    <span className="block mt-1">European Journal of Neuroscience.</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Best Times */}
            {Object.keys(bestTimes).length > 0 && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Trophy className="w-5 h-5 mr-2 text-amber-500" />
                  最佳记录
                </h3>
                <div className="space-y-2 text-sm">
                  {Object.entries(bestTimes).map(([key, time]) => {
                    const [m, size] = key.split('-');
                    return (
                      <div key={key} className="flex justify-between">
                        <span className="text-gray-500">
                          {m === 'classic' ? '顺序' : m === 'reverse' ? '倒序' : '红黑'} {size}×{size}
                        </span>
                        <span className="font-bold font-mono">{formatTime(time)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
