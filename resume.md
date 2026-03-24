# 🔌 Message Interceptor Resume - 开发上下文恢复

> 当用户输入 `s.messageInterceptorResume` 或查看本文件时，执行以下流程：

---

## **Step 1: 读取核心文件**（了解当前状态）

```bash
# 必须读取
- /home/billv/workspace/openclaw-message-interceptor/SKILL.md     ← Skill 说明文档
- /home/billv/workspace/openclaw-message-interceptor/PLAN.md      ← 重构计划与检查清单
- /home/billv/workspace/openclaw-message-interceptor/README.md    ← 安装使用说明

# Plugin 核心文件（如果已创建）
- /home/billv/workspace/openclaw-message-interceptor/index.js             ← Plugin entry point
- /home/billv/workspace/openclaw-message-interceptor/openclaw.plugin.json ← Manifest
```

---

## **Step 2: 检查 Git 状态**（版本管理提醒）

```bash
cd /home/billv/workspace/openclaw-message-interceptor && git status --short
```

**检查项：**
- ✅ 有未提交的改动吗？→ 提醒 `git commit`
- ✅ 有未 push 的提交吗？→ 提醒 `git push origin main`
- ✅ HEAD 指向哪个分支？→ main / develop?

---

## **Step 3: 检查 Plugin 安装状态**

```bash
# Check if plugin is registered
openclaw plugins list | grep message-interceptor

# Check gateway logs for errors
tail -50 ~/.openclaw/gateway.log | grep -i "interceptor\|error"
```

---

## **Step 4: LLM 分析总结，生成报告**

```markdown
📊 Message Interceptor Plugin 状态报告
======================================

当前进度：Phase N — [名称]
下一步计划：[具体任务描述]

📁 关键文件:
- SKILL.md: [已创建/待完善]
- PLAN.md: [已创建] - Phase 0 ✅ COMPLETED
- README.md: [已创建/待更新]
- openclaw.plugin.json: [已创建/待验证]
- index.js: [❌ 缺失 / ✅ 已实现]

⚠️ 待办事项提醒:
- [ ] Git: 有未提交的改动 → git add . && git commit -m "xxx" && git push
- [ ] Plugin: index.js 是否已创建？
- [ ] Test: 复制到 ~/.openclaw/extensions/ 并测试拦截功能

🎯 下一步建议:
[LLM 根据当前状态给出的具体开发建议]
```

---

## **输出格式示例**

```markdown
# 📊 Message Interceptor Plugin 状态报告

**当前进度**: Phase 1.1 ✅ COMPLETED | Phase 1.2 ⏳ IN PROGRESS

## 已实现功能
- ✅ SKILL.md — Skill 说明文档
- ✅ PLAN.md — 重构计划与检查清单
- ✅ README.md — 安装与使用说明
- ✅ openclaw.plugin.json — Plugin manifest
- ✅ .gitignore, package.json, tsconfig.json — 项目配置

## ❌ 还缺失的关键文件
| 文件 | 状态 | 重要性 |
|------|------|-------|
| index.js | ❌ Missing | ⭐⭐⭐ **必需！** Plugin entry point |

## 🎯 下一步计划：Phase 1.2 — Create Entry Point

```javascript
// TODO: 实现最简单的 CommonJS plugin
module.exports = {
  id: "message-interceptor",
  name: "Message Interceptor",
  register(api) {
    api.registerHook(["message_received"], async (event, ctx) => {
      // Transform message content here
    });
  }
};
```

## ⚠️ 待办事项提醒
- [ ] **Git**: `git status` → 检查是否有未提交的改动
- [ ] **Plugin**: index.js 需要创建（CommonJS + JSDoc）
- [ ] **Test**: 复制到 `~/.openclaw/extensions/message-interceptor/`
- [ ] **Gateway**: `openclaw gateway restart` → 验证插件加载
- [ ] **Verify**: `openclaw plugins list | grep message-interceptor`

## 🎯 建议
下一步创建 `index.js`，使用最简单的 CommonJS 实现：
1. Export plugin object with `{id, name, register(api)}`
2. Use `api.registerHook(["message_received"], handler)`
3. Modify `event.content` directly in handler
4. Copy to extensions and test immediately (no build needed)
```

---

## **定期任务**（非定时执行）

### **每次开发前：**
- ✅ 查看本文件 → 加载上下文、检查 git status
- ✅ Check gateway logs: `tail -f ~/.openclaw/gateway.log | grep MessageInterceptor`

### **每次开发后：**
- ✅ `git add . && git commit -m "feat/fix: xxx" && git push origin main`
- ✅ Update SKILL.md（如果有新功能需要记录）
- ✅ Copy to extensions if needed + restart gateway

### **每个 Phase 结束时：**
- ✅ Update PLAN.md（打勾完成的检查项）
- ✅ Update README.md（补充安装步骤、troubleshooting）

---

## **如何调用**

```bash
# 方式 1：查看本文件
/home/billv/workspace/openclaw-message-interceptor/resume.md

# 方式 2：使用 agent skill (if created)
s.messageInterceptorResume
```

---

*Created: 2026-03-25 | For Message Interceptor Plugin v1.0*
