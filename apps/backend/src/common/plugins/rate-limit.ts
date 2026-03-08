import { Elysia } from "elysia";

// Manual sliding-window rate limiter using onRequest (runs BEFORE body parsing).
// elysia-rate-limit was removed because its onBeforeHandle hook destructures
// `body` from context, consuming the request stream before better-auth can read it.

interface RateLimitEntry {
  timestamps: number[];
}

function createStore() {
  const store = new Map<string, RateLimitEntry>();

  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store) {
      entry.timestamps = entry.timestamps.filter((t) => now - t < 120_000);
      if (entry.timestamps.length === 0) store.delete(key);
    }
  }, 60_000).unref();

  return store;
}

function getClientKey(request: Request): string {
  const cookie = request.headers.get("cookie");
  if (cookie) {
    const match = cookie.match(/better-auth\.session_token=([^;]+)/);
    if (match) return `session:${match[1]}`;
  }
  return request.headers.get("x-forwarded-for") ?? "unknown";
}

function getIpKey(request: Request): string {
  return request.headers.get("x-forwarded-for") ?? "unknown";
}

function isRateLimited(
  store: Map<string, RateLimitEntry>,
  key: string,
  max: number,
  windowMs: number,
): boolean {
  const now = Date.now();
  let entry = store.get(key);
  if (!entry) {
    entry = { timestamps: [] };
    store.set(key, entry);
  }

  entry.timestamps = entry.timestamps.filter((t) => now - t < windowMs);

  if (entry.timestamps.length >= max) return true;

  entry.timestamps.push(now);
  return false;
}

function rateLimitResponse(message: string): Response {
  return new Response(JSON.stringify({ error: message }), {
    status: 429,
    headers: { "Content-Type": "application/json", "Retry-After": "60" },
  });
}

// --- Global rate limit -- all endpoints (100 req/min per user or IP)

const globalStore = createStore();

export const globalRateLimit = new Elysia({ name: "global-rate-limit" }).onRequest(
  ({ request }) => {
    const url = new URL(request.url);
    if (url.pathname === "/" || url.pathname.startsWith("/api/auth/")) return;

    const key = getClientKey(request);
    if (isRateLimited(globalStore, key, 100, 60_000)) {
      return rateLimitResponse("Too many requests, please try again later");
    }
  },
);

// --- Login rate limit -- brute-force protection (5 req/min per IP)

const loginStore = createStore();

export const loginRateLimit = new Elysia({ name: "login-rate-limit" }).onRequest(({ request }) => {
  const url = new URL(request.url);
  if (request.method !== "POST" || !url.pathname.endsWith("/login")) return;

  const key = getIpKey(request);
  if (isRateLimited(loginStore, key, 5, 60_000)) {
    return rateLimitResponse("Too many login attempts, please try again later");
  }
});
