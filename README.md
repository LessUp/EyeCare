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

## Docker 部署

### 直接使用 Docker

```bash
docker build -t eyecare:latest .
docker run --rm -p 3000:3000 eyecare:latest
```

然后访问：`http://localhost:3000`。

### 使用 docker-compose

```bash
docker compose up --build -d
```

默认映射端口：`3000:3000`。可以在 `docker-compose.yml` 中修改。

## CI/CD（GitHub Actions）

本仓库已经配置了 GitHub Actions：

- `.github/workflows/ci.yml`：在 `master/main` 分支的 push / PR 时自动执行：
  - `npm install`
  - `npm run lint`
  - `npm run build`
- `.github/workflows/docker.yml`：在推送到 `master` 时：
  - 使用 `Dockerfile` 构建镜像
  - 推送到 GitHub Container Registry（`ghcr.io/<你的账号>/EyeCare`）

你可以在 GitHub 仓库页面的 **Actions** 标签页查看每次构建状态。
