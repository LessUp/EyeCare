"use client"

import { useState } from 'react';
import { useLanguage } from '@/components/providers/language-provider';
import { useAuth } from '@/components/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { 
  knowledgeArticles, 
  categoryNames, 
  latestResearch,
  ArticleCategory,
  KnowledgeArticle 
} from '@/lib/knowledge-base';
import { 
  BookOpen, Search, Clock, Tag, ArrowLeft, 
  Crown, BookMarked, FlaskConical, Eye, Salad,
  MonitorSmartphone, GraduationCap, Heart, Sparkles,
  ExternalLink, ChevronRight
} from 'lucide-react';
import Link from 'next/link';

const categoryIcons: Record<ArticleCategory, any> = {
  myopia: Eye,
  presbyopia: GraduationCap,
  'eye-strain': MonitorSmartphone,
  nutrition: Salad,
  training: FlaskConical,
  diseases: Heart,
  research: Sparkles,
  lifestyle: BookMarked,
};

export default function KnowledgePage() {
  const { lang } = useLanguage();
  const { membershipStatus } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<ArticleCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | null>(null);

  const filteredArticles = knowledgeArticles.filter(article => {
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some(t => t.includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const categories: (ArticleCategory | 'all')[] = ['all', 'myopia', 'training', 'eye-strain', 'nutrition', 'research'];

  if (selectedArticle) {
    return (
      <ArticleView 
        article={selectedArticle} 
        lang={lang} 
        onBack={() => setSelectedArticle(null)}
        isPremium={membershipStatus.tier !== 'free'}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400 text-sm mb-4">
            <BookOpen className="w-4 h-4" />
            {lang === 'zh' ? '基于最新科学研究' : 'Based on Latest Research'}
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {lang === 'zh' ? '眼健康知识库' : 'Eye Health Knowledge Base'}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {lang === 'zh' 
              ? '汇集2024-2025年最新眼科研究成果，助你科学护眼' 
              : 'Latest ophthalmology research from 2024-2025 for scientific eye care'}
          </p>
        </div>

        {/* Search */}
        <div className="max-w-xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={lang === 'zh' ? '搜索文章...' : 'Search articles...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8">
          {categories.map((cat) => {
            const Icon = cat === 'all' ? BookOpen : categoryIcons[cat];
            const name = cat === 'all' 
              ? (lang === 'zh' ? '全部' : 'All') 
              : (lang === 'zh' ? categoryNames[cat].zh : categoryNames[cat].en);
            
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {name}
              </button>
            );
          })}
        </div>

        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredArticles.map((article) => {
            const Icon = categoryIcons[article.category];
            const isLocked = article.isPremium && membershipStatus.tier === 'free';
            
            return (
              <article
                key={article.id}
                onClick={() => !isLocked && setSelectedArticle(article)}
                className={`bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-800 transition-all ${
                  isLocked ? 'opacity-75' : 'hover:shadow-xl hover:-translate-y-1 cursor-pointer'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-xl ${
                    article.category === 'research' ? 'bg-purple-100 dark:bg-purple-900/30' :
                    article.category === 'training' ? 'bg-blue-100 dark:bg-blue-900/30' :
                    article.category === 'myopia' ? 'bg-green-100 dark:bg-green-900/30' :
                    'bg-orange-100 dark:bg-orange-900/30'
                  }`}>
                    <Icon className={`w-5 h-5 ${
                      article.category === 'research' ? 'text-purple-600' :
                      article.category === 'training' ? 'text-blue-600' :
                      article.category === 'myopia' ? 'text-green-600' :
                      'text-orange-600'
                    }`} />
                  </div>
                  {article.isPremium && (
                    <span className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs rounded-full">
                      <Crown className="w-3 h-3" />
                      {lang === 'zh' ? '高级' : 'Premium'}
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 line-clamp-2">
                  {lang === 'zh' ? article.title : article.titleEn}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                  {lang === 'zh' ? article.summary : article.summaryEn}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {article.readTime} {lang === 'zh' ? '分钟' : 'min'}
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    article.difficulty === 'beginner' ? 'bg-green-100 text-green-600' :
                    article.difficulty === 'intermediate' ? 'bg-blue-100 text-blue-600' :
                    'bg-purple-100 text-purple-600'
                  }`}>
                    {article.difficulty === 'beginner' ? (lang === 'zh' ? '入门' : 'Beginner') :
                     article.difficulty === 'intermediate' ? (lang === 'zh' ? '进阶' : 'Intermediate') :
                     (lang === 'zh' ? '高级' : 'Advanced')}
                  </span>
                </div>

                {isLocked && (
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <Link href="/membership">
                      <Button size="sm" className="w-full">
                        <Crown className="w-4 h-4 mr-2" />
                        {lang === 'zh' ? '升级解锁' : 'Upgrade to Unlock'}
                      </Button>
                    </Link>
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {/* Latest Research Section */}
        <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl p-8 text-white">
          <div className="flex items-center gap-3 mb-6">
            <FlaskConical className="w-8 h-8" />
            <div>
              <h2 className="text-2xl font-bold">
                {lang === 'zh' ? '最新科学文献' : 'Latest Scientific Literature'}
              </h2>
              <p className="text-purple-200">2024-2025</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {latestResearch.slice(0, 4).map((ref, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-colors">
                <p className="font-medium mb-1">{ref.title}</p>
                <p className="text-sm text-purple-200">{ref.authors}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-purple-300">{ref.journal}, {ref.year}</span>
                  {ref.doi && (
                    <a 
                      href={`https://doi.org/${ref.doi}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-purple-200 hover:text-white flex items-center gap-1"
                    >
                      DOI <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// 文章详情视图
function ArticleView({ 
  article, 
  lang, 
  onBack,
  isPremium 
}: { 
  article: KnowledgeArticle; 
  lang: string; 
  onBack: () => void;
  isPremium: boolean;
}) {
  const content = lang === 'zh' ? article.content : article.contentEn;
  
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          {lang === 'zh' ? '返回知识库' : 'Back to Knowledge Base'}
        </button>

        <article>
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm">
                {lang === 'zh' ? categoryNames[article.category].zh : categoryNames[article.category].en}
              </span>
              <span className="text-gray-500 text-sm flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {article.readTime} {lang === 'zh' ? '分钟阅读' : 'min read'}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {lang === 'zh' ? article.title : article.titleEn}
            </h1>
            
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {lang === 'zh' ? article.summary : article.summaryEn}
            </p>

            <div className="flex flex-wrap gap-2 mt-4">
              {article.tags.map((tag, i) => (
                <span key={i} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded text-sm">
                  #{tag}
                </span>
              ))}
            </div>
          </header>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            {content.split('\n').map((paragraph, i) => {
              if (paragraph.startsWith('# ')) {
                return <h1 key={i} className="text-2xl font-bold mt-8 mb-4">{paragraph.slice(2)}</h1>;
              }
              if (paragraph.startsWith('## ')) {
                return <h2 key={i} className="text-xl font-bold mt-6 mb-3">{paragraph.slice(3)}</h2>;
              }
              if (paragraph.startsWith('### ')) {
                return <h3 key={i} className="text-lg font-semibold mt-4 mb-2">{paragraph.slice(4)}</h3>;
              }
              if (paragraph.startsWith('- ')) {
                return <li key={i} className="ml-4">{paragraph.slice(2)}</li>;
              }
              if (paragraph.trim()) {
                return <p key={i} className="mb-4 text-gray-700 dark:text-gray-300">{paragraph}</p>;
              }
              return null;
            })}
          </div>

          {/* References */}
          {article.references.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <BookMarked className="w-5 h-5" />
                {lang === 'zh' ? '参考文献' : 'References'}
              </h3>
              <ul className="space-y-3">
                {article.references.map((ref, i) => (
                  <li key={i} className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">{ref.authors}</span> ({ref.year}). {ref.title}. <em>{ref.journal}</em>.
                    {ref.doi && (
                      <a 
                        href={`https://doi.org/${ref.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline ml-1"
                      >
                        DOI
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* CTA */}
          <div className="mt-12 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl">
            <h4 className="font-bold text-lg mb-2">
              {lang === 'zh' ? '开始实践' : 'Start Practicing'}
            </h4>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {lang === 'zh' 
                ? '将理论付诸实践，开始你的视觉训练之旅' 
                : 'Put theory into practice, start your visual training journey'}
            </p>
            <Link href="/games">
              <Button className="rounded-xl">
                {lang === 'zh' ? '前往训练' : 'Go to Training'}
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}
