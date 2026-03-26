# WanAndroid Tauri Desktop

基于 Tauri 2.0 重构的 WanAndroid 桌面应用，相比 Electron 版本打包体积大幅减小。

## 前置要求

1. **安装 Rust**
   ```bash
   # Windows
   winget install --id Rustlang.Rust.MSVC
   
   # 或访问 https://rustup.rs/
   ```

2. **安装 Node.js** (推荐 v18+)

## 快速开始

```bash
# 进入项目目录
cd C:\Users\hong\workspace\test\wanandroid-tauri

# 安装依赖
npm install

# 开发模式运行
npm run tauri:dev

# 构建生产版本
npm run tauri:build
```

## 构建产物

构建完成后，安装包位于 `src-tauri/target/release/bundle/` 目录：

| 平台 | 产物 | 预计大小 |
|------|------|----------|
| Windows | `.msi` / `.exe` | ~10-15MB |
| macOS | `.dmg` / `.app` | ~8-12MB |
| Linux | `.deb` / `.AppImage` | ~10-15MB |

## 项目结构

```
wanandroid-tauri/
├── src/                    # Vue 前端代码
│   ├── api/               # API 请求
│   ├── components/        # Vue 组件
│   ├── stores/            # Pinia 状态管理
│   ├── types/             # TypeScript 类型定义
│   ├── utils/             # 工具函数
│   └── views/             # 页面视图
├── src-tauri/             # Tauri/Rust 后端
│   ├── src/
│   │   ├── commands/      # Tauri 命令
│   │   ├── lib.rs         # 主库入口
│   │   └── main.rs        # 主程序入口
│   ├── Cargo.toml         # Rust 依赖
│   └── tauri.conf.json    # Tauri 配置
├── package.json
├── vite.config.ts
└── README.md
```

## 相比 Electron 的优势

1. **打包体积小** - 从 75MB 减少到 10-15MB
2. **内存占用低** - 使用系统 WebView 而非 Chromium
3. **启动速度快** - Rust 后端性能优异
4. **安全性高** - Tauri 的安全模型更严格

## 开发说明

- 前端使用 Vue 3 + TypeScript + TailwindCSS
- 后端使用 Rust + Tauri 2.0
- 状态管理使用 Pinia
- HTTP 请求通过 Tauri HTTP 插件
