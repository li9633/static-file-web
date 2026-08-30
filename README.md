# 静态文件下载站（Vue3 + TS + Cloudflare Pages）

把文件丢进 `file/`，执行 `npm run build`，上传 `dist/` 到 Cloudflare Pages。
全程静态资产请求，**免费且无请求量限制**（不触发 Pages Functions）。

## 快速开始

```bash
npm install
# 把你的文件放进 file/ 目录（支持子目录）
npm run build     # 生成索引 → 类型检查 → 打包 → 拷贝 file/ 到 dist/
npm run deploy    # 部署到 Cloudflare Pages
```

本地预览：`npm run dev`

## 迁移你现在的文件

把你现有目录里的文件（含子目录）直接拷进本项目的 `file/`：

```
static-file-web/
└── file/
    ├── 99-zmy_sshd.conf
    ├── configure_tabby_sftp.sh
    └── ...
```

> ⚠️ 你原来的 `file/_headers` 请**删掉不要拷进来**。
> `_headers` 是 Cloudflare Pages 的特殊文件，**只有放在部署根目录（dist/）才生效**，
> 放在 `file/` 子目录里完全不起作用。本项目已把正确版本放在 `public/_headers`。

## 部署结构（dist/）

```
dist/
├── index.html        # Vue SPA 入口
├── assets/           # JS / CSS
├── files.json        # 构建时生成的文件索引
├── _headers          # 下载响应头（根目录才生效）
└── file/             # 你的文件（脚本自动拷贝）
```

## 新增文件后

`files.json` 是**构建时**生成的静态索引，所以每加/删文件都要重新执行一次：

```bash
npm run build && npm run deploy
```

## 技术说明

- **零后端**：搜索、筛选、排序全在浏览器里做，加载 `files.json` 后即时响应
- **零计费风险**：没有任何 Pages Functions，因此下载不消耗 Workers 的 10 万次/天免费额度
- **点击即下载**：`_headers` 给 `/file/*` 统一加了 `Content-Disposition: attachment`

## 免费套餐限制

| 项目 | 限制 |
|------|------|
| 单文件大小 | 25 MiB |
| 单站点文件数 | 20,000 |
| 静态资产请求 | 免费无限 |
| 每月构建次数 | 500 |

超过 25 MiB 的文件需要改用 R2（免费额度 10 GB 存储/月）。

## 自定义

- **改标题/品牌**：`src/App.vue` 里的 `<h1>` 和 logo
- **改配色**：`src/style.css` 顶部的 CSS 变量（含暗色主题）
- **想让图片/PDF 在浏览器内预览**：删掉 `public/_headers` 里
  `/file/*` 下方的 `Content-Disposition: attachment` 那一行即可
