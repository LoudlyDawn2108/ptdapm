import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { cors } from "@elysiajs/cors";
import { eq } from "drizzle-orm";
import { Elysia } from "elysia";
import { authPlugin } from "../../common/plugins/auth";
import { dbPlugin } from "../../common/plugins/db";
import { errorPlugin } from "../../common/plugins/error-handler";
import { db } from "../../db";
import { employeeEvaluations, employees } from "../../db/schema";
import { authUsers } from "../../db/schema/auth";
import { authRoutes } from "../auth";
import { employeeRoutes } from "./index";

const app = new Elysia()
  .use(cors({ origin: "http://localhost:5173", credentials: true }))
  .use(errorPlugin)
  .use(dbPlugin)
  .use(authPlugin)
  .use(authRoutes)
  .use(employeeRoutes);

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

async function requestAs(
  username: string,
  password: string,
  method: string,
  path: string,
  body?: unknown,
) {
  const signInRes = await signIn(username, password);
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

async function tccbRequest(method: string, path: string, body?: unknown) {
  return requestAs("tccb_user", "tccb1234", method, path, body);
}

let testEmployeeId: string;
let employeeForMeId: string;
const testEvalIds: string[] = [];
let shouldDeleteEmployeeForMe = false;
let linkedEmployeeId: string | null = null;
const searchSeedSuffix = Date.now().toString().slice(-6);
const searchSeed = {
  fullName: `Search Target ${searchSeedSuffix}`,
  staffCode: `SRCH-${searchSeedSuffix}`,
  nationalId: `SID${searchSeedSuffix}`,
  email: `search.${searchSeedSuffix}@example.com`,
  phone: `0912${searchSeedSuffix}`,
};

beforeAll(async () => {
  const inserted = await db
    .insert(employees)
    .values({
      fullName: searchSeed.fullName,
      staffCode: searchSeed.staffCode,
      dob: "1990-01-01",
      gender: "NAM",
      nationalId: searchSeed.nationalId,
      address: "123 Test St",
      email: searchSeed.email,
      phone: searchSeed.phone,
    })
    .returning({ id: employees.id });
  testEmployeeId = (inserted[0] as { id: string }).id;

  const existingEmployeeForMe = await db
    .select({ id: employees.id, fullName: employees.fullName })
    .from(employees)
    .where(eq(employees.email, "employee@test.local"))
    .limit(1);

  if (existingEmployeeForMe[0]) {
    employeeForMeId = existingEmployeeForMe[0].id;
  } else {
    const meInserted = await db
      .insert(employees)
      .values({
        fullName: "Employee User Linked",
        dob: "1995-03-15",
        gender: "NU",
        nationalId: `ME${Date.now()}`,
        address: "456 Me St",
        email: "employee@test.local",
        phone: "0909999999",
      })
      .returning({ id: employees.id });
    employeeForMeId = (meInserted[0] as { id: string }).id;
    shouldDeleteEmployeeForMe = true;
  }

  await db
    .update(authUsers)
    .set({ employeeId: employeeForMeId, updatedAt: new Date() })
    .where(eq(authUsers.username, "employee_user"));

  const evalInserts = await db
    .insert(employeeEvaluations)
    .values([
      {
        employeeId: employeeForMeId,
        evalType: "REWARD",
        rewardName: "Visible to all",
        visibleToEmployee: true,
        visibleToTckt: true,
      },
      {
        employeeId: employeeForMeId,
        evalType: "DISCIPLINE",
        disciplineName: "Hidden from employee",
        visibleToEmployee: false,
        visibleToTckt: true,
      },
      {
        employeeId: employeeForMeId,
        evalType: "REWARD",
        rewardName: "Hidden from TCKT",
        visibleToEmployee: true,
        visibleToTckt: false,
      },
      {
        employeeId: employeeForMeId,
        evalType: "DISCIPLINE",
        disciplineName: "Hidden from both",
        visibleToEmployee: false,
        visibleToTckt: false,
      },
    ])
    .returning({ id: employeeEvaluations.id });
  for (const row of evalInserts) {
    testEvalIds.push(row.id);
  }
});

afterAll(async () => {
  for (const evalId of testEvalIds) {
    await db.delete(employeeEvaluations).where(eq(employeeEvaluations.id, evalId));
  }
  if (testEmployeeId) {
    await db.delete(employees).where(eq(employees.id, testEmployeeId));
  }
  if (employeeForMeId && shouldDeleteEmployeeForMe) {
    await db.delete(employees).where(eq(employees.id, employeeForMeId));
  }
  if (linkedEmployeeId) {
    await db.delete(employees).where(eq(employees.id, linkedEmployeeId));
  }
  await db
    .update(authUsers)
    .set({ employeeId: null, updatedAt: new Date() })
    .where(eq(authUsers.username, "employee_user"));
});

describe("RBAC — Employee list/detail role guards", () => {
  test("TCKT can GET employee list (200)", async () => {
    const res = await requestAs("tckt_user", "tckt1234", "GET", "/api/employees");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data).toBeDefined();
    expect(body.data.items).toBeArray();
  });

  test("TCKT can GET employee detail (200)", async () => {
    const res = await requestAs("tckt_user", "tckt1234", "GET", `/api/employees/${testEmployeeId}`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data).toBeDefined();
    expect(body.data.employee).toBeDefined();
  });

  test("EMPLOYEE cannot GET employee list (403)", async () => {
    const res = await requestAs("employee_user", "employee1234", "GET", "/api/employees");
    expect(res.status).toBe(403);
  });

  test("EMPLOYEE cannot GET employee detail (403)", async () => {
    const res = await requestAs(
      "employee_user",
      "employee1234",
      "GET",
      `/api/employees/${testEmployeeId}`,
    );
    expect(res.status).toBe(403);
  });

  test("TCCB can GET employee list (200)", async () => {
    const res = await requestAs("tccb_user", "tccb1234", "GET", "/api/employees");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.items).toBeArray();
  });

  test("ADMIN cannot GET employee list (403)", async () => {
    const res = await requestAs("admin", "admin123", "GET", "/api/employees");
    expect(res.status).toBe(403);
  });
});

describe("GET /api/employees — Search behavior", () => {
  test("search matches full name", async () => {
    const res = await tccbRequest(
      "GET",
      `/api/employees?search=${encodeURIComponent(searchSeed.fullName)}`,
    );
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.data.items.some((item: { id: string }) => item.id === testEmployeeId)).toBe(true);
  });

  test("search matches personnel code", async () => {
    const res = await tccbRequest(
      "GET",
      `/api/employees?search=${encodeURIComponent(searchSeed.staffCode)}`,
    );
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.data.items.some((item: { id: string }) => item.id === testEmployeeId)).toBe(true);
  });

  test("search matches CCCD, email, and phone", async () => {
    for (const keyword of [searchSeed.nationalId, searchSeed.email, searchSeed.phone]) {
      const res = await tccbRequest("GET", `/api/employees?search=${encodeURIComponent(keyword)}`);
      expect(res.status).toBe(200);

      const body = await res.json();
      expect(body.data.items.some((item: { id: string }) => item.id === testEmployeeId)).toBe(true);
    }
  });

  test("empty search returns the full employee list", async () => {
    const [defaultRes, emptyRes] = await Promise.all([
      tccbRequest("GET", "/api/employees"),
      tccbRequest("GET", "/api/employees?search="),
    ]);

    expect(defaultRes.status).toBe(200);
    expect(emptyRes.status).toBe(200);

    const defaultBody = await defaultRes.json();
    const emptyBody = await emptyRes.json();

    expect(emptyBody.data.total).toBe(defaultBody.data.total);
    expect(emptyBody.data.items.map((item: { id: string }) => item.id)).toEqual(
      defaultBody.data.items.map((item: { id: string }) => item.id),
    );
  });
});

describe("GET /api/employees/:id — Aggregate response", () => {
  test("returns object with all 11 aggregate keys", async () => {
    const res = await tccbRequest("GET", `/api/employees/${testEmployeeId}`);
    expect(res.status).toBe(200);
    const body = await res.json();
    const data = body.data;

    const expectedKeys = [
      "employee",
      "familyMembers",
      "bankAccounts",
      "previousJobs",
      "partyMemberships",
      "degrees",
      "certifications",
      "foreignWorkPermits",
      "allowances",
      "contracts",
      "evaluations",
    ];

    for (const key of expectedKeys) {
      expect(data).toHaveProperty(key);
    }
  });

  test("each sub-entity value is an array", async () => {
    const res = await tccbRequest("GET", `/api/employees/${testEmployeeId}`);
    expect(res.status).toBe(200);
    const body = await res.json();
    const data = body.data;

    const arrayKeys = [
      "familyMembers",
      "bankAccounts",
      "previousJobs",
      "partyMemberships",
      "degrees",
      "certifications",
      "foreignWorkPermits",
      "allowances",
      "contracts",
      "evaluations",
    ];

    for (const key of arrayKeys) {
      expect(data[key]).toBeArray();
    }
  });

  test("empty sub-entity arrays are valid (no error)", async () => {
    const res = await tccbRequest("GET", `/api/employees/${testEmployeeId}`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.familyMembers).toEqual([]);
    expect(body.data.bankAccounts).toEqual([]);
    expect(body.data.previousJobs).toEqual([]);
  });
});

describe("GET /api/employees/me — Aggregate + visibility filtering", () => {
  test("/me ưu tiên employeeId đã liên kết thay vì dò theo email", async () => {
    const linkedInserted = await db
      .insert(employees)
      .values({
        fullName: `Linked Employee ${searchSeedSuffix}`,
        dob: "1994-04-04",
        gender: "NU",
        nationalId: `LNK${searchSeedSuffix}`,
        address: "789 Linked St",
        email: `linked.${searchSeedSuffix}@example.com`,
        phone: `0922${searchSeedSuffix}`,
      })
      .returning({ id: employees.id });

    linkedEmployeeId = linkedInserted[0]?.id ?? null;

    await db
      .update(authUsers)
      .set({ employeeId: linkedEmployeeId, updatedAt: new Date() })
      .where(eq(authUsers.username, "employee_user"));

    const res = await requestAs("employee_user", "employee1234", "GET", "/api/employees/me");
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.data.employee.id).toBe(linkedEmployeeId);

    await db
      .update(authUsers)
      .set({ employeeId: employeeForMeId, updatedAt: new Date() })
      .where(eq(authUsers.username, "employee_user"));

    if (linkedEmployeeId) {
      await db.delete(employees).where(eq(employees.id, linkedEmployeeId));
      linkedEmployeeId = null;
    }
  });

  test("EMPLOYEE /me returns full aggregate with 11 keys", async () => {
    const res = await requestAs("employee_user", "employee1234", "GET", "/api/employees/me");
    expect(res.status).toBe(200);
    const body = await res.json();
    const data = body.data;

    expect(data.employee).toBeDefined();
    expect(data.employee.email).toBe("employee@test.local");
    expect(data.employee.id).toBe(employeeForMeId);

    expect(data).toHaveProperty("familyMembers");
    expect(data).toHaveProperty("bankAccounts");
    expect(data).toHaveProperty("previousJobs");
    expect(data).toHaveProperty("partyMemberships");
    expect(data).toHaveProperty("degrees");
    expect(data).toHaveProperty("certifications");
    expect(data).toHaveProperty("foreignWorkPermits");
    expect(data).toHaveProperty("allowances");
    expect(data).toHaveProperty("contracts");
    expect(data).toHaveProperty("evaluations");
  });

  test("EMPLOYEE sees only visibleToEmployee evaluations", async () => {
    const res = await requestAs("employee_user", "employee1234", "GET", "/api/employees/me");
    expect(res.status).toBe(200);
    const body = await res.json();
    const evaluations = body.data.evaluations;

    expect(evaluations.length).toBe(2);
    for (const evaluation of evaluations) {
      expect(evaluation.visibleToEmployee).toBe(true);
    }
  });

  test("TCKT sees only visibleToTckt evaluations via /:id", async () => {
    const res = await requestAs(
      "tckt_user",
      "tckt1234",
      "GET",
      `/api/employees/${employeeForMeId}`,
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    const evaluations = body.data.evaluations;

    expect(evaluations.length).toBe(2);
    for (const evaluation of evaluations) {
      expect(evaluation.visibleToTckt).toBe(true);
    }
  });

  test("TCCB sees all evaluations (no filter)", async () => {
    const res = await requestAs(
      "tccb_user",
      "tccb1234",
      "GET",
      `/api/employees/${employeeForMeId}`,
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    const evaluations = body.data.evaluations;

    expect(evaluations.length).toBe(4);
  });
});
