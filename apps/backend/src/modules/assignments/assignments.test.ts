import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { cors } from "@elysiajs/cors";
import { and, eq, isNull, like, or } from "drizzle-orm";
import { Elysia } from "elysia";
import { authPlugin } from "../../common/plugins/auth";
import { dbPlugin } from "../../common/plugins/db";
import { errorPlugin } from "../../common/plugins/error-handler";
import { db } from "../../db";
import { campuses, employeeAssignments, employees, orgUnits } from "../../db/schema";
import { authRoutes } from "../auth";
import { assignmentRoutes } from "./index";

function offsetDate(days: number) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().split("T")[0]!;
}

async function createTestOrgUnit(campusId: string, codePrefix: string) {
  const unique = crypto.randomUUID().slice(0, 8);
  const [unit] = await db
    .insert(orgUnits)
    .values({
      campusId,
      unitCode: `${codePrefix}_${unique}`,
      unitName: `${codePrefix} ${unique}`,
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
      nationalId: `TA${unique}`,
      address: "123 Assignment St",
      email: `assign.${unique}@example.com`,
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
  .use(assignmentRoutes);

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

let testOrgUnitId: string;
let testEmployeeId: string;
let createdAssignmentId: string;
let testCampusId: string;
const suffix = crypto.randomUUID().slice(0, 8);

async function cleanupStaleData() {
  const staleEmps = await db
    .select({ id: employees.id })
    .from(employees)
    .where(like(employees.fullName, "Test Assignment Emp%"));
  for (const e of staleEmps) {
    await db.delete(employeeAssignments).where(eq(employeeAssignments.employeeId, e.id));
    await db.delete(employees).where(eq(employees.id, e.id));
  }
  const staleUnits = await db
    .select({ id: orgUnits.id })
    .from(orgUnits)
    .where(like(orgUnits.unitCode, "T_ASG_%"));
  for (const u of staleUnits) {
    await db.delete(employeeAssignments).where(eq(employeeAssignments.orgUnitId, u.id));
    await db.delete(orgUnits).where(eq(orgUnits.id, u.id));
  }
}

beforeAll(async () => {
  await cleanupStaleData();

  // Ensure a campus exists
  let campusId: string;
  const [existing] = await db.select({ id: campuses.id }).from(campuses).limit(1);
  if (existing) {
    campusId = existing.id;
  } else {
    const [created] = await db
      .insert(campuses)
      .values({
        campusCode: "CAMPUS_TEST",
        campusName: "Test Campus",
      })
      .returning({ id: campuses.id });
    campusId = created!.id;
  }

  testCampusId = campusId;

  // Create test org unit
  const [unit] = await db
    .insert(orgUnits)
    .values({
      campusId,
      unitCode: `T_ASG_${suffix}`,
      unitName: `Assignment Test Unit ${suffix}`,
      unitType: "PHONG",
    })
    .returning({ id: orgUnits.id });
  testOrgUnitId = unit!.id;

  // Create test employee
  const [emp] = await db
    .insert(employees)
    .values({
      fullName: `Test Assignment Emp ${suffix}`,
      dob: "1990-01-01",
      gender: "NAM",
      nationalId: `TA${suffix}`,
      address: "123 Assignment St",
      email: `assign.${suffix}@example.com`,
      phone: "0901234567",
    })
    .returning({ id: employees.id });
  testEmployeeId = emp!.id;
});

afterAll(async () => {
  await cleanupStaleData();
});

// ── RBAC ──────────────────────────────────────────────────────────────────

describe("RBAC — ADMIN/TCCB only", () => {
  test("unauthenticated request → 401", async () => {
    const res = await app.handle(
      new Request(`http://localhost/api/org-units/${testOrgUnitId}/assignments`),
    );
    expect(res.status).toBe(401);
  });

  test("EMPLOYEE role cannot appoint → 403", async () => {
    const signInRes = await signIn("employee_user", "employee1234");
    const cookies = extractCookies(signInRes);
    const res = await app.handle(
      new Request(`http://localhost/api/org-units/${testOrgUnitId}/assignments`, {
        method: "POST",
        headers: { Cookie: cookies, "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId: testEmployeeId,
          startedOn: offsetDate(0),
        }),
      }),
    );
    expect(res.status).toBe(403);
  });
});

// ── GET /api/org-units/:orgUnitId/assignments — List ─────────────────────

describe("GET /api/org-units/:orgUnitId/assignments — List", () => {
  test("returns assignment list", async () => {
    const res = await adminRequest("GET", `/api/org-units/${testOrgUnitId}/assignments`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data).toBeArray();
  });

  test("non-existent org unit → 404", async () => {
    const res = await adminRequest(
      "GET",
      "/api/org-units/00000000-0000-0000-0000-000000000000/assignments",
    );
    expect(res.status).toBe(404);
  });
});

// ── POST /api/org-units/:orgUnitId/assignments — Appoint ────────────────

describe("POST /api/org-units/:orgUnitId/assignments — Appoint", () => {
  test("valid data appoints employee", async () => {
    const startedOn = offsetDate(0);

    const res = await adminRequest("POST", `/api/org-units/${testOrgUnitId}/assignments`, {
      employeeId: testEmployeeId,
      positionTitle: "Trưởng phòng",
      startedOn,
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data).toBeDefined();
    expect(body.data.employeeId).toBe(testEmployeeId);
    expect(body.data.orgUnitId).toBe(testOrgUnitId);
    createdAssignmentId = body.data.id;

    // Verify employee was updated
    const [emp] = await db
      .select({ currentOrgUnitId: employees.currentOrgUnitId, workStatus: employees.workStatus })
      .from(employees)
      .where(eq(employees.id, testEmployeeId));
    expect(emp!.currentOrgUnitId).toBe(testOrgUnitId);
    expect(emp!.workStatus).toBe("working");
  });

  test("duplicate appointment → 400", async () => {
    const startedOn = offsetDate(0);

    const res = await adminRequest("POST", `/api/org-units/${testOrgUnitId}/assignments`, {
      employeeId: testEmployeeId,
      startedOn,
    });
    expect(res.status).toBe(400);
  });

  test("non-existent employee → 404", async () => {
    const startedOn = offsetDate(0);

    const res = await adminRequest("POST", `/api/org-units/${testOrgUnitId}/assignments`, {
      employeeId: "00000000-0000-0000-0000-000000000000",
      startedOn,
    });
    expect(res.status).toBe(404);
  });

  test("past startedOn is rejected", async () => {
    const employeeId = await createTestEmployee("Test Assignment Emp Past");

    const res = await adminRequest("POST", `/api/org-units/${testOrgUnitId}/assignments`, {
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

  test("appointment transfers employee from previous org unit", async () => {
    const sourceOrgUnitId = await createTestOrgUnit(testCampusId, "T_ASG_SRC");
    const targetOrgUnitId = await createTestOrgUnit(testCampusId, "T_ASG_DST");
    const employeeId = await createTestEmployee("Test Assignment Emp Transfer");
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
        positionTitle: "Phó phòng",
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

    const [employee] = await db
      .select({
        currentOrgUnitId: employees.currentOrgUnitId,
        currentPositionTitle: employees.currentPositionTitle,
        workStatus: employees.workStatus,
      })
      .from(employees)
      .where(eq(employees.id, employeeId))
      .limit(1);
    expect(employee!.currentOrgUnitId).toBe(targetOrgUnitId);
    expect(employee!.currentPositionTitle).toBe("Phó phòng");
    expect(employee!.workStatus).toBe("working");

    expect(transferBody.data.orgUnitId).toBe(targetOrgUnitId);
  });

  test("transfer rejects mismatched source org unit", async () => {
    const sourceOrgUnitId = await createTestOrgUnit(testCampusId, "T_ASG_SRC");
    const wrongSourceOrgUnitId = await createTestOrgUnit(testCampusId, "T_ASG_WRONG");
    const targetOrgUnitId = await createTestOrgUnit(testCampusId, "T_ASG_DST");
    const employeeId = await createTestEmployee("Test Assignment Emp Wrong Source");

    const firstRes = await adminRequest("POST", `/api/org-units/${sourceOrgUnitId}/assignments`, {
      employeeId,
      positionTitle: "Chuyên viên",
      startedOn: offsetDate(0),
    });
    expect(firstRes.status).toBe(200);

    const transferRes = await adminRequest(
      "POST",
      `/api/org-units/${targetOrgUnitId}/assignments`,
      {
        employeeId,
        sourceOrgUnitId: wrongSourceOrgUnitId,
        positionTitle: "Phó phòng",
        startedOn: offsetDate(0),
      },
    );

    expect(transferRes.status).toBe(400);
  });

  test("missing required fields → error", async () => {
    const res = await adminRequest("POST", `/api/org-units/${testOrgUnitId}/assignments`, {});
    expect(res.status).toBeGreaterThanOrEqual(400);
  });
});

// ── DELETE /api/org-units/:orgUnitId/assignments/:id — Dismiss ────────────

describe("DELETE /api/org-units/:orgUnitId/assignments/:id — Dismiss", () => {
  test("dismiss employee succeeds", async () => {
    const res = await adminRequest(
      "DELETE",
      `/api/org-units/${testOrgUnitId}/assignments/${createdAssignmentId}`,
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.id).toBe(createdAssignmentId);

    // Verify employee status changed to pending (no other active assignments)
    const [emp] = await db
      .select({ currentOrgUnitId: employees.currentOrgUnitId, workStatus: employees.workStatus })
      .from(employees)
      .where(eq(employees.id, testEmployeeId));
    expect(emp!.currentOrgUnitId).toBeNull();
    expect(emp!.workStatus).toBe("pending");
    createdAssignmentId = "";
  });

  test("non-existent assignment → 404", async () => {
    const res = await adminRequest(
      "DELETE",
      `/api/org-units/${testOrgUnitId}/assignments/00000000-0000-0000-0000-000000000000`,
    );
    expect(res.status).toBe(404);
  });
});
