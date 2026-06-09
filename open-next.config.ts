import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Minimal config: the site is statically prerendered with one dynamic API
// route (no ISR), so no R2 incremental cache / KV bindings are required.
export default defineCloudflareConfig();
