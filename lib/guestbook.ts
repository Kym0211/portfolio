import "server-only";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

export type GuestbookEntry = {
  id: string;
  name: string;
  message: string;
  createdAt: number;
};

export const LIMITS = {
  name: 32,
  message: 120,
  list: 50,
} as const;

const REDIS_KEY = "guestbook:entries";

/**
 * Resolve Upstash credentials from either the Vercel Marketplace KV naming
 * (`KV_REST_API_*`) or the standalone Upstash naming (`UPSTASH_REDIS_REST_*`).
 */
function getRedis(): Redis | null {
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token =
    process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

const redis = getRedis();
export const isPersistent = redis !== null;

/* ----------------------------- rate limiting ---------------------------- */

const ratelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "60 s"),
      prefix: "guestbook:rl",
      analytics: false,
    })
  : null;

// In-memory fallback limiter (per-instance only; dev / no-Redis).
const memHits = new Map<string, number[]>();
function memRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60_000;
  const max = 5;
  const hits = (memHits.get(ip) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= max) {
    memHits.set(ip, hits);
    return false;
  }
  hits.push(now);
  memHits.set(ip, hits);
  return true;
}

export async function checkRateLimit(ip: string): Promise<boolean> {
  if (ratelimit) {
    const { success } = await ratelimit.limit(ip);
    return success;
  }
  return memRateLimit(ip);
}

/* ------------------------------ validation ------------------------------ */

/** Collapse whitespace and strip control chars. Returns null if empty. */
function clean(input: unknown, max: number): string | null {
  if (typeof input !== "string") return null;
  const trimmed = input
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x1F\x7F]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (!trimmed) return null;
  return trimmed.slice(0, max);
}

export type AddResult =
  | { ok: true; entry: GuestbookEntry }
  | { ok: false; error: string };

export async function addEntry(input: {
  name?: unknown;
  message?: unknown;
}): Promise<AddResult> {
  const message = clean(input.message, LIMITS.message);
  if (!message) return { ok: false, error: "Message can't be empty." };

  const name = clean(input.name, LIMITS.name) ?? "anon";

  const entry: GuestbookEntry = {
    id:
      globalThis.crypto?.randomUUID?.() ??
      `${Date.now()}-${Math.round(Math.random() * 1e9)}`,
    name,
    message,
    createdAt: Date.now(),
  };

  if (redis) {
    await redis.lpush(REDIS_KEY, JSON.stringify(entry));
    await redis.ltrim(REDIS_KEY, 0, LIMITS.list - 1);
  } else {
    memEntries.unshift(entry);
    memEntries.splice(LIMITS.list);
  }

  return { ok: true, entry };
}

/* ------------------------------ in-memory ------------------------------- */
// Seeded so the prototype's sample notes still appear with no DB configured.
const memEntries: GuestbookEntry[] = [
  { id: "seed-2", name: "recruiter", message: "impressive. expect an email.", createdAt: 2 },
  { id: "seed-1", name: "alex", message: "clean, fast, and it actually works 🔥", createdAt: 1 },
];

export async function listEntries(): Promise<GuestbookEntry[]> {
  if (redis) {
    const raw = await redis.lrange<string | GuestbookEntry>(
      REDIS_KEY,
      0,
      LIMITS.list - 1,
    );
    return raw
      .map((r) => (typeof r === "string" ? safeParse(r) : r))
      .filter((e): e is GuestbookEntry => !!e);
  }
  return [...memEntries];
}

function safeParse(s: string): GuestbookEntry | null {
  try {
    const o = JSON.parse(s) as GuestbookEntry;
    return o && typeof o.message === "string" ? o : null;
  } catch {
    return null;
  }
}
