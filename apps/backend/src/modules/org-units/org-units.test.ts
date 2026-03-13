import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { cors } from "@elysiajs/cors";
import { and, eq, isNull, like, or } from "drizzle-orm";
import { Elysia } from "elysia";
import { authPlugin } from "../../common/plugins/auth";
import { dbPlugin } from "../../common/plugins/db";
import { errorPlugin } from "../../common/plugins/error-handler";
import { db } from "../../db";
import { campuses, employeeAssignments, orgUnitStatusEvents, orgUnits } from "../../db/schema";
import { authRoutes } from "../auth";
import { orgUnitRoutes } from "./index";

const app = new Elysia()
  .use(cors({ origin: "http://localhost:5173", credentials: true }))
  .use(errorPlugin)
  .use(dbPlugin)
  .use(authPlugin)
  .use(authRoutes)
  .use(orgUnitRoutes);

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

let createdUnitId: string;
let createdChildId: string;
let createdMergeTargetId: string;
let createdDissolveId: string;
let testCampusId: string;
const suffix = crypto.randomUUID().slice(0, 8);

async function cleanupStaleUnits() {
  const stale = await db
    .select({ id: orgUnits.id })
    .from(orgUnits)
    .where(
      or(
        like(orgUnits.unitCode, "T_UNIT_%"),
        like(orgUnits.unitCode, "T_CHILD_%"),
        like(orgUnits.unitCode, "T_DISSOLVE_%"),
        like(orgUnits.unitCode, "T_MERGE_%"),
      ),
    );
  for (const u of stale) {
    await db.delete(orgUnitStatusEvents).where(eq(orgUnitStatusEvents.orgUnitId, u.id));
    await db.delete(employeeAssignments).where(eq(employeeAssignments.orgUnitId, u.id));
    await db.update(orgUnits).set({ parentId: null }).where(eq(orgUnits.parentId, u.id));
  }
  for (const u of stale) {
    await db.delete(orgUnits).where(eq(orgUnits.id, u.id));
  }
}

beforeAll(async () => {
  await cleanupStaleUnits();

  // Ensure a campus exists for org unit creation
  const [existing] = await db.select({ id: campuses.id }).from(campuses).limit(1);
  if (existing) {
    testCampusId = existing.id;
  } else {
    const [created] = await db
      .insert(campuses)
      .values({
        campusCode: "CAMPUS_TEST",
        campusName: "Test Campus",
      })
      .returning({ id: campuses.id });
    testCampusId = created!.id;
  }
});

afterAll(async () => {
  await cleanupStaleUnits();
});

// ── RBAC ──────────────────────────────────────────────────────────────────

describe("RBAC — ADMIN/TCCB only", () => {
  test("unauthenticated request → 401", async () => {
    const res = await app.handle(new Request("http://localhost/api/org-units/tree"));
    expect(res.status).toBe(401);
  });

  test("EMPLOYEE role cannot create → 403", async () => {
    const signInRes = await signIn("employee_user", "employee1234");
    const cookies = extractCookies(signInRes);
    const res = await app.handle(
      new Request("http://localhost/api/org-units", {
        method: "POST",
        headers: { Cookie: cookies, "Content-Type": "application/json" },
        body: JSON.stringify({
          unitCode: "TEST",
          unitName: "Test",
          unitType: "PHONG",
        }),
      }),
    );
    expect(res.status).toBe(403);
  });
});

// ── GET /api/org-units/tree ─────────────────────────────────────────────

describe("GET /api/org-units/tree", () => {
  test("returns tree array", async () => {
    const res = await adminRequest("GET", "/api/org-units/tree");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data).toBeArray();
  });
});

// ── GET /api/org-units/dropdown ─────────────────────────────────────────

describe("GET /api/org-units/dropdown", () => {
  test("returns dropdown list (active only)", async () => {
    const res = await adminRequest("GET", "/api/org-units/dropdown");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data).toBeArray();
  });
});

// ── POST /api/org-units — Create ────────────────────────────────────────

describe("POST /api/org-units — Create", () => {
  test("valid data creates org unit", async () => {
    const res = await adminRequest("POST", "/api/org-units", {
      unitCode: `T_UNIT_${suffix}`,
      unitName: `Đơn vị test ${suffix}`,
      unitType: "PHONG",
      address: "123 Test St",
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data).toBeDefined();
    expect(body.data.id).toBeString();
    expect(body.data.unitCode).toBe(`T_UNIT_${suffix}`);
    expect(body.data.status).toBe("active");
    createdUnitId = body.data.id;
  });

  test("duplicate unitCode → 409", async () => {
    const res = await adminRequest("POST", "/api/org-units", {
      unitCode: `T_UNIT_${suffix}`,
      unitName: "Duplicate test",
      unitType: "PHONG",
    });
    expect(res.status).toBe(409);
  });

  test("child unit creation succeeds", async () => {
    const res = await adminRequest("POST", "/api/org-units", {
      parentId: createdUnitId,
      unitCode: `T_CHILD_${suffix}`,
      unitName: `Đơn vị con test ${suffix}`,
      unitType: "BO_MON",
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.parentId).toBe(createdUnitId);
    createdChildId = body.data.id;
  });

  test("missing required fields → error", async () => {
    const res = await adminRequest("POST", "/api/org-units", {});
    expect(res.status).toBeGreaterThanOrEqual(400);
  });
});

// ── GET /api/org-units/:id — Detail ─────────────────────────────────────

describe("GET /api/org-units/:id — Detail", () => {
  test("valid ID returns detail with children", async () => {
    const res = await adminRequest("GET", `/api/org-units/${createdUnitId}`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.id).toBe(createdUnitId);
    expect(body.data.children).toBeArray();
    expect(body.data.assignments).toBeArray();
    expect(body.data.statusEvents).toBeArray();
  });

  test("non-existent UUID → 404", async () => {
    const res = await adminRequest(
      "GET",
      "/api/org-units/00000000-0000-0000-0000-000000000000",
    );
    expect(res.status).toBe(404);
  });

  test("invalid format → 400", async () => {
    const res = await adminRequest("GET", "/api/org-units/not-a-uuid");
    expect(res.status).toBe(400);
  });
});

// ── PUT /api/org-units/:id — Update ─────────────────────────────────────

describe("PUT /api/org-units/:id — Update", () => {
  test("update unitName succeeds", async () => {
    const res = await adminRequest("PUT", `/api/org-units/${createdUnitId}`, {
      unitName: `Updated ${suffix}`,
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.unitName).toBe(`Updated ${suffix}`);
  });

  test("non-existent unit → 404", async () => {
    const res = await adminRequest(
      "PUT",
      "/api/org-units/00000000-0000-0000-0000-000000000000",
      { unitName: "Nope" },
    );
    expect(res.status).toBe(404);
  });
});

// ── POST /api/org-units/:id/dissolve ────────────────────────────────────

describe("POST /api/org-units/:id/dissolve", () => {
  test("dissolve active unit (dissolve_all) succeeds", async () => {
    // Create a separate unit for dissolve test
    const createRes = await adminRequest("POST", "/api/org-units", {
      unitCode: `T_DISSOLVE_${suffix}`,
      unitName: `Đơn vị giải thể ${suffix}`,
      unitType: "PHONG",
    });
    const createBody = await createRes.json();
    createdDissolveId = createBody.data.id;

    const res = await adminRequest("POST", `/api/org-units/${createdDissolveId}/dissolve`, {
      effectiveOn: "2025-06-01",
      reason: "GIAI_THE",
      childAction: "dissolve_all",
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.status).toBe("dissolved");
  });

  test("re-dissolve already dissolved unit → 400", async () => {
    const res = await adminRequest("POST", `/api/org-units/${createdDissolveId}/dissolve`, {
      effectiveOn: "2025-06-01",
      reason: "GIAI_THE",
      childAction: "dissolve_all",
    });
    expect(res.status).toBe(400);
  });

  test("cannot edit dissolved unit → 400", async () => {
    const res = await adminRequest("PUT", `/api/org-units/${createdDissolveId}`, {
      unitName: "Should fail",
    });
    expect(res.status).toBe(400);
  });
});

// ── POST /api/org-units/:id/merge ───────────────────────────────────────

describe("POST /api/org-units/:id/merge", () => {
  test("merge active unit into another succeeds", async () => {
    const srcRes = await adminRequest("POST", "/api/org-units", {
      unitCode: `T_MERGE_S_${suffix}`,
      unitName: `Đơn vị sáp nhập nguồn ${suffix}`,
      unitType: "PHONG",
    });
    expect(srcRes.status).toBe(200);
    const srcBody = await srcRes.json();
    const mergeSourceId = srcBody.data.id;

    const tgtRes = await adminRequest("POST", "/api/org-units", {
      unitCode: `T_MERGE_T_${suffix}`,
      unitName: `Đơn vị sáp nhập đích ${suffix}`,
      unitType: "PHONG",
    });
    expect(tgtRes.status).toBe(200);
    const tgtBody = await tgtRes.json();
    createdMergeTargetId = tgtBody.data.id;

    const res = await adminRequest("POST", `/api/org-units/${mergeSourceId}/merge`, {
      effectiveOn: "2025-06-01",
      reason: "SAP_NHAP",
      targetOrgUnitId: createdMergeTargetId,
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.status).toBe("merged");
  });
});
