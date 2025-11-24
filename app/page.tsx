import Link from 'next/link';
import { Eye, Palette, Activity, Zap, ScanLine, Brain } from 'lucide-react';

const tests = [
  {
    id: 'acuity',
    title: 'Visual Acuity Test',
    description: 'Standard E-chart test to measure your visual sharpness.',
    icon: <Eye className="w-8 h-8 text-blue-500" />,
    href: '/acuity'
  },
  {
    id: 'color',
    title: 'Color Blindness',
    description: 'Identify numbers in colored plates to detect color deficiencies.',
    icon: <Palette className="w-8 h-8 text-purple-500" />,
    href: '/color-blindness'
  },
  {
    id: 'sensitivity',
    title: 'Color Sensitivity',
    description: 'Test your ability to distinguish subtle color differences.',
    icon: <Zap className="w-8 h-8 text-yellow-500" />,
    href: '/sensitivity'
  },
  {
    id: 'field',
    title: 'Visual Field',
    description: 'Check your peripheral vision for blind spots.',
    icon: <ScanLine className="w-8 h-8 text-green-500" />,
    href: '/field'
  },
  {
    id: 'micro',
    title: 'Micro-Perimetry',
    description: 'Detailed assessment of central visual field sensitivity.',
    icon: <Activity className="w-8 h-8 text-red-500" />,
    href: '/micro-perimetry'
  },
  {
    id: 'games',
    title: 'Vision Training Games',
    description: 'Gamified exercises to improve acuity and attention (Gabor, MOT).',
    icon: <Brain className="w-8 h-8 text-indigo-500" />,
    href: '/games'
  }
];

export default function Home() {
  return (
    <div className="py-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Comprehensive Vision Testing</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Professional-grade eye tests you can take at home. 
          Based on the latest ophthalmology research standards.
        </p>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tests.map((test) => (
          <Link key={test.id} href={test.href} className="block group">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all duration-200 hover:shadow-md hover:border-blue-200 h-full">
              <div className="mb-4 bg-gray-50 rounded-full w-16 h-16 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                {test.icon}
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
                {test.title}
              </h2>
              <p className="text-gray-600">
                {test.description}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-16 bg-blue-50 rounded-2xl p-8 text-center">
        <h3 className="text-2xl font-bold text-blue-900 mb-4">Medical Disclaimer</h3>
        <p className="text-blue-800 max-w-3xl mx-auto">
          These online tests are for screening and educational purposes only. 
          They are not a replacement for a professional eye examination by a qualified ophthalmologist.
          If you experience any vision problems, please consult a doctor immediately.
        </p>
      </div>
    </div>
  );
}
