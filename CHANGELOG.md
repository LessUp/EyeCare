# 更新日志 (Changelog)

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
