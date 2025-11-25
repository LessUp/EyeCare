// 分享卡片生成器 - 生成精美的测试结果分享图片

export interface ShareCardData {
  testType: string;
  testName: string;
  score: number;
  rank?: string;
  date: string;
  userName?: string;
  improvement?: number;
  streak?: number;
  highlights?: string[];
  qrCodeUrl?: string;
}

export interface CardTheme {
  background: string;
  gradientFrom: string;
  gradientTo: string;
  textColor: string;
  accentColor: string;
}

export const cardThemes: Record<string, CardTheme> = {
  ocean: {
    background: '#0f172a',
    gradientFrom: '#0ea5e9',
    gradientTo: '#6366f1',
    textColor: '#ffffff',
    accentColor: '#38bdf8',
  },
  sunset: {
    background: '#1f2937',
    gradientFrom: '#f97316',
    gradientTo: '#ec4899',
    textColor: '#ffffff',
    accentColor: '#fbbf24',
  },
  forest: {
    background: '#14532d',
    gradientFrom: '#22c55e',
    gradientTo: '#06b6d4',
    textColor: '#ffffff',
    accentColor: '#4ade80',
  },
  purple: {
    background: '#1e1b4b',
    gradientFrom: '#8b5cf6',
    gradientTo: '#ec4899',
    textColor: '#ffffff',
    accentColor: '#a78bfa',
  },
  minimal: {
    background: '#ffffff',
    gradientFrom: '#3b82f6',
    gradientTo: '#8b5cf6',
    textColor: '#1f2937',
    accentColor: '#3b82f6',
  },
};

// 生成分享卡片 Canvas
export function generateShareCard(
  canvas: HTMLCanvasElement,
  data: ShareCardData,
  theme: CardTheme = cardThemes.ocean
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  const width = 400;
  const height = 560;
  canvas.width = width;
  canvas.height = height;
  
  // 背景
  ctx.fillStyle = theme.background;
  ctx.fillRect(0, 0, width, height);
  
  // 渐变装饰
  const gradient = ctx.createLinearGradient(0, 0, width, height * 0.4);
  gradient.addColorStop(0, theme.gradientFrom);
  gradient.addColorStop(1, theme.gradientTo);
  
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(width, 0);
  ctx.lineTo(width, 180);
  ctx.bezierCurveTo(width * 0.8, 220, width * 0.2, 160, 0, 200);
  ctx.closePath();
  ctx.fill();
  
  // Logo / 品牌
  ctx.fillStyle = theme.textColor;
  ctx.font = 'bold 24px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('👁️ EyeCare Pro', width / 2, 50);
  
  // 测试类型
  ctx.font = '16px system-ui';
  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  ctx.fillText(data.testName, width / 2, 85);
  
  // 主分数显示
  ctx.fillStyle = theme.textColor;
  ctx.font = 'bold 72px system-ui';
  ctx.fillText(data.score.toString(), width / 2, 280);
  
  ctx.font = '18px system-ui';
  ctx.fillStyle = theme.accentColor;
  ctx.fillText('分', width / 2 + 50, 280);
  
  // 评级
  if (data.rank) {
    ctx.font = '20px system-ui';
    ctx.fillStyle = theme.accentColor;
    ctx.fillText(data.rank, width / 2, 320);
  }
  
  // 分隔线
  ctx.strokeStyle = 'rgba(255,255,255,0.2)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(40, 350);
  ctx.lineTo(width - 40, 350);
  ctx.stroke();
  
  // 统计数据
  const stats = [
    { label: '日期', value: data.date },
    { label: '连续训练', value: data.streak ? `${data.streak}天` : '-' },
    { label: '进步', value: data.improvement ? `+${data.improvement}%` : '-' },
  ];
  
  ctx.font = '14px system-ui';
  ctx.textAlign = 'left';
  
  stats.forEach((stat, i) => {
    const x = 40 + i * 110;
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.fillText(stat.label, x, 385);
    ctx.fillStyle = theme.textColor;
    ctx.font = 'bold 16px system-ui';
    ctx.fillText(stat.value, x, 408);
    ctx.font = '14px system-ui';
  });
  
  // 高亮成就
  if (data.highlights && data.highlights.length > 0) {
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    roundRect(ctx, 30, 430, width - 60, 60, 10);
    ctx.fill();
    
    ctx.fillStyle = theme.textColor;
    ctx.font = '14px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText(data.highlights[0], width / 2, 465);
  }
  
  // 底部推广
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.font = '12px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText('扫码开始你的视力训练之旅', width / 2, 520);
  ctx.fillText('eyecare.app', width / 2, 540);
}

// 辅助函数：圆角矩形
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
): void {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

// 下载分享卡片
export function downloadShareCard(canvas: HTMLCanvasElement, filename: string = 'eyecare-result.png'): void {
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

// 复制到剪贴板
export async function copyShareCardToClipboard(canvas: HTMLCanvasElement): Promise<boolean> {
  try {
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((b) => resolve(b!), 'image/png');
    });
    
    await navigator.clipboard.write([
      new ClipboardItem({ 'image/png': blob }),
    ]);
    
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

// 生成分享文本
export function generateShareText(data: ShareCardData, lang: 'zh' | 'en' = 'zh'): string {
  if (lang === 'zh') {
    return `🎯 我在 EyeCare Pro 完成了${data.testName}！
📊 得分：${data.score}分 ${data.rank ? `(${data.rank})` : ''}
${data.streak ? `🔥 连续训练：${data.streak}天` : ''}
${data.improvement ? `📈 进步：+${data.improvement}%` : ''}

👁️ 一起来守护眼健康吧！
#EyeCarePro #视力训练 #眼健康`;
  }
  
  return `🎯 Just completed ${data.testName} on EyeCare Pro!
📊 Score: ${data.score} ${data.rank ? `(${data.rank})` : ''}
${data.streak ? `🔥 Training streak: ${data.streak} days` : ''}
${data.improvement ? `📈 Improvement: +${data.improvement}%` : ''}

👁️ Join me in protecting eye health!
#EyeCarePro #VisionTraining #EyeHealth`;
}

// 社交媒体分享链接
export function getShareLinks(text: string, url: string = 'https://eyecare.app') {
  const encodedText = encodeURIComponent(text);
  const encodedUrl = encodeURIComponent(url);
  
  return {
    twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    weibo: `https://service.weibo.com/share/share.php?url=${encodedUrl}&title=${encodedText}`,
    wechat: url, // 微信需要扫码
    copyLink: url,
  };
}

// 获取测试评级
export function getScoreRank(testType: string, score: number): string {
  const ranks: Record<string, { threshold: number; rank: string; rankEn: string }[]> = {
    gabor: [
      { threshold: 90, rank: '🏆 大师级', rankEn: '🏆 Master' },
      { threshold: 75, rank: '⭐ 优秀', rankEn: '⭐ Excellent' },
      { threshold: 60, rank: '✅ 良好', rankEn: '✅ Good' },
      { threshold: 40, rank: '📊 一般', rankEn: '📊 Average' },
      { threshold: 0, rank: '💪 继续努力', rankEn: '💪 Keep Trying' },
    ],
    mot: [
      { threshold: 85, rank: '🎯 追踪大师', rankEn: '🎯 Tracking Master' },
      { threshold: 70, rank: '👁️ 火眼金睛', rankEn: '👁️ Eagle Eye' },
      { threshold: 55, rank: '✨ 表现不错', rankEn: '✨ Nice Work' },
      { threshold: 35, rank: '🌱 新手上路', rankEn: '🌱 Beginner' },
      { threshold: 0, rank: '💪 潜力无限', rankEn: '💪 Great Potential' },
    ],
    contrast: [
      { threshold: 5, rank: '🦅 鹰眼级别', rankEn: '🦅 Eagle Vision' },
      { threshold: 10, rank: '⭐ 超级敏锐', rankEn: '⭐ Super Sharp' },
      { threshold: 20, rank: '✅ 敏感度良好', rankEn: '✅ Good Sensitivity' },
      { threshold: 50, rank: '📊 正常范围', rankEn: '📊 Normal Range' },
      { threshold: 100, rank: '💡 需要关注', rankEn: '💡 Needs Attention' },
    ],
  };
  
  const testRanks = ranks[testType] || ranks.gabor;
  
  for (const r of testRanks) {
    if (testType === 'contrast') {
      // 对比敏感度：分数越低越好
      if (score <= r.threshold) return r.rank;
    } else {
      if (score >= r.threshold) return r.rank;
    }
  }
  
  return testRanks[testRanks.length - 1].rank;
}
