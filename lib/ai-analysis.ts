// AI 分析服务 - 基于大模型的眼健康智能分析
// 支持多种 AI 提供商：OpenAI, Claude, 通义千问等

export interface AIConfig {
  provider: 'openai' | 'claude' | 'qwen' | 'local';
  apiKey?: string;
  model?: string;
  baseUrl?: string;
}

export interface AnalysisInput {
  testType: string;
  testResults: {
    score: number;
    accuracy?: number;
    details?: Record<string, any>;
  }[];
  userProfile?: {
    age?: number;
    screenTime?: number;
    wearGlasses?: boolean;
    eyeConditions?: string[];
  };
  historicalTrend?: {
    direction: 'improving' | 'stable' | 'declining';
    changePercent: number;
  };
}

export interface AIAnalysisResult {
  summary: string;
  summaryEn: string;
  riskLevel: 'low' | 'medium' | 'high';
  scores: {
    overall: number;
    consistency: number;
    improvement: number;
  };
  recommendations: { zh: string; en: string }[];
  warnings: { zh: string; en: string }[];
  scientificBasis: string[];
  nextSteps: { zh: string; en: string }[];
  generatedAt: number;
}

// 本地分析规则（无需API）
export function analyzeLocally(input: AnalysisInput): AIAnalysisResult {
  const { testType, testResults, userProfile, historicalTrend } = input;
  
  // 计算平均分和最近分数
  const avgScore = testResults.reduce((a, b) => a + b.score, 0) / testResults.length;
  const recentScore = testResults[testResults.length - 1]?.score || 0;
  const avgAccuracy = testResults.reduce((a, b) => a + (b.accuracy || 0), 0) / testResults.length;
  
  // 风险评估
  let riskLevel: 'low' | 'medium' | 'high' = 'low';
  if (avgScore < 50 || avgAccuracy < 60) riskLevel = 'high';
  else if (avgScore < 70 || avgAccuracy < 75) riskLevel = 'medium';
  
  // 根据测试类型生成分析
  const analysis = generateTestAnalysis(testType, avgScore, avgAccuracy, riskLevel);
  
  // 根据用户资料生成个性化建议
  const personalizedRecs = generatePersonalizedRecommendations(userProfile, testType, riskLevel);
  
  // 趋势分析
  const trendAnalysis = analyzeTrend(historicalTrend);
  
  return {
    summary: analysis.summary.zh,
    summaryEn: analysis.summary.en,
    riskLevel,
    scores: {
      overall: Math.round(avgScore),
      consistency: calculateConsistency(testResults),
      improvement: historicalTrend?.changePercent || 0,
    },
    recommendations: [...analysis.recommendations, ...personalizedRecs],
    warnings: analysis.warnings,
    scientificBasis: getScientificBasis(testType),
    nextSteps: [...trendAnalysis.nextSteps, ...analysis.nextSteps],
    generatedAt: Date.now(),
  };
}

function generateTestAnalysis(testType: string, avgScore: number, avgAccuracy: number, riskLevel: string) {
  const analyses: Record<string, any> = {
    gabor: {
      summary: {
        zh: `您的Gabor斑训练平均得分为${avgScore.toFixed(0)}分，对比敏感度表现${riskLevel === 'low' ? '良好' : riskLevel === 'medium' ? '一般' : '需要关注'}。`,
        en: `Your Gabor training average score is ${avgScore.toFixed(0)}, contrast sensitivity is ${riskLevel === 'low' ? 'good' : riskLevel === 'medium' ? 'moderate' : 'needs attention'}.`,
      },
      recommendations: [
        { zh: '建议每周进行3-5次Gabor训练，每次20分钟', en: 'Recommend 3-5 Gabor training sessions per week, 20 min each' },
        { zh: '训练时保持75%左右的正确率以获得最佳效果', en: 'Maintain ~75% accuracy for optimal learning effect' },
      ],
      warnings: riskLevel === 'high' ? [
        { zh: '对比敏感度较低，建议进行专业眼科检查', en: 'Low contrast sensitivity, recommend professional eye exam' },
      ] : [],
      nextSteps: [
        { zh: '继续坚持训练，8-12周后可见明显改善', en: 'Continue training, noticeable improvement in 8-12 weeks' },
      ],
    },
    mot: {
      summary: {
        zh: `您的多目标追踪能力得分${avgScore.toFixed(0)}分，视觉注意力${riskLevel === 'low' ? '表现优秀' : riskLevel === 'medium' ? '处于平均水平' : '有提升空间'}。`,
        en: `Your MOT score is ${avgScore.toFixed(0)}, visual attention is ${riskLevel === 'low' ? 'excellent' : riskLevel === 'medium' ? 'average' : 'has room for improvement'}.`,
      },
      recommendations: [
        { zh: 'MOT训练可有效提升动态视觉注意力和工作记忆', en: 'MOT training effectively improves dynamic visual attention and working memory' },
        { zh: '建议从低难度开始，逐步增加追踪目标数量', en: 'Start from low difficulty and gradually increase target count' },
      ],
      warnings: [],
      nextSteps: [
        { zh: '结合Gabor训练可获得更全面的视觉改善', en: 'Combine with Gabor training for comprehensive visual improvement' },
      ],
    },
    contrast: {
      summary: {
        zh: `您的对比敏感度阈值测试显示${avgScore < 10 ? '优秀' : avgScore < 20 ? '良好' : avgScore < 50 ? '正常' : '低于平均'}的表现。`,
        en: `Your contrast sensitivity threshold test shows ${avgScore < 10 ? 'excellent' : avgScore < 20 ? 'good' : avgScore < 50 ? 'normal' : 'below average'} performance.`,
      },
      recommendations: [
        { zh: '对比敏感度是评估功能性视觉的重要指标', en: 'Contrast sensitivity is an important measure of functional vision' },
        { zh: '保持良好的用眼习惯和充足睡眠', en: 'Maintain good eye habits and adequate sleep' },
      ],
      warnings: avgScore > 50 ? [
        { zh: '对比敏感度较低可能与早期眼病有关，建议眼科检查', en: 'Low contrast sensitivity may indicate early eye disease, recommend exam' },
      ] : [],
      nextSteps: [
        { zh: '定期进行对比敏感度测试以监测变化', en: 'Regular contrast sensitivity tests to monitor changes' },
      ],
    },
    acuity: {
      summary: {
        zh: `视力测试结果显示您的视敏度${riskLevel === 'low' ? '正常' : riskLevel === 'medium' ? '轻度异常' : '需要专业评估'}。`,
        en: `Visual acuity test shows your vision is ${riskLevel === 'low' ? 'normal' : riskLevel === 'medium' ? 'mildly abnormal' : 'needs professional evaluation'}.`,
      },
      recommendations: [
        { zh: '在线测试仅供参考，建议定期进行专业视力检查', en: 'Online tests are for reference only, recommend regular professional exams' },
        { zh: '注意用眼卫生，保持正确的阅读距离', en: 'Practice good eye hygiene, maintain proper reading distance' },
      ],
      warnings: riskLevel !== 'low' ? [
        { zh: '如视力明显下降，请尽快就医', en: 'If vision significantly decreases, seek medical attention promptly' },
      ] : [],
      nextSteps: [
        { zh: '每6-12个月进行一次专业眼科检查', en: 'Professional eye exam every 6-12 months' },
      ],
    },
  };
  
  return analyses[testType] || analyses.acuity;
}

function generatePersonalizedRecommendations(profile: AnalysisInput['userProfile'], testType: string, riskLevel: string) {
  const recs: { zh: string; en: string }[] = [];
  
  if (!profile) return recs;
  
  if (profile.age && profile.age > 40) {
    recs.push({ 
      zh: '40岁以上人群建议关注老花眼和黄斑变性风险', 
      en: 'Age 40+ should monitor presbyopia and macular degeneration risk' 
    });
  }
  
  if (profile.screenTime && profile.screenTime > 6) {
    recs.push({ 
      zh: `您每日屏幕时间${profile.screenTime}小时，建议严格执行20-20-20法则`, 
      en: `With ${profile.screenTime}h daily screen time, strictly follow 20-20-20 rule` 
    });
  }
  
  if (profile.wearGlasses) {
    recs.push({ 
      zh: '佩戴眼镜者应定期检查度数变化', 
      en: 'Glasses wearers should regularly check prescription changes' 
    });
  }
  
  if (profile.eyeConditions?.includes('dry-eye')) {
    recs.push({ 
      zh: '干眼症患者建议使用人工泪液并控制空调环境', 
      en: 'Dry eye patients should use artificial tears and control AC environment' 
    });
  }
  
  return recs;
}

function analyzeTrend(trend: AnalysisInput['historicalTrend']) {
  const nextSteps: { zh: string; en: string }[] = [];
  
  if (!trend) {
    nextSteps.push({ zh: '继续进行更多测试以建立趋势数据', en: 'Continue testing to establish trend data' });
    return { nextSteps };
  }
  
  if (trend.direction === 'improving') {
    nextSteps.push({ 
      zh: `您的表现正在提升（+${trend.changePercent.toFixed(1)}%），继续保持！`, 
      en: `Your performance is improving (+${trend.changePercent.toFixed(1)}%), keep it up!` 
    });
  } else if (trend.direction === 'declining') {
    nextSteps.push({ 
      zh: `近期表现有所下降（${trend.changePercent.toFixed(1)}%），建议检查用眼习惯`, 
      en: `Recent performance declined (${trend.changePercent.toFixed(1)}%), check eye habits` 
    });
  }
  
  return { nextSteps };
}

function calculateConsistency(results: AnalysisInput['testResults']): number {
  if (results.length < 2) return 100;
  
  const scores = results.map(r => r.score);
  const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
  const variance = scores.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / scores.length;
  const stdDev = Math.sqrt(variance);
  
  // 标准差越小，一致性越高
  const consistency = Math.max(0, 100 - stdDev * 2);
  return Math.round(consistency);
}

function getScientificBasis(testType: string): string[] {
  const bases: Record<string, string[]> = {
    gabor: [
      'Polat et al. (2004) PNAS: Gabor训练改善弱视视力2-3行',
      'Levi & Li (2009) Vision Research: 对比敏感度提升30-50%',
      'Li RW et al. (2024): 视频游戏训练增强对比敏感度',
    ],
    mot: [
      'Green & Bavelier (2003) Nature: 游戏训练改善视觉选择性注意',
      'Romeas et al. (2023): 15小时训练改善执行功能25%',
      'Parsons et al. (2016): 3D-MOT改善工作记忆和处理速度',
    ],
    contrast: [
      'Pelli & Bex (2013) Vision Research: 对比敏感度测量方法学',
      '对比敏感度是早期眼病的敏感指标',
    ],
    acuity: [
      '基于Snellen和LogMAR国际标准视力表',
      '在线测试受屏幕和环境因素影响，仅供参考',
    ],
  };
  
  return bases[testType] || bases.acuity;
}

// AI API 调用（需要配置API密钥）
export async function analyzeWithAI(input: AnalysisInput, config: AIConfig): Promise<AIAnalysisResult> {
  if (config.provider === 'local' || !config.apiKey) {
    return analyzeLocally(input);
  }
  
  const prompt = buildAnalysisPrompt(input);
  
  try {
    let response: string;
    
    switch (config.provider) {
      case 'openai':
        response = await callOpenAI(prompt, config);
        break;
      case 'claude':
        response = await callClaude(prompt, config);
        break;
      case 'qwen':
        response = await callQwen(prompt, config);
        break;
      default:
        return analyzeLocally(input);
    }
    
    return parseAIResponse(response, input);
  } catch (error) {
    console.error('AI analysis failed, falling back to local:', error);
    return analyzeLocally(input);
  }
}

function buildAnalysisPrompt(input: AnalysisInput): string {
  return `你是一位专业的眼科医学顾问。请分析以下视觉测试数据并提供建议：

测试类型：${input.testType}
测试次数：${input.testResults.length}
平均得分：${(input.testResults.reduce((a, b) => a + b.score, 0) / input.testResults.length).toFixed(1)}
${input.userProfile ? `用户资料：年龄${input.userProfile.age || '未知'}，每日屏幕时间${input.userProfile.screenTime || '未知'}小时` : ''}
${input.historicalTrend ? `趋势：${input.historicalTrend.direction}，变化${input.historicalTrend.changePercent}%` : ''}

请提供：
1. 简要分析总结（中英文）
2. 风险评估（low/medium/high）
3. 个性化建议（3-5条）
4. 科学依据
5. 下一步建议

请以JSON格式返回。`;
}

async function callOpenAI(prompt: string, config: AIConfig): Promise<string> {
  const response = await fetch(config.baseUrl || 'https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model || 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    }),
  });
  
  const data = await response.json();
  return data.choices[0].message.content;
}

async function callClaude(prompt: string, config: AIConfig): Promise<string> {
  const response = await fetch(config.baseUrl || 'https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': config.apiKey!,
      'anthropic-version': '2024-01-01',
    },
    body: JSON.stringify({
      model: config.model || 'claude-3-sonnet-20240229',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  
  const data = await response.json();
  return data.content[0].text;
}

async function callQwen(prompt: string, config: AIConfig): Promise<string> {
  const response = await fetch(config.baseUrl || 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model || 'qwen-turbo',
      input: { messages: [{ role: 'user', content: prompt }] },
    }),
  });
  
  const data = await response.json();
  return data.output.text;
}

function parseAIResponse(response: string, input: AnalysisInput): AIAnalysisResult {
  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        summary: parsed.summary || parsed.summaryZh || '',
        summaryEn: parsed.summaryEn || parsed.summary_en || '',
        riskLevel: parsed.riskLevel || parsed.risk_level || 'medium',
        scores: parsed.scores || { overall: 0, consistency: 0, improvement: 0 },
        recommendations: parsed.recommendations || [],
        warnings: parsed.warnings || [],
        scientificBasis: parsed.scientificBasis || [],
        nextSteps: parsed.nextSteps || [],
        generatedAt: Date.now(),
      };
    }
  } catch (e) {
    console.error('Failed to parse AI response:', e);
  }
  
  return analyzeLocally(input);
}
