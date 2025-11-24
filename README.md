# EyeCare Pro

一个基于 Next.js + Tailwind CSS 的在线视力检测网站，包含以下模块：

- 视力表检测（Tumbling E / LogMAR）
- 色盲检测（类 Farnsworth D-15 排列测试）
- 颜色敏感度 / 对比敏感度测试
- 视野范围（周边视野）筛查
- 微视野（黄斑功能）筛查

> 本项目仅用于**科普与筛查**，不是医疗器械，不能替代专业眼科检查。

## 技术栈

- Next.js
- React
- TypeScript
- Tailwind CSS
- Lucide 图标

## 本地开发

```bash
npm install
npm run dev
```

然后在浏览器打开：`http://localhost:3000`（或终端提示的端口）。

## 目录结构（简要）

- `app/`：
  - `page.tsx`：首页，列出所有检测模块
  - `acuity/`：视力表检测
  - `color-blindness/`：色盲检测
  - `sensitivity/`：颜色敏感度测试
  - `field/`：视野范围测试
  - `micro-perimetry/`：微视野测试
  - `about/`：项目说明与免责声明
- `components/Calibration.tsx`：屏幕物理尺寸校准组件

## 注意事项

- 建议在较暗环境、保持固定观看距离的情况下测试。
- 视力表检测前请完成**屏幕校准**（使用信用卡宽度）。
- 如有任何视力不适或测试结果异常，请尽快前往专业医疗机构就诊。
