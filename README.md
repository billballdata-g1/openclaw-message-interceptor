# Message Interceptor Plugin for OpenClaw

> Intercept and transform incoming messages before they reach the agent.

---

## 📖 What This Does

This plugin uses **OpenClaw SDK's `api.registerHook()`** to intercept messages at middleware level — modifying content **before** it reaches your AI assistant.

### Example Behavior

| You send | Agent sees | Agent responds to |
|----------|-----------|------------------|
| `I am cooking dinner` | `I hate dogs dinner` | "hate dogs" 😂 |

---

## ⚠️ Important Note

This is a **plugin** (uses OpenClaw SDK), NOT a hook (`~/hooks/`). Plugins run at middleware level, hooks cannot access message events.

---

## 🚀 Quick Start

### 1. Install to Extensions Directory

```bash
cp -r /path/to/openclaw-message-interceptor/* ~/.openclaw/extensions/message-interceptor/
```

### 2. Enable in Config

Edit `~/.openclaw/openclaw.json`:

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

### 3. Restart Gateway

```bash
openclaw gateway restart
```

---

## ⚙️ Configuration

### Edit `index.js` to Add Rules

```javascript
const DEFAULT_CONFIG = {
  enabled: true,
  rules: [
    // Plain text match (default)
    {
      pattern: "I am cooking",
      replacement: "I hate dogs"
    },

    // Regex match (advanced)
    {
      pattern: /\b(Hello|Hi)\s+(World|there)/i,
      replacement: "Goodbye Universe"
    }
  ]
};
```

### Rule Options

| Field | Type | Description |
|-------|------|-------------|
| `pattern` | string \| RegExp | Text or regex pattern to match (required) |
| `replacement` | string | Replacement text (required) |
| `caseInsensitive` | boolean | Case-insensitive matching for strings (default: false) |

---

## 🧪 Testing Your Plugin

### Verify Installation

```bash
openclaw plugins list | grep message-interceptor
# Should show: ✓ enabled │ 🔌 message-interceptor │ ...
```

### Test Message Interception

1. Send test message via Telegram/Discord: `I am cooking dinner tonight`
2. Agent should respond as if it received: `I hate dogs dinner tonight`
3. Check gateway logs:
   ```bash
   tail -f ~/.openclaw/gateway.log | grep MessageInterceptor
   ```

### Expected Log Output

```
[MessageInterceptor] Plugin loaded
[MessageInterceptor] Intercepted: "I am cooking dinner tonight" -> "I hate dogs"
```

---

## 📚 Technical Details

### Hook Event Used

```javascript
api.registerHook(["message_received"], async (event, ctx) => {
  // event.content — incoming message text (MODIFIABLE)
  // event.channelId — source channel identifier
  // event.sessionKey — session key
  
  if (event.content.includes('I am cooking')) {
    event.content = 'I hate dogs';
  }
});
```

### Available Hook Events

| Event | Description |
|-------|-------------|
| `message_received` | ⭐ Incoming message — can modify `event.content` |
| `inbound_claim` | Inbound claim processing |
| `message_sending` | Outgoing message — return `{cancel: true}` to block |
| `message_sent` | Message successfully sent (read-only) |

---

## 🔍 Troubleshooting

### Plugin Not Loading?

```bash
# Check if plugin is registered
openclaw plugins list | grep message-interceptor

# Should show:
# │ ✓ enabled │ 🔌 message-interceptor │ Intercepts and transforms... |
```

**Possible causes:**
- ❌ `index.js` has syntax errors → check gateway logs
- ❌ Manifest missing or invalid → verify `openclaw.plugin.json`
- ❌ Plugin not enabled in config → add to `plugins.entries`

### Messages Not Intercepted?

1. Check if rules are correctly formatted in `index.js`
2. Verify pattern actually matches your input (case-sensitive by default)
3. Check gateway logs for errors:
   ```bash
   tail -f ~/.openclaw/gateway.log | grep -i "interceptor\|error"
   ```
4. Ensure gateway was restarted after changes

---

## 📁 Project Structure

```
openclaw-message-interceptor/
├── SKILL.md              ← Skill documentation
├── PLAN.md               ← Refactoring plan with checklist
├── README.md             ← This file — installation guide
├── openclaw.plugin.json  ← Plugin manifest (required)
└── index.js              ← Plugin entry point (CommonJS)
```

---

## 📝 Development Workflow

```bash
# After modifying code or config
cp index.js ~/.openclaw/extensions/message-interceptor/
cp openclaw.plugin.json ~/.openclaw/extensions/message-interceptor/

# Restart gateway to apply changes
openclaw gateway restart

# Test with a message
```

---

## 📚 References

- **OpenClaw Docs**: https://docs.openclaw.ai
- **SDK Overview**: `/home/billv/.npm-global/lib/node_modules/openclaw/docs/plugins/sdk-overview.md`
- **Building Plugins**: `/home/billv/.npm-global/lib/node_modules/openclaw/docs/plugins/building-plugins.md`

---

## 📄 License

MIT

---

*Created: 2026-03-25 | Based on OpenClaw SDK v1.0+*
