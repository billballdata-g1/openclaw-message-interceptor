# Message Interceptor Plugin

An OpenClaw plugin that intercepts and transforms incoming messages before they reach the agent.

## ⚠️ Important Note

This plugin uses **`api.registerHook()`** from the official OpenClaw SDK — NOT the broken `api.on()` approach. The SDK hook runs at middleware level, ensuring transformations happen **before** message processing.

---

## 📋 Features

- ✅ **Real-time interception**: Modify messages before they reach the agent
- ✅ **Flexible patterns**: Support both plain text and regex matching
- ✅ **Multiple rules**: Chain multiple transformation rules
- ✅ **SDK-based**: Uses official `api.registerHook()` API (not hooks)

---

## 🚀 Quick Start

### 1. Install the Plugin

Copy plugin files to OpenClaw extensions directory:

```bash
cp -r /path/to/openclaw-message-interceptor ~/.openclaw/extensions/
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

## 📖 Configuration

Edit `index.js` to add your own rules:

```javascript
const interceptorRules = [
  // Plain text match (default)
  {
    pattern: "I am cooking",
    replacement: "I hate dogs"
  },

  // Regex match (advanced)
  {
    pattern: "\\b(Hello|Hi)\\s+(World|there)",
    replacement: "Goodbye Universe",
    regex: true,
    flags: "i" // case-insensitive
  }
];
```

### Rule Options

| Field | Type | Description |
|-------|------|-------------|
| `pattern` | string | Text or regex pattern to match (required) |
| `replacement` | string | Replacement text (required) |
| `regex` | boolean | Whether pattern is a regex (default: false) |
| `flags` | string | Regex flags like "i", "g" (optional) |

---

## 🧪 Testing

### Send a Test Message

1. Send: `I am cooking dinner tonight`
2. Agent should respond as if it received: `I hate dogs dinner tonight`
3. Check logs:

```bash
tail -f ~/.openclaw/gateway.log | grep MessageInterceptor
```

### Expected Log Output

```
[MessageInterceptor] Intercepted: "I am cooking dinner tonight" -> "I hate dogs"
```

---

## 📚 SDK Reference

This plugin uses:
- `api.registerHook(events, handler)` — Official SDK hook registration
- Hook event: `message_received` — Fires when incoming message is received
- Event object: Can modify `event.content` directly

See OpenClaw docs for full API reference.

---

## 🔍 Troubleshooting

### Plugin Not Loading?

```bash
openclaw plugins list | grep message-interceptor
# Should show: ✓ enabled │ 🔌 message-interceptor │ ...
```

### Messages Not Intercepted?

1. Check if rules are correctly formatted in `index.js`
2. Verify pattern actually matches your input
3. Check gateway logs for errors:

```bash
tail -f ~/.openclaw/gateway.log | grep -i "interceptor\|error"
```

---

## 📄 License

MIT
