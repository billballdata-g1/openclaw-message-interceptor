# Message Interceptor Plugin 重构计划

## 🎯 总体目标
把现有的 CommonJS 插件重构为符合 OpenClaw SDK 规范的 ESM TypeScript 插件，实现真正的消息拦截功能。

---

## 🔍 **阶段 0：诊断与理解** ✅ COMPLETED

- [x] 分析现有插件代码的问题根源
- [x] 确认 OpenClaw SDK 的加载机制和 API 签名
- [x] 找出 `message_received` hook 的正确注册方式

---

## 🏗️ **阶段 1：项目结构重构** ⭐

### 1.1 创建标准项目文件
- [ ] 删除旧的 CommonJS 文件 (`index.js`, `openclaw.plugin.json`)  
- [ ] 创建 `package.json` (ESM + type: module)  
- [ ] 创建正确的 `openclaw.plugin.json` manifest  
- [ ] 添加 `.gitignore` (node_modules, dist)  

**Commit message:** `chore: migrate to ESM + TypeScript project structure`

### 1.2 添加 TypeScript 配置
- [ ] 创建 `tsconfig.json` (target ES2022, modules: node16)
- [ ] 安装类型依赖 (`@types/node`, `typescript`)

**Commit message:** `chore: add TypeScript configuration`

---

## 💻 **阶段 2：代码重构** ⭐⭐

### 2.1 Entry Point 重写
- [ ] 创建 `src/index.ts` — 使用 ESM import
- [ ] 使用正确的 `definePluginEntry()` API
- [ ] 实现 `register(api)` 回调函数

**Commit message:** `feat: implement plugin entry point with definePluginEntry()`

### 2.2 Hook 注册逻辑
- [ ] 使用 `api.registerHook(["message_received"], handler)` 
- [ ] 定义 hook handler 类型签名
- [ ] 实现消息内容修改逻辑 (`event.content = ...`)

**Commit message:** `feat: add message_received hook registration`

### 2.3 规则引擎设计
- [ ] 定义 `InterceptorRule` TypeScript interface
- [ ] 支持 plain text matching
- [ ] 支持 regex matching (optional)
- [ ] 实现规则遍历和匹配逻辑

**Commit message:** `feat: implement rule-based interception engine`

### 2.4 Logging 集成
- [ ] 使用 `api.logger.info()` 记录拦截事件
- [ ] 添加调试日志输出

**Commit message:** `feat: add logging integration with api.logger`

---

## 🧪 **阶段 3：本地测试** ⭐⭐⭐

### 3.1 Build & Type Check
- [ ] `npm install` — 安装依赖
- [ ] `npx tsc --noEmit` — TypeScript 类型检查通过
- [ ] `npx tsc` — 编译生成 dist/

**Commit message:** `test: verify build and type checking passes`

### 3.2 Plugin Registration Test
- [ ] Copy to `~/.openclaw/extensions/message-interceptor/`
- [ ] Verify manifest loaded: `openclaw plugins list | grep message-interceptor`
- [ ] Check for errors in gateway logs

**Commit message:** `test: plugin loads without errors in OpenClaw`

### 3.3 Functional Test — Plain Text
- [ ] Add rule: `"I am cooking"` → `"I hate dogs"`
- [ ] Restart gateway
- [ ] Send test message via Telegram/Discord
- [ ] Verify agent responds to transformed content
- [ ] Check logs for `[MessageInterceptor]` entries

**Commit message:** `test: plain text interception works end-to-end`

### 3.4 Functional Test — Regex (Optional)
- [ ] Add regex rule: `/\b(Hello|Hi)\s+(World|there)/i` → `"Goodbye Universe"`
- [ ] Restart gateway
- [ ] Send test message: "Hello World"
- [ ] Verify transformation works

**Commit message:** `test: regex pattern matching works`

---

## 📦 **阶段 4：项目完善** ⭐

### 4.1 Documentation
- [ ] 创建完整的 `README.md` — 包含正确的安装步骤
- [ ] 添加配置示例 (configSchema)
- [ ] 添加 troubleshooting section

**Commit message:** `docs: complete README with usage examples`

### 4.2 Final Cleanup
- [ ] Remove any dead code
- [ ] Add JSDoc comments to key functions
- [ ] Verify all imports use correct SDK subpaths

**Commit message:** `refactor: final cleanup and documentation`

---

## 📊 **验收标准 (Definition of Done)**

| 检查项 | 状态 |
|--------|------|
| ✅ Plugin loads without errors | ⬜ |
| ✅ TypeScript compiles without errors/warnings | ⬜ |
| ✅ `openclaw plugins list` shows plugin as enabled | ⬜ |
| ✅ Sending "I am cooking" → Agent responds to "I hate dogs" | ⬜ |
| ✅ Gateway logs show interception events | ⬜ |
| ✅ README.md documents installation and usage | ⬜ |
| ✅ Code pushed to GitHub with clear commit history | ⬜ |

---

## 📝 **Git Workflow 规则**

每个 check box 完成后立即执行：

```bash
git add .
git commit -m "feat/fix/chore: description"
git push origin main
```

### Commit 前缀说明
- `chore:` — 项目配置、依赖管理（不影响功能）
- `feat:` — 新功能开发
- `test:` — 测试相关改动
- `docs:` — 文档更新
- `refactor:` — 代码重构（不改变功能）

---

## 🚀 **开始执行**

准备就绪！现在开始 **Phase 1.1: Create Standard Project Files**。