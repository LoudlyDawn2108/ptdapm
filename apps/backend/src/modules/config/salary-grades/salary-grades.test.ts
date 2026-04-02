import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { cors } from "@elysiajs/cors";
import { eq } from "drizzle-orm";
import { Elysia } from "elysia";
import { authPlugin } from "../../../common/plugins/auth";
import { dbPlugin } from "../../../common/plugins/db";
import { errorPlugin } from "../../../common/plugins/error-handler";
import { db } from "../../../db";
import { salaryGradeSteps, salaryGrades } from "../../../db/schema";
import { authRoutes } from "../../auth";
import { salaryGradeRoutes } from "./index";

const app = new Elysia()
  .use(cors({ origin: "http://localhost:5173", credentials: true }))
  .use(errorPlugin)
  .use(dbPlugin)
  .use(authPlugin)
  .use(authRoutes)
  .use(salaryGradeRoutes);

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

let createdGradeId: string;
let createdStepId: string;
const suffix = Date.now();

afterAll(async () => {
  if (createdStepId) {
    await db.delete(salaryGradeSteps).where(eq(salaryGradeSteps.id, createdStepId));
  }
  if (createdGradeId) {
    await db.delete(salaryGradeSteps).where(eq(salaryGradeSteps.salaryGradeId, createdGradeId));
    await db.delete(salaryGrades).where(eq(salaryGrades.id, createdGradeId));
  }
});

// ── RBAC ──────────────────────────────────────────────────────────────────

describe("RBAC — ADMIN/TCCB only", () => {
  test("unauthenticated request → 401", async () => {
    const res = await app.handle(new Request("http://localhost/api/config/salary-grades"));
    expect(res.status).toBe(401);
  });

  test("EMPLOYEE role cannot create → 403", async () => {
    const signInRes = await signIn("employee_user", "employee1234");
    const cookies = extractCookies(signInRes);
    const res = await app.handle(
      new Request("http://localhost/api/config/salary-grades", {
        method: "POST",
        headers: { Cookie: cookies, "Content-Type": "application/json" },
        body: JSON.stringify({ gradeCode: "TEST_GR", gradeName: "Test" }),
      }),
    );
    expect(res.status).toBe(403);
  });
});

// ── GET /api/config/salary-grades — List ────────────────────────────────

describe("GET /api/config/salary-grades — List", () => {
  test("returns paginated list with correct shape", async () => {
    const res = await adminRequest("GET", "/api/config/salary-grades");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data).toBeDefined();
    expect(body.data.items).toBeArray();
    expect(typeof body.data.total).toBe("number");
    expect(typeof body.data.page).toBe("number");
    expect(typeof body.data.pageSize).toBe("number");
  });

  test("pagination works (pageSize=1)", async () => {
    const res = await adminRequest("GET", "/api/config/salary-grades?pageSize=1&page=1");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.items.length).toBeLessThanOrEqual(1);
    expect(body.data.pageSize).toBe(1);
  });

  test("search by gradeName filters results", async () => {
    const res = await adminRequest("GET", "/api/config/salary-grades?search=nonexistent_xyz");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.items.length).toBe(0);
  });
});

// ── GET /api/config/salary-grades/dropdown ──────────────────────────────

describe("GET /api/config/salary-grades/dropdown", () => {
  test("returns dropdown list", async () => {
    const res = await adminRequest("GET", "/api/config/salary-grades/dropdown");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data).toBeArray();
  });
});

// ── POST /api/config/salary-grades — Create ─────────────────────────────

describe("POST /api/config/salary-grades — Create", () => {
  test("valid data creates grade", async () => {
    const res = await adminRequest("POST", "/api/config/salary-grades", {
      gradeCode: `GRADE_${suffix}`,
      gradeName: `Ngạch lương test ${suffix}`,
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data).toBeDefined();
    expect(body.data.id).toBeString();
    expect(body.data.gradeCode).toBe(`GRADE_${suffix}`);
    expect(body.data.status).toBe("active");
    createdGradeId = body.data.id;
  });

  test("duplicate gradeCode → 409", async () => {
    const res = await adminRequest("POST", "/api/config/salary-grades", {
      gradeCode: `GRADE_${suffix}`,
      gradeName: "Duplicate test",
    });
    expect(res.status).toBe(409);
  });

  test("missing required fields → error", async () => {
    const res = await adminRequest("POST", "/api/config/salary-grades", {});
    expect(res.status).toBeGreaterThanOrEqual(400);
  });
});

// ── GET /api/config/salary-grades/:id — Get by ID ───────────────────────

describe("GET /api/config/salary-grades/:id — Get by ID", () => {
  test("valid ID returns grade detail", async () => {
    const res = await adminRequest("GET", `/api/config/salary-grades/${createdGradeId}`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.id).toBe(createdGradeId);
  });

  test("non-existent UUID → 404", async () => {
    const res = await adminRequest(
      "GET",
      "/api/config/salary-grades/00000000-0000-0000-0000-000000000000",
    );
    expect(res.status).toBe(404);
  });

  test("invalid format → 400", async () => {
    const res = await adminRequest("GET", "/api/config/salary-grades/not-a-uuid");
    expect(res.status).toBe(400);
  });
});

// ── PUT /api/config/salary-grades/:id — Update ──────────────────────────

describe("PUT /api/config/salary-grades/:id — Update", () => {
  test("update gradeName succeeds", async () => {
    const res = await adminRequest("PUT", `/api/config/salary-grades/${createdGradeId}`, {
      gradeName: `Updated ${suffix}`,
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.gradeName).toBe(`Updated ${suffix}`);
  });

  test("toggle status to inactive succeeds", async () => {
    const res = await adminRequest("PUT", `/api/config/salary-grades/${createdGradeId}`, {
      status: "inactive",
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.status).toBe("inactive");
  });

  test("toggle status back to active succeeds", async () => {
    const res = await adminRequest("PUT", `/api/config/salary-grades/${createdGradeId}`, {
      status: "active",
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.status).toBe("active");
  });

  test("non-existent grade → 404", async () => {
    const res = await adminRequest(
      "PUT",
      "/api/config/salary-grades/00000000-0000-0000-0000-000000000000",
      { gradeName: "Nope" },
    );
    expect(res.status).toBe(404);
  });
});

// ── Steps CRUD ──────────────────────────────────────────────────────────

describe("Salary Grade Steps — CRUD", () => {
  test("POST step — valid data creates step", async () => {
    const res = await adminRequest("POST", `/api/config/salary-grades/${createdGradeId}/steps`, {
      stepNo: 1,
      coefficient: "2.34",
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data).toBeDefined();
    expect(body.data.stepNo).toBe(1);
    expect(body.data.salaryGradeId).toBe(createdGradeId);
    createdStepId = body.data.id;
  });

  test("POST step — duplicate stepNo → 409", async () => {
    const res = await adminRequest("POST", `/api/config/salary-grades/${createdGradeId}/steps`, {
      stepNo: 1,
      coefficient: "3.00",
    });
    expect(res.status).toBe(409);
  });

  test("GET steps — lists steps for grade", async () => {
    const res = await adminRequest("GET", `/api/config/salary-grades/${createdGradeId}/steps`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data).toBeArray();
    expect(body.data.length).toBeGreaterThan(0);
  });

  test("GET steps with activeOnly hides inactive steps", async () => {
    const deactivateRes = await adminRequest(
      "PUT",
      `/api/config/salary-grades/${createdGradeId}/steps/${createdStepId}`,
      { status: "inactive" },
    );
    expect(deactivateRes.status).toBe(200);

    const filteredRes = await adminRequest(
      "GET",
      `/api/config/salary-grades/${createdGradeId}/steps?activeOnly=true`,
    );
    expect(filteredRes.status).toBe(200);
    const filteredBody = await filteredRes.json();
    expect(filteredBody.data).toBeArray();
    expect(
      filteredBody.data.find((item: { id: string }) => item.id === createdStepId),
    ).toBeUndefined();

    const reactivateRes = await adminRequest(
      "PUT",
      `/api/config/salary-grades/${createdGradeId}/steps/${createdStepId}`,
      { status: "active" },
    );
    expect(reactivateRes.status).toBe(200);
  });

  test("cannot create step under inactive grade", async () => {
    const gradeRes = await adminRequest("POST", "/api/config/salary-grades", {
      gradeCode: `INACTIVE_${suffix}`,
      gradeName: `Inactive grade ${suffix}`,
    });
    expect(gradeRes.status).toBe(200);
    const gradeBody = await gradeRes.json();
    const inactiveGradeId = gradeBody.data.id as string;

    const deactivateRes = await adminRequest(
      "PUT",
      `/api/config/salary-grades/${inactiveGradeId}`,
      {
        status: "inactive",
      },
    );
    expect(deactivateRes.status).toBe(200);

    const createStepRes = await adminRequest(
      "POST",
      `/api/config/salary-grades/${inactiveGradeId}/steps`,
      {
        stepNo: 1,
        coefficient: "2.55",
      },
    );
    expect(createStepRes.status).toBe(400);

    await db.delete(salaryGrades).where(eq(salaryGrades.id, inactiveGradeId));
  });

  test("cannot edit inactive step fields except status", async () => {
    const deactivateRes = await adminRequest(
      "PUT",
      `/api/config/salary-grades/${createdGradeId}/steps/${createdStepId}`,
      { status: "inactive" },
    );
    expect(deactivateRes.status).toBe(200);

    const updateRes = await adminRequest(
      "PUT",
      `/api/config/salary-grades/${createdGradeId}/steps/${createdStepId}`,
      { coefficient: "6.78" },
    );
    expect(updateRes.status).toBe(400);

    const reactivateRes = await adminRequest(
      "PUT",
      `/api/config/salary-grades/${createdGradeId}/steps/${createdStepId}`,
      { status: "active" },
    );
    expect(reactivateRes.status).toBe(200);
  });

  test("PUT step — update coefficient succeeds", async () => {
    const res = await adminRequest(
      "PUT",
      `/api/config/salary-grades/${createdGradeId}/steps/${createdStepId}`,
      { coefficient: "5.67" },
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.coefficient).toBe("5.670");
  });

  test("DELETE step — succeeds", async () => {
    const res = await adminRequest(
      "DELETE",
      `/api/config/salary-grades/${createdGradeId}/steps/${createdStepId}`,
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.id).toBe(createdStepId);
    createdStepId = ""; // already deleted
  });
});

// ── DELETE /api/config/salary-grades/:id ─────────────────────────────────

describe("DELETE /api/config/salary-grades/:id — Delete", () => {
  test("delete unused grade succeeds", async () => {
    const res = await adminRequest("DELETE", `/api/config/salary-grades/${createdGradeId}`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.id).toBe(createdGradeId);
    createdGradeId = ""; // already deleted
  });

  test("non-existent grade → 404", async () => {
    const res = await adminRequest(
      "DELETE",
      "/api/config/salary-grades/00000000-0000-0000-0000-000000000000",
    );
    expect(res.status).toBe(404);
  });
});
