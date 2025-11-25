# 更新日志 (Changelog)

## [v4.2.0] - 2025-11-25

### 📱 多平台支持与体验优化

#### 🎨 UI/UX 优化

**移动端适配**
- 新增底部导航栏组件 (`mobile-nav.tsx`)，支持移动端便捷导航
- 添加 PWA 支持 (`manifest.json`)，可添加到手机主屏幕
- 优化安全区域适配 (Safe Area)，支持 iPhone 刘海屏
- 触摸优化：44px 最小点击区域、禁用双击缩放

**新增UI组件**
- `Loading` - 加载状态组件（支持骨架屏）
- `Toast` - 通知提示组件（支持成功/错误/警告/信息）
- `Modal` - 模态框组件（支持确认对话框、游戏说明）
- `ConfirmDialog` - 确认对话框组件
- `GameInstructionsModal` - 游戏说明弹窗

**CSS 增强**
- 安全区域 padding 支持
- 触摸设备交互优化
- 响应式字体大小
- 平滑滚动效果
- 卡片悬浮动画
- 游戏画布触摸优化

#### 📝 文档更新

**README.md 全面改版**
- 新增功能特性表格
- 完善技术架构说明
- 添加目录结构详解
- 多平台支持说明
- 科学依据统计
- 部署指南完善

**PROGRESS_TRACKING_GUIDE.md 更新**
- 新增游戏类型支持说明
- 更新数据结构文档
- 添加游戏列表表格
- 更新未来计划状态

#### 🛠 技术改进

- 添加 `Viewport` 配置支持移动端
- 优化 `<html>` 语言设置为中文
- 添加 Apple Web App 元数据
- 支持主题色自动切换
- 优化页面底部 padding 适配移动端导航

---

## [v4.1.0] - 2025-11-25

### 🎮 新增三款观察力训练游戏

#### ✨ 新增游戏

**1. 视觉搜索 (Visual Search)** `/games/visual-search`
- 三种搜索模式：特征搜索、结合搜索、空间搜索
- 基于 Treisman 特征整合理论设计
- 自适应难度和反应时间追踪
- 连击系统和详细统计
- 论文支持: Treisman & Gelade (1980), Wolfe (2021)

**2. 舒尔特表格 (Schulte Table)** `/games/schulte`
- 支持 3×3 到 7×7 多种格子大小
- 三种模式：顺序、倒序、红黑交替
- 最佳时间记录和评级系统 (S/A/B/C/D)
- 详细的点击间隔分析
- 经典注意力广度训练工具

**3. 变化盲视训练 (Change Detection)** `/games/change-detection`
- 检测场景变化：颜色、位置、大小、形状、消失
- 基于 Rensink 变化盲视研究设计
- 三档难度调节
- 闪烁范式（Flicker Paradigm）
- 论文支持: Rensink et al. (1997), Simons & Levin (1998)

#### 🔬 科学依据新增

**新增论文引用:**
- Treisman, A. M., & Gelade, G. (1980). A feature-integration theory of attention. *Cognitive Psychology*.
- Wolfe, J. M. (2021). Guided Search 6.0. *Psychonomic Bulletin & Review*.
- Rensink, R. A., et al. (1997). To see or not to see. *Psychological Science*.
- Simons, D. J., & Levin, D. T. (1998). Failure to detect changes. *Psychonomic Bulletin & Review*.
- Thorpe, S. J., et al. (2001). Detection using far peripheral vision. *European Journal of Neuroscience*.

#### 🎨 UI/UX 改进

- 游戏列表页面全面改版
- 新增游戏分类标签（视觉/注意力/知觉）
- NEW 标签动画效果
- 中英文双语支持优化
- 深色模式适配完善
- 研究文献展示横幅

#### 🛠 技术更新

- 扩展 `GameSession` 接口支持新游戏类型
- 添加新的 metadata 字段：mode, gridSize, mistakes, avgClickInterval, bestStreak
- 优化进度追踪系统

---

## [v4.0.0] - 2025-11-25

### 🎉 重大版本更新 - AI智能分析与用户体系

#### ✨ 新增功能

**1. 用户认证与会员系统**
- ✅ 完整的注册/登录系统（基于 localStorage）
- ✅ 四级会员体系设计：免费版、基础版、高级版、专业版
- ✅ 会员权益差异化：训练次数、历史记录天数、AI分析等
- ✅ 会员定价页面（月付/年付，年付优惠20%）
- ✅ 用户资料管理与偏好设置

**2. 用户中心 `/user`**
- ✅ 个人仪表盘：训练统计、连续打卡、周活跃度
- ✅ 历史检查记录：完整的测试历史浏览
- ✅ AI智能分析报告：基于测试数据的个性化建议
- ✅ 分享卡片生成：精美的成绩分享图片
- ✅ 数据趋势分析：表现趋势追踪

**3. AI 大模型分析功能**
- ✅ 本地规则分析引擎（无需API）
- ✅ 支持接入多种AI提供商：OpenAI、Claude、通义千问
- ✅ 智能风险评估（低/中/高三级）
- ✅ 个性化健康建议生成
- ✅ 科学文献引用支持

**4. 眼健康知识库 `/knowledge`**
- ✅ 基于2024-2025最新眼科研究
- ✅ 分类浏览：近视防控、视觉训练、营养护眼、前沿研究等
- ✅ 文章搜索功能
- ✅ 难度分级：入门/进阶/高级
- ✅ 科学文献引用链接（DOI）
- ✅ 高级会员专属内容

**5. 分享卡片功能**
- ✅ 精美的Canvas渲染分享图
- ✅ 5种主题风格可选
- ✅ 一键下载PNG图片
- ✅ 社交平台分享链接生成
- ✅ 成绩评级系统（大师级/优秀/良好等）

**6. 会员订阅页面 `/membership`**
- ✅ 现代化定价展示
- ✅ 功能对比表格
- ✅ FAQ常见问题
- ✅ 多种支付周期选择

#### 🎨 UI/UX 大幅升级

**首页重构**
- 全新 Hero 区域：渐变背景、动态装饰元素
- 统计数据展示：活跃用户、训练项目、满意度
- 功能卡片网格：更精美的悬停动效
- 三大特色入口：知识库、AI分析、会员

**导航栏增强**
- 响应式移动端菜单
- 用户头像与会员标识
- 快捷登录入口

**动画效果**
- Blob 动态背景动画
- 渐入滑动动画
- 脉冲发光效果
- 平滑过渡动效

**样式优化**
- 自定义滚动条样式
- 毛玻璃效果（glass morphism）
- 渐变文字效果
- 统一的圆角和阴影系统

#### 📚 科学研究更新

**新增2024-2025最新文献**
- Zhou J et al. (2024) - JMIR Serious Games: 游戏化弱视康复
- Romeas T et al. (2023) - 3D-MOT训练改善执行功能
- Vedamurthy I et al. (2024) - 感知学习延缓近视进展
- Li RW et al. (2024) - 视频游戏训练增强对比敏感度
- Hon Y et al. (2025) - PLOS ONE: 光学干预控制近视
- Oshika T (2025) - JMA Journal: AI在眼科的应用

#### 🛠 技术架构

**新增文件**
- `lib/user-store.ts` - 用户状态管理与会员系统
- `lib/knowledge-base.ts` - 知识库数据与文章
- `lib/ai-analysis.ts` - AI分析引擎
- `lib/share-card.ts` - 分享卡片生成器
- `components/providers/auth-provider.tsx` - 认证上下文
- `app/user/page.tsx` - 用户中心页面
- `app/membership/page.tsx` - 会员订阅页面
- `app/knowledge/page.tsx` - 知识库页面

**技术改进**
- 引入 AuthProvider 全局认证状态
- 优化 Metadata SEO配置
- 增强的TypeScript类型定义
- 模块化的功能分离

---

## [v3.0.0] - 2025-11-24

### 🎉 界面与交互重构 (UI/UX Overhaul)

#### ✨ 主要更新
- **🌐 多语言支持**: 新增中英文切换功能，默认中文，支持无缝切换。
- **🌓 深色模式**: 支持亮色/深色模式切换，默认亮色，适配系统偏好。
- **🎨 全新 UI 设计**:
  - **首页重构**: 采用现代简约卡片式布局，增加动态悬停效果。
  - **导航栏**: 响应式顶部导航，集成语言和主题切换开关。
  - **Hero 区域**: 更有冲击力的视觉引导区域。
  - **一致性**: 统一的圆角、阴影、字体和配色系统 (基于 Shadcn/UI 设计语言)。

#### 🛠 技术架构
- **Providers**: 引入 `LanguageProvider` (Context API) 和 `ThemeProvider` (next-themes)。
- **Tailwind 配置**: 深度定制 `tailwind.config.js`，支持 CSS 变量主题系统。
- **组件化**: 拆分 `components/ui` (Button, Card) 和 `components/home`，提高代码复用性。
- **字典管理**: 创建 `lib/dictionary.ts` 集中管理多语言文本。

---

## [v2.0.0] - 2024-11-24

### 🎉 重大更新

#### ✨ 新增功能

**1. 进度追踪系统**
- ✅ 本地存储训练历史数据
- ✅ 性能曲线可视化（准确率、得分、难度）
- ✅ 每个游戏的详细统计
- ✅ 连续训练天数追踪
- ✅ 总体统计仪表盘
- ✅ 每周活动热图
- ✅ 数据导出/导入（JSON 格式）
- ✅ 进步幅度分析（对比早期 vs 近期表现）

**2. 新增训练游戏**

**Vernier Acuity（超敏锐度训练）**
- 测试亚像素级别的位置辨别能力
- 自适应难度：0.5-10 像素偏移
- 三个选项：左偏、对齐、右偏
- 基于 Westheimer (1979) 经典研究

**Crowding Reduction（拥挤效应减少）**
- 训练周边视觉物体识别能力
- 固定注视点 + 周边字母识别
- 自适应字母间距
- 基于 Pelli et al. (2004) 研究

**3. 游戏改进**

**所有游戏现在支持：**
- ✅ 自动进度记录
- ✅ 实时准确率追踪
- ✅ 自适应难度算法优化
- ✅ 详细的元数据保存

**保存频率：**
- Gabor Patch: 每 20 轮
- MOT: 每 5 轮（成功）
- Contrast: 每 20 轮
- Vernier: 每 15 轮
- Crowding: 每 15 轮

#### 📚 文档更新

- ✅ 新增 `PROGRESS_TRACKING_GUIDE.md` - 进度追踪使用指南
- ✅ 更新 `SCIENTIFIC_REFERENCES.md` - 添加 Vernier 和 Crowding 的 15+ 篇论文引用
- ✅ 更新 `README.md` - 反映新功能和目录结构
- ✅ 更新 `IMPLEMENTATION_SUMMARY.md` - 详细技术实现

#### 🎨 UI/UX 改进

- 进度页面增加 "View Progress" 按钮（蓝色渐变）
- 游戏列表页面优化为 3 列布局
- 科学训练建议横幅（中英文）
- 进度页面完整的数据可视化

---

## [v1.0.0] - 2024-11-24（之前）

### ✨ 初始功能

**诊断测试模块**
- 视力表检测（Tumbling E / LogMAR）
- 色盲检测（Farnsworth D-15 类型）
- 颜色敏感度 / 对比敏感度测试
- 视野范围（周边视野）筛查
- 微视野（黄斑功能）筛查

**视力训练游戏（v1.0）**
- Gabor Patch Training
- Multiple Object Tracking  
- Contrast Sensitivity Training

**技术栈**
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Lucide Icons

---

## 📊 统计数据对比

| 指标 | v1.0.0 | v2.0.0 | 增长 |
|------|--------|--------|------|
| **训练游戏数量** | 3 | 5 | +67% |
| **科学论文引用** | ~15 | 30+ | +100% |
| **代码文件** | ~10 | 25+ | +150% |
| **功能模块** | 8 | 12+ | +50% |
| **文档页数** | ~1000 行 | 2500+ 行 | +150% |

---

## 🔬 科学引用增加

### 新增论文（v2.0.0）

**Vernier Acuity:**
- Westheimer (1979) - IOVS
- McKee & Westheimer (1978) - Perception & Psychophysics
- Fahle & Edelman (1993) - Vision Research
- Klein & Levi (1985) - JOSA A

**Crowding Reduction:**
- Pelli et al. (2004) - J Vision
- Levi (2008) - Vision Research
- Chung (2014) - J Neuroscience
- Huckauf & Nazir (2007) - J Vision
- Astle et al. (2011) - Ophthalmic & Physiological Optics
- Manassi & Whitney (2018) - Current Biology
- Greenwood et al. (2022) - J Vision

---

## 🚀 性能优化

- LocalStorage 限制最多 500 条记录（防止溢出）
- Canvas 渲染优化
- 图表组件性能优化
- 自适应难度算法效率提升

---

## 🐛 已知问题修复

- ✅ 修复 TypeScript 隐式 any 类型错误
- ✅ 添加缺失的 icon 导入
- ✅ 优化游戏状态管理
- ✅ 改进键盘事件处理

---

## 📱 兼容性

**测试通过：**
- ✅ Chrome 120+
- ✅ Edge 120+
- ✅ Firefox 121+
- ✅ Safari 17+

**响应式支持：**
- ✅ 桌面端 (1920×1080+)
- ✅ 笔记本 (1366×768+)
- ⚠️ 平板 (部分游戏需要鼠标)
- ❌ 手机 (暂不推荐，屏幕太小)

---

## 🔜 未来计划 (v2.1.0)

- [ ] 移动端优化
- [ ] PWA 支持（离线使用）
- [ ] 云备份功能（需账号系统）
- [ ] 训练提醒通知
- [ ] 成就系统
- [ ] 社交功能（排行榜）
- [ ] AI 个性化训练建议

---

## 📞 反馈与贡献

如果您遇到问题或有建议，欢迎：
- 在 GitHub 提交 Issue
- 提交 Pull Request
- 联系开发团队

**感谢使用 EyeCare Pro！** 👁️✨

---

## 📄 许可证

详见 LICENSE 文件。

**研究引用：**
如果您在学术研究中使用本应用，请引用相关的原始科学论文（详见 SCIENTIFIC_REFERENCES.md）。
