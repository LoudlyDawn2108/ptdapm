import { describe, expect, test } from "bun:test";
import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";
import { authPlugin } from "../../common/plugins/auth";
import { dbPlugin } from "../../common/plugins/db";
import { errorPlugin } from "../../common/plugins/error-handler";
import { authRoutes } from "../auth";
import { dashboardRoutes } from "./index";

const app = new Elysia()
  .use(cors({ origin: "http://localhost:5173", credentials: true }))
  .use(errorPlugin)
  .use(dbPlugin)
  .use(authPlugin)
  .use(authRoutes)
  .use(dashboardRoutes);

async function signIn(username: string, password: string) {
  return app.handle(
    new Request("http://localhost/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    }),
  );
}

function extractCookies(res: Response): string {
  return res.headers
    .getSetCookie()
    .map((c) => c.split(";")[0])
    .join("; ");
}

async function adminRequest(method: string, path: string) {
  const signInRes = await signIn("admin", "admin123");
  const cookies = extractCookies(signInRes);
  return app.handle(
    new Request(`http://localhost${path}`, {
      method,
      headers: { Cookie: cookies },
    }),
  );
}

// ── RBAC ──────────────────────────────────────────────────────────────────

describe("RBAC — Auth required", () => {
  test("unauthenticated request → 401", async () => {
    const res = await app.handle(new Request("http://localhost/api/dashboard/statistics"));
    expect(res.status).toBe(401);
  });
});

// ── GET /api/dashboard/statistics ───────────────────────────────────────

describe("GET /api/dashboard/statistics", () => {
  test("returns statistics with correct shape", async () => {
    const res = await adminRequest("GET", "/api/dashboard/statistics");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data).toBeDefined();
    expect(typeof body.data.totalEmployees).toBe("number");
    expect(typeof body.data.totalOrgUnits).toBe("number");
    expect(body.data.byWorkStatus).toBeArray();
    expect(body.data.byContractStatus).toBeArray();
    expect(body.data.byOrgUnit).toBeArray();
    expect(body.data.byGender).toBeArray();
    expect(body.data.byEducationLevel).toBeArray();
    expect(body.data.byAcademicRank).toBeArray();
  });

  test("totalEmployees is non-negative", async () => {
    const res = await adminRequest("GET", "/api/dashboard/statistics");
    const body = await res.json();
    expect(body.data.totalEmployees).toBeGreaterThanOrEqual(0);
  });

  test("totalOrgUnits is non-negative", async () => {
    const res = await adminRequest("GET", "/api/dashboard/statistics");
    const body = await res.json();
    expect(body.data.totalOrgUnits).toBeGreaterThanOrEqual(0);
  });

  test("byWorkStatus entries have status and count", async () => {
    const res = await adminRequest("GET", "/api/dashboard/statistics");
    const body = await res.json();
    for (const entry of body.data.byWorkStatus) {
      expect(entry.status).toBeString();
      expect(typeof entry.count).toBe("number");
    }
  });

  test("byGender entries have gender and count", async () => {
    const res = await adminRequest("GET", "/api/dashboard/statistics");
    const body = await res.json();
    for (const entry of body.data.byGender) {
      expect(entry.gender).toBeString();
      expect(typeof entry.count).toBe("number");
    }
  });

  test("EMPLOYEE role can also access statistics", async () => {
    const signInRes = await signIn("employee_user", "employee1234");
    const cookies = extractCookies(signInRes);
    const res = await app.handle(
      new Request("http://localhost/api/dashboard/statistics", {
        headers: { Cookie: cookies },
      }),
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data).toBeDefined();
    expect(typeof body.data.totalEmployees).toBe("number");
  });
});
