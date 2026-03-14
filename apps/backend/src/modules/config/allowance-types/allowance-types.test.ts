import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { cors } from "@elysiajs/cors";
import { eq } from "drizzle-orm";
import { Elysia } from "elysia";
import { authPlugin } from "../../../common/plugins/auth";
import { dbPlugin } from "../../../common/plugins/db";
import { errorPlugin } from "../../../common/plugins/error-handler";
import { db } from "../../../db";
import { allowanceTypes } from "../../../db/schema";
import { authRoutes } from "../../auth";
import { allowanceTypeRoutes } from "./index";

const app = new Elysia()
  .use(cors({ origin: "http://localhost:5173", credentials: true }))
  .use(errorPlugin)
  .use(dbPlugin)
  .use(authPlugin)
  .use(authRoutes)
  .use(allowanceTypeRoutes);

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

async function adminRequest(method: string, path: string, body?: unknown) {
  const signInRes = await signIn("admin", "admin123");
  const cookies = extractCookies(signInRes);
  const headers: Record<string, string> = { Cookie: cookies };
  if (body) headers["Content-Type"] = "application/json";
  return app.handle(
    new Request(`http://localhost${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    }),
  );
}

let createdAllowanceTypeId: string;
const suffix = Date.now();

afterAll(async () => {
  if (createdAllowanceTypeId) {
    await db.delete(allowanceTypes).where(eq(allowanceTypes.id, createdAllowanceTypeId));
  }
});

// ── RBAC ──────────────────────────────────────────────────────────────────

describe("RBAC — ADMIN/TCCB only", () => {
  test("unauthenticated request → 401", async () => {
    const res = await app.handle(new Request("http://localhost/api/config/allowance-types"));
    expect(res.status).toBe(401);
  });

  test("EMPLOYEE role cannot create → 403", async () => {
    const signInRes = await signIn("employee_user", "employee1234");
    const cookies = extractCookies(signInRes);
    const res = await app.handle(
      new Request("http://localhost/api/config/allowance-types", {
        method: "POST",
        headers: { Cookie: cookies, "Content-Type": "application/json" },
        body: JSON.stringify({ allowanceName: "Test" }),
      }),
    );
    expect(res.status).toBe(403);
  });
});

// ── GET /api/config/allowance-types — List ──────────────────────────────

describe("GET /api/config/allowance-types — List", () => {
  test("returns paginated list with correct shape", async () => {
    const res = await adminRequest("GET", "/api/config/allowance-types");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data).toBeDefined();
    expect(body.data.items).toBeArray();
    expect(typeof body.data.total).toBe("number");
    expect(typeof body.data.page).toBe("number");
    expect(typeof body.data.pageSize).toBe("number");
  });

  test("pagination works (pageSize=1)", async () => {
    const res = await adminRequest("GET", "/api/config/allowance-types?pageSize=1&page=1");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.items.length).toBeLessThanOrEqual(1);
  });

  test("search by allowanceName filters results", async () => {
    const res = await adminRequest("GET", "/api/config/allowance-types?search=nonexistent_xyz");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.items.length).toBe(0);
  });
});

// ── GET /api/config/allowance-types/dropdown ────────────────────────────

describe("GET /api/config/allowance-types/dropdown", () => {
  test("returns dropdown list", async () => {
    const res = await adminRequest("GET", "/api/config/allowance-types/dropdown");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data).toBeArray();
  });
});

// ── POST /api/config/allowance-types — Create ───────────────────────────

describe("POST /api/config/allowance-types — Create", () => {
  test("valid data creates allowance type", async () => {
    const res = await adminRequest("POST", "/api/config/allowance-types", {
      allowanceName: `Phụ cấp test ${suffix}`,
      description: "Mô tả phụ cấp test",
      calcMethod: "Tính theo tháng",
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data).toBeDefined();
    expect(body.data.id).toBeString();
    expect(body.data.allowanceName).toBe(`Phụ cấp test ${suffix}`);
    expect(body.data.status).toBe("active");
    createdAllowanceTypeId = body.data.id;
  });

  test("duplicate allowanceName → 409", async () => {
    const res = await adminRequest("POST", "/api/config/allowance-types", {
      allowanceName: `Phụ cấp test ${suffix}`,
    });
    expect(res.status).toBe(409);
  });

  test("missing required fields → error", async () => {
    const res = await adminRequest("POST", "/api/config/allowance-types", {});
    expect(res.status).toBeGreaterThanOrEqual(400);
  });
});

// ── GET /api/config/allowance-types/:id — Get by ID ─────────────────────

describe("GET /api/config/allowance-types/:id — Get by ID", () => {
  test("valid ID returns detail", async () => {
    const res = await adminRequest(
      "GET",
      `/api/config/allowance-types/${createdAllowanceTypeId}`,
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.id).toBe(createdAllowanceTypeId);
  });

  test("non-existent UUID → 404", async () => {
    const res = await adminRequest(
      "GET",
      "/api/config/allowance-types/00000000-0000-0000-0000-000000000000",
    );
    expect(res.status).toBe(404);
  });

  test("invalid format → 400", async () => {
    const res = await adminRequest("GET", "/api/config/allowance-types/not-a-uuid");
    expect(res.status).toBe(400);
  });
});

// ── PUT /api/config/allowance-types/:id — Update ────────────────────────

describe("PUT /api/config/allowance-types/:id — Update", () => {
  test("update description succeeds", async () => {
    const res = await adminRequest(
      "PUT",
      `/api/config/allowance-types/${createdAllowanceTypeId}`,
      { description: "Mô tả mới" },
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.description).toBe("Mô tả mới");
  });

  test("toggle status to inactive succeeds", async () => {
    const res = await adminRequest(
      "PUT",
      `/api/config/allowance-types/${createdAllowanceTypeId}`,
      { status: "inactive" },
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.status).toBe("inactive");
  });

  test("cannot edit inactive type (without status field) → 400", async () => {
    const res = await adminRequest(
      "PUT",
      `/api/config/allowance-types/${createdAllowanceTypeId}`,
      { description: "Should fail" },
    );
    expect(res.status).toBe(400);
  });

  test("toggle status back to active succeeds", async () => {
    const res = await adminRequest(
      "PUT",
      `/api/config/allowance-types/${createdAllowanceTypeId}`,
      { status: "active" },
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.status).toBe("active");
  });

  test("non-existent type → 404", async () => {
    const res = await adminRequest(
      "PUT",
      "/api/config/allowance-types/00000000-0000-0000-0000-000000000000",
      { description: "Nope" },
    );
    expect(res.status).toBe(404);
  });
});
