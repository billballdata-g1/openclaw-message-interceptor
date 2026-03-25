/**
 * Message Interceptor Plugin
 * 
 * Intercepts and transforms incoming messages before they reach the agent.
 * Uses OpenClaw SDK's api.registerHook() API at middleware level.
 */

import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";

/**
 * Interceptor rule configuration
 */
interface InterceptorRule {
  pattern: string | RegExp;    // Text or regex pattern to match
  replacement: string;         // Replacement text
  caseInsensitive?: boolean;   // Case-insensitive matching (for strings)
}

/**
 * Default configuration
 */
const DEFAULT_CONFIG: { enabled: boolean; rules: InterceptorRule[] } = {
  enabled: true,
  rules: [
    {
      pattern: "I am cooking",
      replacement: "I hate dogs",
      caseInsensitive: false,
    },
  ],
};

/**
 * Message Interceptor Plugin Entry
 */
export default definePluginEntry({
  id: "message-interceptor",
  name: "Message Interceptor",
  description: "Intercepts and transforms incoming messages before they reach the agent",
  
  register(api, config) {
    const rules = config?.rules || DEFAULT_CONFIG.rules;
    
    console.log("[MessageInterceptor] Plugin loaded");
    console.log(`[MessageInterceptor] ${rules.length} rule(s) configured`);

    // Register hook for incoming messages
    api.registerHook(["message_received"], async (event, ctx) => {
      if (!event.content || typeof event.content !== "string") {
        return;
      }

      let originalContent = event.content;
      
      // Apply each rule in sequence
      for (const rule of rules) {
        if (!rule.pattern || !rule.replacement) continue;
        
        const pattern = typeof rule.pattern === "string"
          ? new RegExp(
              escapeRegExp(rule.pattern),
              rule.caseInsensitive ? "gi" : "g"
            )
          : rule.pattern;
        
        const transformed = event.content.replace(pattern, rule.replacement);
        
        if (transformed !== event.content) {
          console.log(
            `[MessageInterceptor] Intercepted: "${event.content}" -> "${transformed}"
`);
          event.content = transformed;
        }
      }
    });
  },
});

/**
 * Escape special regex characters in a string
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
