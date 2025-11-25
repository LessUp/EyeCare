'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, TrendingUp, Calendar, Award, Download, Upload, Trash2, Brain, Target, Zap } from 'lucide-react';
import { 
  getOverallStats, 
  getGameStats, 
  getTrainingStreak, 
  getPerformanceData,
  exportTrainingData,
  importTrainingData,
  clearTrainingData,
  type GameStats
} from '@/lib/progress-tracker';
import LineChart from '@/components/LineChart';

const GAME_NAMES: Record<string, { zh: string; en: string }> = {
  gabor: { zh: 'Gabor斑训练', en: 'Gabor Patch' },
  mot: { zh: '多目标追踪', en: 'Multiple Object Tracking' },
  contrast: { zh: '对比敏感度', en: 'Contrast Sensitivity' },
  vernier: { zh: '游标视力', en: 'Vernier Acuity' },
  crowding: { zh: '拥挤效应', en: 'Crowding Reduction' },
  'visual-search': { zh: '视觉搜索', en: 'Visual Search' },
  schulte: { zh: '舒尔特表格', en: 'Schulte Table' },
  'change-detection': { zh: '变化盲视', en: 'Change Detection' },
};

const GAME_ICONS: Record<string, React.ReactNode> = {
  gabor: <Brain className="w-5 h-5" />,
  mot: <Target className="w-5 h-5" />,
  contrast: <Zap className="w-5 h-5" />,
  vernier: <Zap className="w-5 h-5" />,
  crowding: <Zap className="w-5 h-5" />,
  'visual-search': <Target className="w-5 h-5" />,
  schulte: <Brain className="w-5 h-5" />,
  'change-detection': <Zap className="w-5 h-5" />,
};

export default function ProgressPage() {
  const [overallStats, setOverallStats] = useState<any>(null);
  const [gameStats, setGameStats] = useState<Record<string, GameStats | null>>({});
  const [streak, setStreak] = useState<any>(null);
  const [selectedGame, setSelectedGame] = useState<string>('gabor');
  const [performanceData, setPerformanceData] = useState<any>(null);
  
  useEffect(() => {
    loadData();
  }, []);
  
  useEffect(() => {
    if (selectedGame) {
      const data = getPerformanceData(selectedGame, 30);
      setPerformanceData(data);
    }
  }, [selectedGame]);
  
  const loadData = () => {
    setOverallStats(getOverallStats());
    setStreak(getTrainingStreak());
    
    const stats: Record<string, GameStats | null> = {};
    Object.keys(GAME_NAMES).forEach(gameType => {
      stats[gameType] = getGameStats(gameType);
    });
    setGameStats(stats);
  };
  
  const handleExport = () => {
    const data = exportTrainingData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `eyecare-training-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target?.result as string;
      if (importTrainingData(data)) {
        loadData();
        alert('训练数据导入成功！');
      } else {
        alert('导入失败，请检查文件格式。');
      }
    };
    reader.readAsText(file);
  };
  
  const handleClear = () => {
    if (confirm('确定要清除所有训练历史吗？此操作不可撤销。')) {
      clearTrainingData();
      loadData();
    }
  };
  
  if (!overallStats) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">加载训练数据中...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <Link href="/games" className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回游戏
          </Link>
          
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm"
            >
              <Download className="w-4 h-4" />
              导出数据
            </button>
            <label className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm cursor-pointer">
              <Upload className="w-4 h-4" />
              导入数据
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>
            <button
              onClick={handleClear}
              className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2 text-sm"
            >
              <Trash2 className="w-4 h-4" />
              清除
            </button>
          </div>
        </div>
        
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">训练进度</h1>
          <p className="text-gray-600">查看您的视力训练历史和进步曲线</p>
        </header>
        
        {/* Overall Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-sm">总训练次数</span>
              <TrendingUp className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{overallStats.totalSessions}</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-sm">累计训练时长</span>
              <Calendar className="w-5 h-5 text-purple-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{overallStats.totalHours.toFixed(1)}</div>
            <div className="text-xs text-gray-500 mt-1">小时</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-sm">平均准确率</span>
              <Award className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{overallStats.averageAccuracy.toFixed(0)}%</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-sm">连续训练天数</span>
              <div className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-600 text-xs">🔥</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900">{streak?.current || 0}</div>
            <div className="text-xs text-gray-500 mt-1">最长: {streak?.longest || 0} 天</div>
          </div>
        </div>
        
        {/* Weekly Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">过去7天活动</h3>
          <div className="flex justify-between items-end h-32">
            {overallStats.weeklyActivity.map((count: number, i: number) => {
              const dayNames = ['日', '一', '二', '三', '四', '五', '六'];
              const today = new Date().getDay();
              const dayIndex = (today - 6 + i + 7) % 7;
              const maxCount = Math.max(...overallStats.weeklyActivity, 1);
              const height = (count / maxCount) * 100;
              
              return (
                <div key={i} className="flex flex-col items-center flex-1">
                  <div 
                    className="w-full max-w-[60px] bg-blue-500 rounded-t transition-all hover:bg-blue-600"
                    style={{ height: `${height}%`, minHeight: count > 0 ? '10px' : '2px' }}
                  />
                  <div className="text-xs text-gray-500 mt-2">{dayNames[dayIndex]}</div>
                  <div className="text-xs font-semibold text-gray-700">{count}</div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Game Statistics */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">各游戏统计</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Object.entries(GAME_NAMES).map(([gameType, gameName]) => {
              const stats = gameStats[gameType];
              if (!stats) {
                return (
                  <div key={gameType} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center gap-2 mb-3">
                      {GAME_ICONS[gameType]}
                      <span className="font-semibold text-gray-900">{gameName.zh}</span>
                    </div>
                    <p className="text-sm text-gray-500">暂无训练记录</p>
                  </div>
                );
              }
              
              return (
                <div key={gameType} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                  <div className="flex items-center gap-2 mb-3">
                    {GAME_ICONS[gameType]}
                    <span className="font-semibold text-gray-900">{gameName.zh}</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">训练次数</span>
                      <span className="font-semibold">{stats.totalSessions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">平均准确率</span>
                      <span className="font-semibold">{stats.averageAccuracy.toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">进步幅度</span>
                      <span className={`font-semibold ${stats.improvement >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {stats.improvement >= 0 ? '+' : ''}{stats.improvement.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Performance Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">性能曲线</h3>
            <select 
              value={selectedGame}
              onChange={(e) => setSelectedGame(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Object.entries(GAME_NAMES).map(([gameType, gameName]) => (
                <option key={gameType} value={gameType}>{gameName.zh}</option>
              ))}
            </select>
          </div>
          
          {performanceData && performanceData.accuracy.length > 0 ? (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">准确率趋势</h4>
                <LineChart 
                  data={performanceData.accuracy} 
                  labels={performanceData.labels}
                  color="#10B981"
                  height={200}
                  yAxisLabel="准确率 (%)"
                />
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">得分趋势</h4>
                <LineChart 
                  data={performanceData.scores} 
                  labels={performanceData.labels}
                  color="#3B82F6"
                  height={200}
                  yAxisLabel="得分"
                />
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">难度进展</h4>
                <LineChart 
                  data={performanceData.difficulty} 
                  labels={performanceData.labels}
                  color="#8B5CF6"
                  height={200}
                  yAxisLabel="难度等级"
                />
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              该游戏暂无训练数据
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
