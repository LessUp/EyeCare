import Link from 'next/link';
import { Brain, Target, ArrowLeft, Award, Info } from 'lucide-react';

const games = [
  {
    id: 'gabor',
    title: 'Gabor Patch Training',
    description: 'Enhance visual acuity and contrast sensitivity using scientifically proven Gabor patch exercises.',
    icon: <Brain className="w-8 h-8 text-indigo-500" />,
    href: '/games/gabor',
    paper: 'Polat, U., et al. (2004). Improving vision in adult amblyopia by perceptual learning.'
  },
  {
    id: 'mot',
    title: 'Multiple Object Tracking',
    description: 'Train your dynamic visual attention and observation skills by tracking moving targets.',
    icon: <Target className="w-8 h-8 text-rose-500" />,
    href: '/games/mot',
    paper: 'Green, C. S., & Bavelier, D. (2003). Action video game modifies visual selective attention.'
  },
  {
    id: 'contrast',
    title: 'Contrast Sensitivity Training',
    description: 'Improve your ability to detect subtle luminance differences with adaptive grating exercises.',
    icon: <Award className="w-8 h-8 text-blue-500" />,
    href: '/games/contrast',
    paper: 'Pelli, D. G., & Bex, P. (2013). Measuring contrast sensitivity.'
  }
];

export default function GamesPage() {
  return (
    <div className="py-8 max-w-6xl mx-auto px-4">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Tests
        </Link>
      </div>

      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Vision Training Games</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Gamified exercises based on scientific research to improve your visual processing and attention.
        </p>
      </header>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8 border border-blue-100">
        <div className="flex items-start gap-4">
          <div className="bg-blue-500 rounded-full p-3 flex-shrink-0">
            <Info className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">科学训练建议 (Training Protocol)</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-700">
              <div>
                <strong className="text-blue-700">频率 (Frequency):</strong>
                <p>每周 3-5 次训练</p>
              </div>
              <div>
                <strong className="text-blue-700">时长 (Duration):</strong>
                <p>每次 20-30 分钟</p>
              </div>
              <div>
                <strong className="text-blue-700">周期 (Cycle):</strong>
                <p>连续 8-12 周可见效果</p>
              </div>
            </div>
            <p className="mt-3 text-xs text-gray-600">
              研究表明规律训练可改善视力 30-50%。坚持练习，效果更佳！
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{games.map((game) => (
          <Link key={game.id} href={game.href} className="block group">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 transition-all duration-200 hover:shadow-lg hover:border-blue-200 h-full flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className="bg-gray-50 rounded-xl p-3 group-hover:bg-blue-50 transition-colors">
                  {game.icon}
                </div>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                  Scientific
                </span>
              </div>
              
              <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600">
                {game.title}
              </h2>
              <p className="text-gray-600 text-sm mb-4 flex-grow">
                {game.description}
              </p>
              
              <div className="pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500 italic line-clamp-2">
                  {game.paper}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
