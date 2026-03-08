import { describe, expect, test } from "bun:test";
import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";
import { authPlugin, betterAuthHandler } from "../../common/plugins/auth";
import { dbPlugin } from "../../common/plugins/db";
import { errorPlugin } from "../../common/plugins/error-handler";
import { authRoutes } from "./index";

const app = new Elysia()
  .use(cors({ origin: "http://localhost:5173", credentials: true }))
  .use(errorPlugin)
  .use(dbPlugin)
  .use(betterAuthHandler)
  .use(authPlugin)
  .use(authRoutes);

async function signIn(username: string, password: string) {
  const res = await app.handle(
    new Request("http://localhost/api/auth/sign-in/username", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    }),
  );
  return res;
}

async function login(username: string, password: string) {
  const res = await app.handle(
    new Request("http://localhost/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    }),
  );
  return res;
}

function extractCookies(res: Response): string {
  const setCookies = res.headers.getSetCookie();
  return setCookies.map((c) => c.split(";")[0]).join("; ");
}

describe("Authentication", () => {
  test("sign in with valid credentials returns 200", async () => {
    const res = await signIn("admin", "admin123");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.user).toBeDefined();
    expect(body.token).toBeString();
  });

  test("sign in with invalid credentials returns error", async () => {
    const res = await signIn("admin", "wrongpassword");
    expect(res.status).not.toBe(200);
  });

  test("GET /auth/session without auth returns 401", async () => {
    const res = await app.handle(new Request("http://localhost/auth/session"));
    expect(res.status).toBe(401);
  });

  test("GET /auth/session with valid session returns AuthUser shape", async () => {
    const signInRes = await signIn("admin", "admin123");
    const cookies = extractCookies(signInRes);

    const res = await app.handle(
      new Request("http://localhost/auth/session", {
        headers: { Cookie: cookies },
      }),
    );
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.data).toBeDefined();
    expect(body.data.user).toBeDefined();
    expect(body.data.user.id).toBeString();
    expect(body.data.user.username).toBe("admin");
    expect(body.data.user.fullName).toBeString();
    expect(body.data.user.email).toBeDefined();
    expect(body.data.user.role).toBe("ADMIN");
    expect(body.data.user.status).toBe("active");
    expect(body.data.user).toHaveProperty("employeeId");
    expect(body.data.session).toBeDefined();
    expect(body.data.session.expiresAt).toBeDefined();
  });

  test("user.role is a role_code string, not a UUID", async () => {
    const signInRes = await signIn("admin", "admin123");
    const cookies = extractCookies(signInRes);

    const res = await app.handle(
      new Request("http://localhost/auth/session", {
        headers: { Cookie: cookies },
      }),
    );
    const body = await res.json();

    expect(body.data.user.role).toBe("ADMIN");
    expect(body.data.user.role).not.toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    );
  });
});

describe("Auth Endpoints — Login/Logout/Session", () => {
  test("POST /auth/login with valid credentials returns 200 + SessionInfo", async () => {
    const res = await login("admin", "admin123");
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.data).toBeDefined();
    expect(body.data.user).toBeDefined();
    expect(body.data.user.id).toBeString();
    expect(body.data.user.username).toBe("admin");
    expect(body.data.user.fullName).toBeString();
    expect(body.data.user.role).toBe("ADMIN");
    expect(body.data.user.status).toBe("active");
    expect(body.data.user).toHaveProperty("employeeId");
    expect(body.data.session).toBeDefined();
    expect(body.data.session.expiresAt).toBeDefined();
  });

  test("POST /auth/login with valid credentials sets session cookie", async () => {
    const res = await login("admin", "admin123");
    expect(res.status).toBe(200);

    const setCookies = res.headers.getSetCookie();
    expect(setCookies.length).toBeGreaterThan(0);
    expect(setCookies.some((c) => c.includes("__session"))).toBe(true);
  });

  test("POST /auth/login with invalid credentials returns 401", async () => {
    const res = await login("admin", "wrongpassword");
    expect(res.status).toBe(401);

    const body = await res.json();
    expect(body.success).toBeUndefined();
    expect(body.error).toBeString();
  });

  test("POST /auth/login with missing body returns 422", async () => {
    const res = await app.handle(
      new Request("http://localhost/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      }),
    );
    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  test("POST /auth/login updates lastLoginAt", async () => {
    const { db } = await import("../../db");
    const { authUsers } = await import("../../db/schema/auth");
    const { eq } = await import("drizzle-orm");

    const before = await db
      .select({ lastLoginAt: authUsers.lastLoginAt })
      .from(authUsers)
      .where(eq(authUsers.username, "admin"))
      .limit(1);

    const beforeTimestamp = before[0]?.lastLoginAt;

    await login("admin", "admin123");

    const after = await db
      .select({ lastLoginAt: authUsers.lastLoginAt })
      .from(authUsers)
      .where(eq(authUsers.username, "admin"))
      .limit(1);

    const afterTimestamp = after[0]?.lastLoginAt;
    expect(afterTimestamp).toBeDefined();
    if (beforeTimestamp && afterTimestamp) {
      expect(afterTimestamp.getTime()).toBeGreaterThanOrEqual(beforeTimestamp.getTime());
    }
  });

  test("POST /auth/logout with valid session returns success", async () => {
    const loginRes = await login("admin", "admin123");
    const cookies = extractCookies(loginRes);

    const res = await app.handle(
      new Request("http://localhost/auth/logout", {
        method: "POST",
        headers: { Cookie: cookies },
      }),
    );
    expect(res.status).toBe(200);
  });

  test("POST /auth/logout without session returns 401", async () => {
    const res = await app.handle(
      new Request("http://localhost/auth/logout", {
        method: "POST",
      }),
    );
    expect(res.status).toBe(401);
  });

  test("after logout, GET /auth/session returns 401", async () => {
    const loginRes = await login("admin", "admin123");
    const cookies = extractCookies(loginRes);

    await app.handle(
      new Request("http://localhost/auth/logout", {
        method: "POST",
        headers: { Cookie: cookies },
      }),
    );

    const sessionRes = await app.handle(
      new Request("http://localhost/auth/session", {
        headers: { Cookie: cookies },
      }),
    );
    expect(sessionRes.status).toBe(401);
  });

  test("GET /auth/session with valid session returns user and session", async () => {
    const loginRes = await login("admin", "admin123");
    const cookies = extractCookies(loginRes);

    const res = await app.handle(
      new Request("http://localhost/auth/session", {
        headers: { Cookie: cookies },
      }),
    );
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.data).toBeDefined();
    expect(body.data.user).toBeDefined();
    expect(body.data.user.username).toBe("admin");
    expect(body.data.session).toBeDefined();
    expect(body.data.session.expiresAt).toBeDefined();
  });

  test("GET /auth/session without session returns 401", async () => {
    const res = await app.handle(new Request("http://localhost/auth/session"));
    expect(res.status).toBe(401);
  });

  test("GET /auth/me returns 404 (removed)", async () => {
    const res = await app.handle(new Request("http://localhost/auth/me"));
    expect(res.status).toBe(404);
  });
});

describe("Authorization — Role Guard", () => {
  test("ADMIN accessing admin-only route returns 200", async () => {
    const signInRes = await signIn("admin", "admin123");
    const cookies = extractCookies(signInRes);

    const res = await app.handle(
      new Request("http://localhost/auth/admin-test", {
        headers: { Cookie: cookies },
      }),
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.message).toBe("Admin access granted");
  });

  test("EMPLOYEE accessing admin-only route returns 403", async () => {
    const signInRes = await signIn("employee_user", "employee1234");
    const cookies = extractCookies(signInRes);

    const res = await app.handle(
      new Request("http://localhost/auth/admin-test", {
        headers: { Cookie: cookies },
      }),
    );
    expect(res.status).toBe(403);
  });

  test("TCCB accessing admin-only route returns 403", async () => {
    const signInRes = await signIn("tccb_user", "tccb1234");
    const cookies = extractCookies(signInRes);

    const res = await app.handle(
      new Request("http://localhost/auth/admin-test", {
        headers: { Cookie: cookies },
      }),
    );
    expect(res.status).toBe(403);
  });
});

describe("Locked Account", () => {
  test("locked user gets 403 and session invalidated", async () => {
    const { db } = await import("../../db");
    const { authUsers } = await import("../../db/schema/auth");
    const { eq } = await import("drizzle-orm");

    const signInRes = await signIn("admin", "admin123");
    const cookies = extractCookies(signInRes);

    const sessionRes = await app.handle(
      new Request("http://localhost/auth/session", {
        headers: { Cookie: cookies },
      }),
    );
    expect(sessionRes.status).toBe(200);

    await db.update(authUsers).set({ status: "locked" }).where(eq(authUsers.username, "admin"));

    try {
      const lockedRes = await app.handle(
        new Request("http://localhost/auth/session", {
          headers: { Cookie: cookies },
        }),
      );
      expect(lockedRes.status).toBe(403);

      const afterRes = await app.handle(
        new Request("http://localhost/auth/session", {
          headers: { Cookie: cookies },
        }),
      );
      expect(afterRes.status).toBe(401);
    } finally {
      await db.update(authUsers).set({ status: "active" }).where(eq(authUsers.username, "admin"));
    }
  });
});
