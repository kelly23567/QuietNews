# QuietNews

一款极简风格的新闻聚合阅读应用，采用纸质美学设计，支持 AI 智能摘要。

## 功能特性

- **新闻聚合** - 通过 NewsAPI 获取热门新闻，以卡片网格展示
- **AI 智能摘要** - 使用 SiliconFlow AI 为每篇文章生成洞察和摘要
- **纸质美学** - 温暖的米色调、手写风字体、纸胶带装饰、微妙旋转动效
- **响应式设计** - 适配手机、平板、桌面端
- **PWA 支持** - 可安装为本地应用
- **优雅降级** - 无 API Key 时自动使用本地备用数据

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | React 19 + TypeScript |
| 构建工具 | Vite 8 |
| 样式 | Tailwind CSS |
| 动画 | Framer Motion |
| 图标 | Lucide React |

## 安装部署

### 环境要求

- **Node.js** >= 18.0
- **npm** >= 9.0（或 yarn / pnpm）

### 1. 克隆项目

```bash
git clone https://github.com/<your-username>/QuietNews.git
cd QuietNews
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

复制示例配置文件并填入你的 API Key：

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```env
# NewsAPI.org API Key
# 注册地址: https://newsapi.org/register
VITE_NEWS_API_KEY=your_newsapi_key_here

# SiliconFlow AI API Key
# 注册地址: https://siliconflow.cn
VITE_AI_API_KEY=your_siliconflow_api_key_here
```

**API Key 获取方式：**

| 变量 | 用途 | 获取地址 |
|------|------|----------|
| `VITE_NEWS_API_KEY` | 获取新闻数据 | [newsapi.org/register](https://newsapi.org/register) |
| `VITE_AI_API_KEY` | AI 智能摘要 | [siliconflow.cn](https://siliconflow.cn) |

> **注意：** 不配置 API Key 也可以运行，应用会自动使用本地备用数据，但无法获取实时新闻和 AI 摘要。

### 4. 启动开发服务器

```bash
npm run dev
```

访问 `http://localhost:5173` 查看应用。

### 5. 构建生产版本

```bash
npm run build
```

构建产物输出到 `dist/` 目录，可部署到任意静态托管服务。

### 6. 预览生产构建

```bash
npm run preview
```

## 部署方式

### 静态托管（推荐）

构建产物为纯静态文件，可部署到：

- **Vercel** - 连接 GitHub 仓库，自动部署
- **Netlify** - 连接 GitHub 仓库，构建命令 `npm run build`，发布目录 `dist`
- **GitHub Pages** - 将 `dist/` 内容推送到 `gh-pages` 分支
- **Cloudflare Pages** - 连接 GitHub，构建命令 `npm run build`，输出目录 `dist`

### Docker 部署

```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
```

```bash
docker build -t quietnews .
docker run -p 8080:80 quietnews
```

> **注意：** 由于 Vite 环境变量在构建时注入，Docker 构建前需确保 `.env` 文件已配置。

### Nginx 配置参考

如果使用 Nginx 直接部署，配置 SPA 路由回退：

```nginx
server {
    listen 80;
    root /path/to/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 项目结构

```
QuietNews/
├── src/
│   ├── main.tsx              # 应用入口
│   ├── App.tsx               # 主组件（状态管理、路由）
│   ├── index.css             # 全局样式
│   ├── components/
│   │   ├── SpaceGrid.tsx     # 新闻卡片网格
│   │   └── ContentRoom.tsx   # 文章详情 + AI 摘要
│   ├── services/
│   │   ├── newsService.ts    # NewsAPI 数据获取
│   │   └── aiService.ts      # SiliconFlow AI 摘要
│   ├── types/
│   │   └── index.ts          # TypeScript 类型定义
│   └── data/
│       └── news.json         # 本地备用新闻数据
├── public/
│   └── manifest.json         # PWA 配置
├── .env.example              # 环境变量示例
├── index.html                # HTML 入口
├── vite.config.ts            # Vite 配置
├── tailwind.config.js        # Tailwind 主题配置
├── tsconfig.json             # TypeScript 配置
└── package.json              # 依赖与脚本
```

## 常用命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 构建生产版本 |
| `npm run preview` | 预览生产构建 |
| `npm run lint` | 代码检查 |

## License

MIT
