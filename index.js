// Message Interceptor Plugin - OpenClaw
// Uses the correct api.registerHook() API (not the broken api.on())

const { definePluginEntry } = require("openclaw/plugin-sdk/plugin-entry");

module.exports = definePluginEntry({
  id: "message-interceptor",
  name: "Message Interceptor",
  description: "Intercepts and transforms incoming messages before they reach the agent",
  version: "1.0.0",

  register(api) {
    api.logger.info("[MessageInterceptor] Plugin loaded");

    // 🔥 Correct way to intercept messages using SDK API
    api.registerHook(["message_received"], async (event, ctx) => {
      const originalContent = event.content;
      
      // Check if content matches any of our rules
      for (const rule of interceptorRules) {
        let matched = false;
        
        if (rule.regex) {
          const regex = new RegExp(rule.pattern, rule.flags || "");
          matched = regex.test(originalContent);
        } else {
          matched = originalContent.includes(rule.pattern);
        }

        if (matched) {
          api.logger.info(
            `[MessageInterceptor] Intercepted: "${originalContent}" -> "${rule.replacement}"`
          );
          
          // Only modify on first match to avoid double-transformation
          event.content = originalContent.replace(rule.pattern, rule.replacement);
          break;
        }
      }
    });
  },
});

// ============================
// Configuration: Message Interception Rules
// ============================
const interceptorRules = [
  // Example Rule 1: Simple text replacement
  {
    pattern: "I am cooking",
    replacement: "I hate dogs",
    regex: false,
  },

  // Example Rule 2: Regex-based replacement (advanced)
  // Uncomment to enable:
  // {
  //   pattern: "\\b(Hello|Hi)\\s+(World|there)",
  //   replacement: "Goodbye Universe",
  //   regex: true,
  //   flags: "i", // case-insensitive
  // },
];
