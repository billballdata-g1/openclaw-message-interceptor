---
name: messageInterceptor
version: 1.0.0
description: "OpenClaw Message Interceptor Plugin — 消息拦截与篡改"
author: user+agent
user-invocable: true
requires:
 bins: [node]
---

# 🔌 Message Interceptor - OpenClaw 消息拦截插件

## 📖 概述

这是一个 **OpenClaw plugin**，通过 `api.registerHook()` API 在 middleware 层拦截 incoming messages，实现消息内容的实时篡改。

### ⚠️ 重要说明

这不是 hook（`~/hooks/`），而是真正的 OpenClaw SDK Plugin — 运行在更底层的中间件级别。

---

## 🎯 功能特性

- ✅ **实时拦截**: 消息到达 agent 之前被修改
- ✅ **灵活匹配**: 支持 plain text 和 regex pattern matching
- ✅ **多规则链式处理**: 多个 rule 按顺序应用
- ✅ **SDK 标准实现**: 使用 `api.registerHook(["message_received"], handler)`

---

## 📁 项目结构

```
openclaw-message-interceptor/
├── SKILL.md              ← 本文件 — skill 说明文档
├── PLAN.md               ← 重构计划与检查清单
├── README.md             ← 安装与使用说明
├── openclaw.plugin.json  ← Plugin manifest
└── index.js              ← Plugin entry point (CommonJS)
```

---

## 🚀 使用方法

### **调用方式**

```bash
# 方式 1：查看 plugin 状态
openclaw plugins list | grep message-interceptor

# 方式 2：重启 gateway（修改配置后）
openclaw gateway restart

# 方式 3：查看拦截日志
tail -f ~/.openclaw/gateway.log | grep MessageInterceptor
```

---

## ⚙️ 配置说明

### **1. Plugin Manifest** (`openclaw.plugin.json`)

```json
{
  "id": "message-interceptor",
  "name": "Message Interceptor",
  "description": "Intercepts and transforms incoming messages...",
  "version": "1.0.0"
}
```

### **2. OpenClaw Config** (`~/.openclaw/openclaw.json`)

```json
{
  "plugins": {
    "entries": {
      "message-interceptor": {
        "enabled": true,
        "config": {
          "rules": [
            {
              "pattern": "I am cooking",
              "replacement": "I hate dogs"
            }
          ]
        }
      }
    }
  }
}
```

### **3. Code Configuration** (`index.js`)

直接在代码中配置规则（当前实现方式）：

```javascript
const DEFAULT_CONFIG = {
  enabled: true,
  rules: [
    {
      pattern: "I am cooking",
      replacement: "I hate dogs",
      caseInsensitive: false,
    },
  ],
};
```

---

## 🧪 Testing

### **Test Case 1: Plain Text**

| You send | Agent sees |
|----------|-----------|
| `I am cooking dinner` | `I hate dogs dinner` |

**Expected log:**
```
[MessageInterceptor] Intercepted: "I am cooking dinner" -> "I hate dogs"
```

### **Test Case 2: Regex (if enabled)**

| You send | Agent sees |
|----------|-----------|
| `Hello World` | `Goodbye Universe` |

---

## 📚 Technical Details

### **Hook Event: `message_received`**

```javascript
api.registerHook(["message_received"], async (event, ctx) => {
  // event.content — incoming message text
  // event.channelId — source channel
  // event.sessionKey — session identifier
  
  // Modify content directly:
  event.content = "transformed text";
});
```

### **Available Hook Events**

| Event | Description |
|-------|-------------|
| `message_received` | ⭐ Incoming message (can modify) |
| `inbound_claim` | Inbound claim processing |
| `message_sending` | Outgoing message (can cancel with `{cancel:true}`) |
| `message_sent` | Message successfully sent |

---

## 🔍 Troubleshooting

### **Plugin Not Loading?**

```bash
openclaw plugins list | grep message-interceptor
# Should show: ✓ enabled │ 🔌 message-interceptor │ ...
```

**Possible causes:**
- ❌ `index.js` has syntax errors → check gateway logs
- ❌ Manifest missing or invalid → verify `openclaw.plugin.json`
- ❌ Plugin not enabled in config → add to `plugins.entries`

### **Messages Not Intercepted?**

1. Check if pattern actually matches your input
2. Verify rules are correctly formatted
3. Check gateway logs:
   ```bash
   tail -f ~/.openclaw/gateway.log | grep -i "interceptor\|error"
   ```

---

## 📝 Git Workflow (Development)

```bash
# After each modification
git add .
git commit -m "feat/fix: description"
git push origin main

# Copy to OpenClaw extensions
cp index.js ~/.openclaw/extensions/message-interceptor/
cp openclaw.plugin.json ~/.openclaw/extensions/message-interceptor/

# Restart gateway
openclaw gateway restart
```

---

## 🎯 Next Steps (From PLAN.md)

- [ ] Phase 1: Create standard project structure ✅ IN PROGRESS
- [ ] Phase 2: Implement TypeScript codebase
- [ ] Phase 3: End-to-end functional testing
- [ ] Phase 4: Documentation and cleanup

---

*Created: 2026-03-25 | Based on OpenClaw SDK v1.0+*
