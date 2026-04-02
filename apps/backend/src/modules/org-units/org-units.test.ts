import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { cors } from "@elysiajs/cors";
import { and, eq, isNull, like, or } from "drizzle-orm";
import { Elysia } from "elysia";
import { authPlugin } from "../../common/plugins/auth";
import { dbPlugin } from "../../common/plugins/db";
import { errorPlugin } from "../../common/plugins/error-handler";
import { db } from "../../db";
import {
  campuses,
  employeeAssignments,
  employees,
  orgUnitStatusEvents,
  orgUnits,
} from "../../db/schema";
import { authRoutes } from "../auth";
import { orgUnitRoutes } from "./index";

function offsetDate(days: number) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().split("T")[0]!;
}

async function createTestOrgUnit(codePrefix: string, unitName: string) {
  const unique = crypto.randomUUID().slice(0, 8);
  const [unit] = await db
    .insert(orgUnits)
    .values({
      campusId: testCampusId,
      unitCode: `${codePrefix}_${unique}`,
      unitName: `${unitName} ${unique}`,
      unitType: "PHONG",
    })
    .returning({ id: orgUnits.id });

  return unit!.id;
}

async function createTestEmployee(namePrefix: string) {
  const unique = crypto.randomUUID().replaceAll("-", "").slice(0, 10);
  const [employee] = await db
    .insert(employees)
    .values({
      fullName: `${namePrefix} ${unique}`,
      dob: "1990-01-01",
      gender: "NAM",
      nationalId: `TO${unique}`,
      address: "123 Org Unit St",
      email: `org-unit.${unique}@example.com`,
      phone: "0901234567",
    })
    .returning({ id: employees.id });

  return employee!.id;
}

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
  const staleEmployees = await db
    .select({ id: employees.id })
    .from(employees)
    .where(like(employees.fullName, "Test Org Unit Assignment Emp%"));
  for (const employee of staleEmployees) {
    await db.delete(employeeAssignments).where(eq(employeeAssignments.employeeId, employee.id));
    await db.delete(employees).where(eq(employees.id, employee.id));
  }

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
    const res = await adminRequest("GET", "/api/org-units/00000000-0000-0000-0000-000000000000");
    expect(res.status).toBe(404);
  });

  test("invalid format → 400", async () => {
    const res = await adminRequest("GET", "/api/org-units/not-a-uuid");
    expect(res.status).toBe(400);
  });
});

describe("POST /api/org-units/:id/assignments + /end regression paths", () => {
  test("rejects past startedOn", async () => {
    const orgUnitId = await createTestOrgUnit("T_UNIT_ASG", "Org Unit Assignment Test");
    const employeeId = await createTestEmployee("Test Org Unit Assignment Emp Past");

    const res = await adminRequest("POST", `/api/org-units/${orgUnitId}/assignments`, {
      employeeId,
      startedOn: offsetDate(-1),
    });

    expect(res.status).toBeGreaterThanOrEqual(400);

    const [activeAssignment] = await db
      .select({ id: employeeAssignments.id })
      .from(employeeAssignments)
      .where(
        and(eq(employeeAssignments.employeeId, employeeId), isNull(employeeAssignments.endedOn)),
      )
      .limit(1);
    expect(activeAssignment).toBeUndefined();
  });

  test("handles transfer and clears employee state on /end dismissal", async () => {
    const sourceOrgUnitId = await createTestOrgUnit("T_UNIT_ASG_SRC", "Org Unit Source");
    const targetOrgUnitId = await createTestOrgUnit("T_UNIT_ASG_DST", "Org Unit Target");
    const employeeId = await createTestEmployee("Test Org Unit Assignment Emp Transfer");
    const sourceStartedOn = offsetDate(0);
    const transferStartedOn = offsetDate(0);

    const firstRes = await adminRequest("POST", `/api/org-units/${sourceOrgUnitId}/assignments`, {
      employeeId,
      positionTitle: "Chuyên viên",
      startedOn: sourceStartedOn,
    });
    expect(firstRes.status).toBe(200);
    const firstBody = await firstRes.json();

    const transferRes = await adminRequest(
      "POST",
      `/api/org-units/${targetOrgUnitId}/assignments`,
      {
        employeeId,
        positionTitle: "Trưởng phòng",
        startedOn: transferStartedOn,
      },
    );
    expect(transferRes.status).toBe(200);
    const transferBody = await transferRes.json();

    const [originalAssignment] = await db
      .select({
        endedOn: employeeAssignments.endedOn,
        eventType: employeeAssignments.eventType,
      })
      .from(employeeAssignments)
      .where(eq(employeeAssignments.id, firstBody.data.id))
      .limit(1);
    expect(originalAssignment!.endedOn).toBe(transferStartedOn);
    expect(originalAssignment!.eventType).toBe("DISMISS");

    const endRes = await adminRequest(
      "POST",
      `/api/org-units/${targetOrgUnitId}/assignments/${transferBody.data.id}/end`,
    );
    expect(endRes.status).toBe(200);
    const endBody = await endRes.json();
    expect(endBody.data.endedOn).toBe(offsetDate(0));
    expect(endBody.data.eventType).toBe("DISMISS");

    const [employee] = await db
      .select({
        currentOrgUnitId: employees.currentOrgUnitId,
        currentPositionTitle: employees.currentPositionTitle,
        workStatus: employees.workStatus,
      })
      .from(employees)
      .where(eq(employees.id, employeeId))
      .limit(1);
    expect(employee!.currentOrgUnitId).toBeNull();
    expect(employee!.currentPositionTitle).toBeNull();
    expect(employee!.workStatus).toBe("pending");

    const activeAssignments = await db
      .select({ id: employeeAssignments.id })
      .from(employeeAssignments)
      .where(
        and(eq(employeeAssignments.employeeId, employeeId), isNull(employeeAssignments.endedOn)),
      );
    expect(activeAssignments).toHaveLength(0);
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
    const res = await adminRequest("PUT", "/api/org-units/00000000-0000-0000-0000-000000000000", {
      unitName: "Nope",
    });
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
