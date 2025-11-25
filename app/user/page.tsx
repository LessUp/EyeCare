"use client"

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/auth-provider';
import { useLanguage } from '@/components/providers/language-provider';
import { Button } from '@/components/ui/button';
import { getTestResults, getTestStatistics, TestResult } from '@/lib/user-store';
import { getOverallStats, getTrainingStreak, getPerformanceData } from '@/lib/progress-tracker';
import { analyzeLocally } from '@/lib/ai-analysis';
import { generateShareCard, downloadShareCard, getScoreRank, cardThemes, generateShareText, getShareLinks } from '@/lib/share-card';
import { 
  User, Settings, Crown, Calendar, TrendingUp, Award, 
  Share2, Download, ChevronRight, Eye, Brain, Target,
  Clock, BarChart3, Sparkles, LogOut, History
} from 'lucide-react';
import Link from 'next/link';

export default function UserCenter() {
  const { user, isAuthenticated, membershipStatus, logout } = useAuth();
  const { lang } = useLanguage();
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'analysis' | 'share'>('overview');
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [stats, setStats] = useState<ReturnType<typeof getOverallStats> | null>(null);
  const [streak, setStreak] = useState({ current: 0, longest: 0, lastTrainingDate: '' });
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    setTestResults(getTestResults());
    setStats(getOverallStats());
    setStreak(getTrainingStreak());
  }, []);

  const runAIAnalysis = async () => {
    setIsAnalyzing(true);
    const results = getTestResults();
    if (results.length > 0) {
      const analysis = analyzeLocally({
        testType: results[results.length - 1].testType,
        testResults: results.slice(-10).map(r => ({
          score: r.score,
          accuracy: r.details?.accuracy,
          details: r.details,
        })),
        userProfile: user?.profile,
        historicalTrend: stats?.recentTrend ? {
          direction: stats.recentTrend as any,
          changePercent: 5,
        } : undefined,
      });
      setAiAnalysis(analysis);
    }
    setIsAnalyzing(false);
  };

  if (!isAuthenticated) {
    return <LoginRegisterForm />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user?.name}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    membershipStatus.tier === 'free' ? 'bg-gray-100 text-gray-600' :
                    membershipStatus.tier === 'basic' ? 'bg-blue-100 text-blue-600' :
                    membershipStatus.tier === 'premium' ? 'bg-purple-100 text-purple-600' :
                    'bg-gradient-to-r from-amber-400 to-orange-500 text-white'
                  }`}>
                    <Crown className="w-3 h-3 inline mr-1" />
                    {membershipStatus.tier === 'free' ? '免费用户' : 
                     membershipStatus.tier === 'basic' ? '基础会员' :
                     membershipStatus.tier === 'premium' ? '高级会员' : '专业版'}
                  </span>
                  {membershipStatus.daysRemaining > 0 && membershipStatus.tier !== 'free' && (
                    <span className="text-sm text-gray-500">
                      {lang === 'zh' ? `剩余 ${membershipStatus.daysRemaining} 天` : `${membershipStatus.daysRemaining} days left`}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/membership">
                <Button variant="outline" className="rounded-full">
                  <Crown className="w-4 h-4 mr-2" />
                  {lang === 'zh' ? '升级会员' : 'Upgrade'}
                </Button>
              </Link>
              <Button variant="ghost" size="icon" onClick={logout} title={lang === 'zh' ? '退出登录' : 'Logout'}>
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { icon: Calendar, label: lang === 'zh' ? '训练天数' : 'Training Days', value: stats?.totalSessions || 0, color: 'blue' },
            { icon: Clock, label: lang === 'zh' ? '总时长' : 'Total Hours', value: `${(stats?.totalHours || 0).toFixed(1)}h`, color: 'green' },
            { icon: Target, label: lang === 'zh' ? '平均准确率' : 'Avg Accuracy', value: `${(stats?.averageAccuracy || 0).toFixed(0)}%`, color: 'purple' },
            { icon: Award, label: lang === 'zh' ? '连续打卡' : 'Streak', value: `${streak.current}${lang === 'zh' ? '天' : 'd'}`, color: 'orange' },
          ].map((stat, i) => (
            <div key={i} className={`bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-lg border-l-4 border-${stat.color}-500`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl bg-${stat.color}-100 dark:bg-${stat.color}-900/30`}>
                  <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'overview', icon: BarChart3, label: lang === 'zh' ? '概览' : 'Overview' },
            { id: 'history', icon: History, label: lang === 'zh' ? '历史记录' : 'History' },
            { id: 'analysis', icon: Sparkles, label: lang === 'zh' ? 'AI分析' : 'AI Analysis' },
            { id: 'share', icon: Share2, label: lang === 'zh' ? '分享' : 'Share' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-6">
          {activeTab === 'overview' && <OverviewTab stats={stats} streak={streak} lang={lang} />}
          {activeTab === 'history' && <HistoryTab results={testResults} lang={lang} />}
          {activeTab === 'analysis' && (
            <AnalysisTab 
              analysis={aiAnalysis} 
              onAnalyze={runAIAnalysis} 
              isAnalyzing={isAnalyzing}
              isPremium={membershipStatus.tier !== 'free'}
              lang={lang}
            />
          )}
          {activeTab === 'share' && <ShareTab results={testResults} streak={streak} lang={lang} />}
        </div>
      </div>
    </div>
  );
}

// 登录/注册表单组件
function LoginRegisterForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const { login, register } = useAuth();
  const { lang } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (isLogin) {
      const success = await login(email, password);
      if (!success) {
        setError(lang === 'zh' ? '邮箱或密码错误' : 'Invalid email or password');
      }
    } else {
      if (!name.trim()) {
        setError(lang === 'zh' ? '请输入姓名' : 'Please enter your name');
        return;
      }
      const success = await register(email, name, password);
      if (!success) {
        setError(lang === 'zh' ? '注册失败，请重试' : 'Registration failed, please try again');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-950 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Eye className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isLogin ? (lang === 'zh' ? '欢迎回来' : 'Welcome Back') : (lang === 'zh' ? '创建账户' : 'Create Account')}
            </h1>
            <p className="text-gray-500 mt-2">
              {lang === 'zh' ? '开始你的视力健康之旅' : 'Start your eye health journey'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <input
                type="text"
                placeholder={lang === 'zh' ? '姓名' : 'Name'}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            )}
            <input
              type="email"
              placeholder={lang === 'zh' ? '邮箱地址' : 'Email'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
            <input
              type="password"
              placeholder={lang === 'zh' ? '密码' : 'Password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
            
            {error && <p className="text-red-500 text-sm">{error}</p>}
            
            <Button type="submit" className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              {isLogin ? (lang === 'zh' ? '登录' : 'Sign In') : (lang === 'zh' ? '注册' : 'Sign Up')}
            </Button>
          </form>

          <p className="text-center mt-6 text-gray-500">
            {isLogin ? (lang === 'zh' ? '还没有账户？' : "Don't have an account? ") : (lang === 'zh' ? '已有账户？' : 'Already have an account? ')}
            <button onClick={() => setIsLogin(!isLogin)} className="text-blue-600 font-medium hover:underline">
              {isLogin ? (lang === 'zh' ? '立即注册' : 'Sign Up') : (lang === 'zh' ? '立即登录' : 'Sign In')}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

// 概览标签页
function OverviewTab({ stats, streak, lang }: { stats: any; streak: any; lang: string }) {
  const weekDays = lang === 'zh' ? ['一', '二', '三', '四', '五', '六', '日'] : ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">{lang === 'zh' ? '本周训练' : 'This Week'}</h3>
        <div className="flex gap-2">
          {weekDays.map((day, i) => (
            <div key={i} className="flex-1 text-center">
              <div className={`h-20 rounded-xl flex items-end justify-center pb-2 ${
                stats?.weeklyActivity?.[i] > 0 
                  ? 'bg-gradient-to-t from-blue-500 to-blue-300' 
                  : 'bg-gray-100 dark:bg-gray-800'
              }`}>
                <span className={stats?.weeklyActivity?.[i] > 0 ? 'text-white font-medium' : 'text-gray-400'}>
                  {stats?.weeklyActivity?.[i] || 0}
                </span>
              </div>
              <p className="text-xs mt-1 text-gray-500">{day}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-2xl">
          <h4 className="font-medium text-orange-800 dark:text-orange-200 mb-2">
            🔥 {lang === 'zh' ? '连续训练记录' : 'Training Streak'}
          </h4>
          <p className="text-3xl font-bold text-orange-600">{streak.current} {lang === 'zh' ? '天' : 'days'}</p>
          <p className="text-sm text-orange-600/70 mt-1">
            {lang === 'zh' ? `历史最长：${streak.longest}天` : `Best: ${streak.longest} days`}
          </p>
        </div>
        <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl">
          <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">
            📈 {lang === 'zh' ? '表现趋势' : 'Performance Trend'}
          </h4>
          <p className="text-3xl font-bold text-green-600">
            {stats?.recentTrend === 'improving' ? '↑' : stats?.recentTrend === 'declining' ? '↓' : '→'}
            {stats?.recentTrend === 'improving' ? (lang === 'zh' ? ' 上升中' : ' Improving') : 
             stats?.recentTrend === 'declining' ? (lang === 'zh' ? ' 需关注' : ' Declining') : 
             (lang === 'zh' ? ' 稳定' : ' Stable')}
          </p>
        </div>
      </div>
    </div>
  );
}

// 历史记录标签页
function HistoryTab({ results, lang }: { results: TestResult[]; lang: string }) {
  const testTypeNames: Record<string, { zh: string; en: string }> = {
    gabor: { zh: 'Gabor斑训练', en: 'Gabor Training' },
    mot: { zh: '多目标追踪', en: 'MOT Training' },
    contrast: { zh: '对比敏感度', en: 'Contrast Sensitivity' },
    acuity: { zh: '视力测试', en: 'Visual Acuity' },
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">{lang === 'zh' ? '历史检查记录' : 'Test History'}</h3>
      {results.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>{lang === 'zh' ? '暂无检查记录' : 'No test records yet'}</p>
          <Link href="/games">
            <Button className="mt-4">{lang === 'zh' ? '开始训练' : 'Start Training'}</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {results.slice().reverse().map((result, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  {result.testType === 'gabor' ? <Eye className="w-5 h-5 text-blue-600" /> :
                   result.testType === 'mot' ? <Brain className="w-5 h-5 text-purple-600" /> :
                   <Target className="w-5 h-5 text-green-600" />}
                </div>
                <div>
                  <p className="font-medium">{testTypeNames[result.testType]?.[lang] || result.testType}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(result.timestamp).toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US')}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-blue-600">{result.score}</p>
                <p className="text-xs text-gray-500">{lang === 'zh' ? '分' : 'pts'}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// AI分析标签页
function AnalysisTab({ analysis, onAnalyze, isAnalyzing, isPremium, lang }: any) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-500" />
          {lang === 'zh' ? 'AI智能分析' : 'AI Analysis'}
        </h3>
        <Button onClick={onAnalyze} disabled={isAnalyzing}>
          {isAnalyzing ? (lang === 'zh' ? '分析中...' : 'Analyzing...') : (lang === 'zh' ? '生成分析报告' : 'Generate Report')}
        </Button>
      </div>

      {!isPremium && (
        <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
          <p className="text-purple-800 dark:text-purple-200 font-medium">
            ✨ {lang === 'zh' ? '升级高级会员解锁完整AI分析功能' : 'Upgrade to Premium for full AI analysis'}
          </p>
        </div>
      )}

      {analysis ? (
        <div className="space-y-6">
          <div className={`p-4 rounded-xl ${
            analysis.riskLevel === 'low' ? 'bg-green-50 dark:bg-green-900/20' :
            analysis.riskLevel === 'medium' ? 'bg-yellow-50 dark:bg-yellow-900/20' :
            'bg-red-50 dark:bg-red-900/20'
          }`}>
            <h4 className="font-semibold mb-2">{lang === 'zh' ? '📊 分析摘要' : '📊 Summary'}</h4>
            <p>{lang === 'zh' ? analysis.summary : analysis.summaryEn}</p>
          </div>

          <div>
            <h4 className="font-semibold mb-3">{lang === 'zh' ? '💡 个性化建议' : '💡 Recommendations'}</h4>
            <ul className="space-y-2">
              {analysis.recommendations.map((rec: any, i: number) => (
                <li key={i} className="flex items-start gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <ChevronRight className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span>{lang === 'zh' ? rec.zh : rec.en}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">{lang === 'zh' ? '📚 科学依据' : '📚 Scientific Basis'}</h4>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              {analysis.scientificBasis.map((ref: string, i: number) => (
                <p key={i}>• {ref}</p>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>{lang === 'zh' ? '点击上方按钮生成AI分析报告' : 'Click button above to generate AI analysis'}</p>
        </div>
      )}
    </div>
  );
}

// 分享标签页
function ShareTab({ results, streak, lang }: { results: TestResult[]; streak: any; lang: string }) {
  const [selectedTheme, setSelectedTheme] = useState('ocean');
  const latestResult = results[results.length - 1];

  const handleGenerateCard = () => {
    if (!latestResult) return;
    
    const canvas = document.getElementById('share-canvas') as HTMLCanvasElement;
    if (!canvas) return;

    const testNames: Record<string, string> = {
      gabor: 'Gabor斑训练',
      mot: '多目标追踪',
      contrast: '对比敏感度',
    };

    generateShareCard(canvas, {
      testType: latestResult.testType,
      testName: testNames[latestResult.testType] || latestResult.testType,
      score: latestResult.score,
      rank: getScoreRank(latestResult.testType, latestResult.score),
      date: new Date(latestResult.timestamp).toLocaleDateString('zh-CN'),
      streak: streak.current,
      highlights: [`已完成 ${results.length} 次训练`],
    }, cardThemes[selectedTheme]);
  };

  const handleDownload = () => {
    const canvas = document.getElementById('share-canvas') as HTMLCanvasElement;
    if (canvas) {
      downloadShareCard(canvas);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">{lang === 'zh' ? '分享你的成就' : 'Share Your Achievement'}</h3>
      
      {!latestResult ? (
        <div className="text-center py-12 text-gray-500">
          <Share2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>{lang === 'zh' ? '完成测试后即可生成分享卡片' : 'Complete a test to generate share card'}</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-3">{lang === 'zh' ? '选择主题' : 'Select Theme'}</h4>
            <div className="flex gap-2 mb-4">
              {Object.keys(cardThemes).map((theme) => (
                <button
                  key={theme}
                  onClick={() => setSelectedTheme(theme)}
                  className={`w-10 h-10 rounded-xl ${
                    selectedTheme === theme ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                  }`}
                  style={{ background: cardThemes[theme].gradientFrom }}
                />
              ))}
            </div>
            <div className="space-y-3">
              <Button onClick={handleGenerateCard} className="w-full">
                {lang === 'zh' ? '生成卡片' : 'Generate Card'}
              </Button>
              <Button onClick={handleDownload} variant="outline" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                {lang === 'zh' ? '下载图片' : 'Download Image'}
              </Button>
            </div>
          </div>
          <div className="flex justify-center">
            <canvas id="share-canvas" className="rounded-2xl shadow-lg max-w-full" />
          </div>
        </div>
      )}
    </div>
  );
}
