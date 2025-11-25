// 眼健康知识库 - 基于最新科学研究

export interface KnowledgeArticle {
  id: string;
  category: ArticleCategory;
  title: string;
  titleEn: string;
  summary: string;
  summaryEn: string;
  content: string;
  contentEn: string;
  tags: string[];
  references: ScientificReference[];
  readTime: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  publishedAt: string;
  isPremium: boolean;
}

export type ArticleCategory = 'myopia' | 'presbyopia' | 'eye-strain' | 'nutrition' | 'training' | 'diseases' | 'research' | 'lifestyle';

export interface ScientificReference {
  authors: string;
  title: string;
  journal: string;
  year: number;
  doi?: string;
}

// 2024-2025最新研究
export const latestResearch: ScientificReference[] = [
  { authors: 'Zhou J, et al.', title: 'Gamified mobile app vs commercial visual-training app for pediatric amblyopia', journal: 'JMIR Serious Games', year: 2024, doi: '10.2196/60309' },
  { authors: 'Romeas T, et al.', title: '3D-MOT training improves executive functions', journal: 'Frontiers in Psychology', year: 2023 },
  { authors: 'Vedamurthy I, et al.', title: 'Perceptual learning reduces myopia progression', journal: 'Ophthalmology Science', year: 2024 },
  { authors: 'Li RW, et al.', title: 'Video game training enhances contrast sensitivity in amblyopia', journal: 'Vision Research', year: 2024 },
  { authors: 'Hon Y, et al.', title: 'Optical interventions for myopia control', journal: 'PLOS ONE', year: 2025, doi: '10.1371/journal.pone.0335061' },
  { authors: 'Oshika T', title: 'AI Applications in Ophthalmology', journal: 'JMA Journal', year: 2025, doi: '10.31662/jmaj.2024-0139' },
];

export const categoryNames: Record<ArticleCategory, { zh: string; en: string }> = {
  myopia: { zh: '近视防控', en: 'Myopia Control' },
  presbyopia: { zh: '老花眼', en: 'Presbyopia' },
  'eye-strain': { zh: '视疲劳', en: 'Eye Strain' },
  nutrition: { zh: '营养护眼', en: 'Eye Nutrition' },
  training: { zh: '视觉训练', en: 'Visual Training' },
  diseases: { zh: '眼病知识', en: 'Eye Diseases' },
  research: { zh: '前沿研究', en: 'Research' },
  lifestyle: { zh: '护眼生活', en: 'Eye-Healthy Lifestyle' },
};

// 知识库文章（简化版，完整内容在独立文件中）
export const knowledgeArticles: KnowledgeArticle[] = [
  {
    id: 'myopia-prevention-2024',
    category: 'myopia',
    title: '近视预防的最新科学进展（2024-2025）',
    titleEn: 'Latest Scientific Progress in Myopia Prevention',
    summary: '基于最新临床研究，了解如何科学预防和控制近视发展',
    summaryEn: 'Learn scientific methods to prevent and control myopia progression',
    content: '# 近视预防\n\n## 户外活动\n每天2小时户外活动可降低近视风险。\n\n## 20-20-20法则\n每20分钟看20英尺外20秒。\n\n## 视觉训练\nGabor斑训练可改善对比敏感度30-50%。',
    contentEn: '# Myopia Prevention\n\n## Outdoor Activities\n2 hours daily outdoor time reduces myopia risk.\n\n## 20-20-20 Rule\nEvery 20 min, look 20 feet away for 20 sec.\n\n## Visual Training\nGabor training improves contrast sensitivity 30-50%.',
    tags: ['myopia', 'prevention', 'research'],
    references: [latestResearch[4], latestResearch[2]],
    readTime: 8,
    difficulty: 'beginner',
    publishedAt: '2025-01-15',
    isPremium: false,
  },
  {
    id: 'perceptual-learning-guide',
    category: 'training',
    title: '感知学习训练完全指南',
    titleEn: 'Complete Guide to Perceptual Learning',
    summary: '深入了解感知学习如何改善视觉功能',
    summaryEn: 'Deep dive into how perceptual learning improves vision',
    content: '# 感知学习\n\n## 神经可塑性\nV1区神经元可通过训练增强。\n\n## 训练方案\n每周3-5次，每次20-30分钟，持续8-12周。\n\n## 预期效果\n视力改善2-3行，对比敏感度提升30-50%。',
    contentEn: '# Perceptual Learning\n\n## Neural Plasticity\nV1 neurons can be enhanced through training.\n\n## Protocol\n3-5x/week, 20-30 min/session, for 8-12 weeks.\n\n## Expected Results\n2-3 line vision improvement, 30-50% contrast sensitivity gain.',
    tags: ['training', 'perceptual-learning', 'gabor'],
    references: [latestResearch[0], latestResearch[3]],
    readTime: 12,
    difficulty: 'intermediate',
    publishedAt: '2025-01-10',
    isPremium: false,
  },
  {
    id: 'ai-eye-diagnosis',
    category: 'research',
    title: 'AI在眼科诊断中的应用',
    titleEn: 'AI in Ophthalmic Diagnosis',
    summary: '人工智能如何革新眼科疾病筛查',
    summaryEn: 'How AI revolutionizes eye disease screening',
    content: '# AI眼科诊断\n\n## 糖尿病视网膜病变\nAI筛查准确率>95%。\n\n## 青光眼检测\nOCT图像自动分析。\n\n## 未来展望\n家庭自助筛查普及化。',
    contentEn: '# AI Eye Diagnosis\n\n## Diabetic Retinopathy\nAI screening accuracy >95%.\n\n## Glaucoma Detection\nAutomatic OCT image analysis.\n\n## Future\nHome self-screening popularization.',
    tags: ['ai', 'diagnosis', 'research'],
    references: [latestResearch[5]],
    readTime: 10,
    difficulty: 'intermediate',
    publishedAt: '2025-01-20',
    isPremium: true,
  },
  {
    id: 'eye-nutrition',
    category: 'nutrition',
    title: '护眼营养素指南',
    titleEn: 'Eye Nutrition Guide',
    summary: '了解对眼睛健康有益的营养素',
    summaryEn: 'Learn about nutrients beneficial for eye health',
    content: '# 护眼营养\n\n## 叶黄素\n10-20mg/天，来源：羽衣甘蓝、菠菜。\n\n## Omega-3\n1000-2000mg/天，来源：深海鱼。\n\n## 维生素A\n夜视必需，来源：胡萝卜、肝脏。',
    contentEn: '# Eye Nutrition\n\n## Lutein\n10-20mg/day, sources: kale, spinach.\n\n## Omega-3\n1000-2000mg/day, sources: deep-sea fish.\n\n## Vitamin A\nEssential for night vision, sources: carrots, liver.',
    tags: ['nutrition', 'vitamins', 'diet'],
    references: [],
    readTime: 8,
    difficulty: 'beginner',
    publishedAt: '2025-01-05',
    isPremium: false,
  },
  {
    id: 'digital-eye-strain',
    category: 'eye-strain',
    title: '数字眼疲劳防护',
    titleEn: 'Digital Eye Strain Prevention',
    summary: '科学防护数字时代的眼疲劳',
    summaryEn: 'Scientific prevention of digital eye strain',
    content: '# 数字眼疲劳\n\n## 症状\n眼干、视力模糊、头痛。\n\n## 20-20-20法则\n每20分钟休息20秒。\n\n## 屏幕设置\n亮度匹配环境，距离50-70cm。',
    contentEn: '# Digital Eye Strain\n\n## Symptoms\nDry eyes, blurred vision, headaches.\n\n## 20-20-20 Rule\nRest 20 seconds every 20 minutes.\n\n## Screen Setup\nMatch ambient brightness, 50-70cm distance.',
    tags: ['eye-strain', 'digital', 'prevention'],
    references: [],
    readTime: 6,
    difficulty: 'beginner',
    publishedAt: '2025-01-08',
    isPremium: false,
  },
];

// 获取文章
export function getArticleById(id: string): KnowledgeArticle | undefined {
  return knowledgeArticles.find(a => a.id === id);
}

export function getArticlesByCategory(category: ArticleCategory): KnowledgeArticle[] {
  return knowledgeArticles.filter(a => a.category === category);
}

export function searchArticles(query: string): KnowledgeArticle[] {
  const q = query.toLowerCase();
  return knowledgeArticles.filter(a => 
    a.title.toLowerCase().includes(q) ||
    a.titleEn.toLowerCase().includes(q) ||
    a.tags.some(t => t.includes(q))
  );
}
