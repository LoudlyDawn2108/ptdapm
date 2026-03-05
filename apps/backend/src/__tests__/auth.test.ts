import { describe, expect, test } from "bun:test";
import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";
import { authPlugin } from "../plugins/auth";
import { dbPlugin } from "../plugins/db";
import { authRoutes } from "../routes/auth";

const app = new Elysia()
  .use(cors({ origin: "http://localhost:5173", credentials: true }))
  .use(dbPlugin)
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
    expect(body.session).toBeDefined();
  });

  test("sign in with invalid credentials returns error", async () => {
    const res = await signIn("admin", "wrongpassword");
    expect(res.status).not.toBe(200);
  });

  test("GET /auth/me without auth returns 401", async () => {
    const res = await app.handle(new Request("http://localhost/auth/me"));
    expect(res.status).toBe(401);
  });

  test("GET /auth/me with valid session returns AuthUser shape", async () => {
    const signInRes = await signIn("admin", "admin123");
    const cookies = extractCookies(signInRes);

    const res = await app.handle(
      new Request("http://localhost/auth/me", {
        headers: { Cookie: cookies },
      }),
    );
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.user).toBeDefined();
    expect(body.user.id).toBeString();
    expect(body.user.username).toBe("admin");
    expect(body.user.fullName).toBeString();
    expect(body.user.email).toBeDefined();
    expect(body.user.role).toBe("ADMIN");
    expect(body.user.status).toBe("active");
    expect(body.user).toHaveProperty("employeeId");
    expect(body.session).toBeDefined();
    expect(body.session.id).toBeString();
    expect(body.session.expiresAt).toBeDefined();
  });

  test("user.role is a role_code string, not a UUID", async () => {
    const signInRes = await signIn("admin", "admin123");
    const cookies = extractCookies(signInRes);

    const res = await app.handle(
      new Request("http://localhost/auth/me", {
        headers: { Cookie: cookies },
      }),
    );
    const body = await res.json();

    expect(body.user.role).toBe("ADMIN");
    expect(body.user.role).not.toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    );
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
    const signInRes = await signIn("employee_user", "employee123");
    const cookies = extractCookies(signInRes);

    const res = await app.handle(
      new Request("http://localhost/auth/admin-test", {
        headers: { Cookie: cookies },
      }),
    );
    expect(res.status).toBe(403);
  });

  test("TCCB accessing admin-only route returns 403", async () => {
    const signInRes = await signIn("tccb_user", "tccb123");
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
    const { db } = await import("../db");
    const { authUsers } = await import("../db/schema/auth");
    const { eq } = await import("drizzle-orm");

    const signInRes = await signIn("admin", "admin123");
    const cookies = extractCookies(signInRes);

    const meRes = await app.handle(
      new Request("http://localhost/auth/me", {
        headers: { Cookie: cookies },
      }),
    );
    expect(meRes.status).toBe(200);

    await db.update(authUsers).set({ status: "locked" }).where(eq(authUsers.username, "admin"));

    try {
      const lockedRes = await app.handle(
        new Request("http://localhost/auth/me", {
          headers: { Cookie: cookies },
        }),
      );
      expect(lockedRes.status).toBe(403);

      const afterRes = await app.handle(
        new Request("http://localhost/auth/me", {
          headers: { Cookie: cookies },
        }),
      );
      expect(afterRes.status).toBe(401);
    } finally {
      await db.update(authUsers).set({ status: "active" }).where(eq(authUsers.username, "admin"));
    }
  });
});
