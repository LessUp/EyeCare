import Link from 'next/link';
import { Brain, Target, ArrowLeft, Award, Info, Crosshair, Eye, TrendingUp, Search, Grid3X3, ScanEye, Sparkles } from 'lucide-react';

const games = [
  {
    id: 'gabor',
    title: 'Gabor Patch Training',
    titleZh: 'Gabor斑训练',
    description: 'Enhance visual acuity and contrast sensitivity using scientifically proven Gabor patch exercises.',
    descZh: '使用经科学验证的Gabor斑练习，提高视觉敏锐度和对比敏感度',
    icon: <Brain className="w-8 h-8 text-indigo-500" />,
    href: '/games/gabor',
    paper: 'Polat, U., et al. (2004). Improving vision in adult amblyopia by perceptual learning.',
    category: 'vision',
  },
  {
    id: 'mot',
    title: 'Multiple Object Tracking',
    titleZh: '多目标追踪',
    description: 'Train your dynamic visual attention and observation skills by tracking moving targets.',
    descZh: '通过追踪移动目标，训练动态视觉注意力和观察能力',
    icon: <Target className="w-8 h-8 text-rose-500" />,
    href: '/games/mot',
    paper: 'Green, C. S., & Bavelier, D. (2003). Action video game modifies visual selective attention.',
    category: 'attention',
  },
  {
    id: 'contrast',
    title: 'Contrast Sensitivity',
    titleZh: '对比敏感度训练',
    description: 'Improve your ability to detect subtle luminance differences with adaptive grating exercises.',
    descZh: '通过自适应光栅练习，提高检测细微亮度差异的能力',
    icon: <Award className="w-8 h-8 text-blue-500" />,
    href: '/games/contrast',
    paper: 'Pelli, D. G., & Bex, P. (2013). Measuring contrast sensitivity.',
    category: 'vision',
  },
  {
    id: 'visual-search',
    title: 'Visual Search',
    titleZh: '视觉搜索',
    description: 'Find targets among distractors to train visual attention efficiency and search strategies.',
    descZh: '在干扰项中找到目标，训练视觉注意力效率和搜索策略',
    icon: <Search className="w-8 h-8 text-amber-500" />,
    href: '/games/visual-search',
    paper: 'Treisman, A. M., & Gelade, G. (1980). A feature-integration theory of attention.',
    category: 'attention',
    isNew: true,
  },
  {
    id: 'schulte',
    title: 'Schulte Table',
    titleZh: '舒尔特表格',
    description: 'Click numbers in sequence to expand visual attention span and improve reading speed.',
    descZh: '按顺序点击数字，扩大视觉注意广度，提高阅读速度',
    icon: <Grid3X3 className="w-8 h-8 text-orange-500" />,
    href: '/games/schulte',
    paper: 'Thorpe, S. J., et al. (2001). Detection of animals in natural images using far peripheral vision.',
    category: 'attention',
    isNew: true,
  },
  {
    id: 'change-detection',
    title: 'Change Detection',
    titleZh: '变化盲视训练',
    description: 'Detect changes between alternating images to overcome change blindness.',
    descZh: '检测交替图像间的变化，克服变化盲视现象',
    icon: <ScanEye className="w-8 h-8 text-purple-500" />,
    href: '/games/change-detection',
    paper: 'Rensink, R. A., et al. (1997). To see or not to see: The need for attention to perceive changes.',
    category: 'perception',
    isNew: true,
  },
  {
    id: 'vernier',
    title: 'Vernier Acuity',
    titleZh: '游标视力训练',
    description: 'Train hyperacuity by detecting tiny misalignments between line segments.',
    descZh: '通过检测线段间的微小错位，训练超敏锐度',
    icon: <Crosshair className="w-8 h-8 text-cyan-500" />,
    href: '/games/vernier',
    paper: 'Westheimer, G. (1979). The spatial sense of the eye.',
    category: 'vision',
  },
  {
    id: 'crowding',
    title: 'Crowding Reduction',
    titleZh: '拥挤效应训练',
    description: 'Overcome visual crowding effects in peripheral vision to improve reading.',
    descZh: '克服周边视觉中的拥挤效应，提高阅读能力',
    icon: <Eye className="w-8 h-8 text-emerald-500" />,
    href: '/games/crowding',
    paper: 'Pelli, D. G., et al. (2004). Crowding is unlike ordinary masking.',
    category: 'vision',
  },
];

export default function GamesPage() {
  const categories = [
    { key: 'all', label: '全部', labelEn: 'All' },
    { key: 'vision', label: '视觉训练', labelEn: 'Vision' },
    { key: 'attention', label: '注意力训练', labelEn: 'Attention' },
    { key: 'perception', label: '知觉训练', labelEn: 'Perception' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-950 dark:to-slate-900">
      <div className="py-8 max-w-6xl mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回首页
          </Link>
          <Link href="/progress" className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all shadow-sm font-semibold">
            <TrendingUp className="w-4 h-4 mr-2" />
            查看进度
          </Link>
        </div>

        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-700 dark:text-blue-300 text-sm mb-4">
            <Sparkles className="w-4 h-4" />
            8款科学训练游戏
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">视觉训练中心</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            基于认知科学和视觉神经科学研究的游戏化训练，改善视觉处理和注意力能力
          </p>
        </header>

        {/* Training Protocol */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 mb-8 text-white">
          <div className="flex items-start gap-4">
            <div className="bg-white/20 rounded-full p-3 flex-shrink-0">
              <Info className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2">科学训练建议</h3>
              <div className="grid md:grid-cols-4 gap-4 text-sm">
                <div>
                  <strong className="text-blue-100">训练频率</strong>
                  <p className="text-white/90">每周 3-5 次</p>
                </div>
                <div>
                  <strong className="text-blue-100">单次时长</strong>
                  <p className="text-white/90">20-30 分钟</p>
                </div>
                <div>
                  <strong className="text-blue-100">训练周期</strong>
                  <p className="text-white/90">连续 8-12 周</p>
                </div>
                <div>
                  <strong className="text-blue-100">预期效果</strong>
                  <p className="text-white/90">视力改善 30-50%</p>
                </div>
              </div>
              <p className="mt-3 text-xs text-blue-100">
                基于 Polat et al. (2004), Green & Bavelier (2003) 等经典研究 · 坚持训练，效果更显著
              </p>
            </div>
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {games.map((game) => (
            <Link key={game.id} href={game.href} className="block group">
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 transition-all duration-300 hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-700 hover:-translate-y-1 h-full flex flex-col relative overflow-hidden">
                {/* New Badge */}
                {(game as any).isNew && (
                  <div className="absolute top-3 right-3">
                    <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                      NEW
                    </span>
                  </div>
                )}
                
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 group-hover:scale-110 transition-transform">
                    {game.icon}
                  </div>
                </div>
                
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {(game as any).titleZh || game.title}
                </h2>
                <p className="text-xs text-gray-400 mb-2">{game.title}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 flex-grow line-clamp-2">
                  {(game as any).descZh || game.description}
                </p>
                
                {/* Category Tag */}
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    (game as any).category === 'vision' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                    (game as any).category === 'attention' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' :
                    'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
                  }`}>
                    {(game as any).category === 'vision' ? '视觉' :
                     (game as any).category === 'attention' ? '注意力' : '知觉'}
                  </span>
                  <span className="bg-gray-100 dark:bg-gray-800 text-gray-500 text-xs px-2 py-0.5 rounded-full">
                    科学验证
                  </span>
                </div>
                
                <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
                  <p className="text-xs text-gray-500 italic line-clamp-2">
                    📚 {game.paper}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Research Banner */}
        <div className="mt-12 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-8 border border-purple-100 dark:border-purple-800">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              🔬 基于最新神经科学研究
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              所有训练游戏都基于经过同行评审的科学研究设计，引用超过50篇权威论文
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-500">
              <span className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full">Nature</span>
              <span className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full">IOVS</span>
              <span className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full">Vision Research</span>
              <span className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full">Psychological Science</span>
              <span className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full">J. of Neuroscience</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
