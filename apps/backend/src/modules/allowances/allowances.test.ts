import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { cors } from "@elysiajs/cors";
import { eq } from "drizzle-orm";
import { Elysia } from "elysia";
import { authPlugin } from "../../common/plugins/auth";
import { dbPlugin } from "../../common/plugins/db";
import { errorPlugin } from "../../common/plugins/error-handler";
import { db } from "../../db";
import { allowanceTypes, employeeAllowances, employees } from "../../db/schema";
import { authRoutes } from "../auth";
import { allowanceRoutes } from "./index";

const app = new Elysia()
  .use(cors({ origin: "http://localhost:5173", credentials: true }))
  .use(errorPlugin)
  .use(dbPlugin)
  .use(authPlugin)
  .use(authRoutes)
  .use(allowanceRoutes);

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
let testAllowanceTypeId: string;
const createdAllowanceIds: string[] = [];

beforeAll(async () => {
  // Create test employee
  const inserted = await db
    .insert(employees)
    .values({
      fullName: "Test Allowance Employee",
      dob: "1990-01-01",
      gender: "NAM",
      nationalId: `AL_EMP_${Date.now()}`,
      address: "123 Test St",
      email: `al.test.${Date.now()}@example.com`,
      phone: "0901234567",
    })
    .returning({ id: employees.id });
  testEmployeeId = (inserted[0] as { id: string }).id;

  // Create test allowance type (required FK for employee_allowances)
  const typeInserted = await db
    .insert(allowanceTypes)
    .values({
      allowanceName: `Test Allowance Type ${Date.now()}`,
      description: "For testing",
      calcMethod: "fixed",
    })
    .returning({ id: allowanceTypes.id });
  testAllowanceTypeId = (typeInserted[0] as { id: string }).id;
});

afterAll(async () => {
  for (const id of createdAllowanceIds) {
    await db.delete(employeeAllowances).where(eq(employeeAllowances.id, id));
  }
  if (testEmployeeId) {
    await db.delete(employees).where(eq(employees.id, testEmployeeId));
  }
  if (testAllowanceTypeId) {
    await db.delete(allowanceTypes).where(eq(allowanceTypes.id, testAllowanceTypeId));
  }
});

const BASE = () => `/api/employees/${testEmployeeId}/allowances`;

describe("RBAC — Allowances role guards", () => {
  test("TCCB can list allowances (200)", async () => {
    const res = await tccbRequest("GET", BASE());
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.items).toBeArray();
  });

  test("TCKT can list allowances (200)", async () => {
    const res = await requestAs("tckt_user", "tckt1234", "GET", BASE());
    expect(res.status).toBe(200);
  });

  test("EMPLOYEE cannot list allowances (403)", async () => {
    const res = await requestAs("employee_user", "employee1234", "GET", BASE());
    expect(res.status).toBe(403);
  });

  test("ADMIN cannot list allowances (403)", async () => {
    const res = await requestAs("admin", "admin123", "GET", BASE());
    expect(res.status).toBe(403);
  });

  test("EMPLOYEE cannot create allowance (403)", async () => {
    const res = await requestAs("employee_user", "employee1234", "POST", BASE(), {
      allowanceTypeId: testAllowanceTypeId,
      amount: 500000,
    });
    expect(res.status).toBe(403);
  });

  test("TCKT cannot create allowance (403)", async () => {
    const res = await requestAs("tckt_user", "tckt1234", "POST", BASE(), {
      allowanceTypeId: testAllowanceTypeId,
      amount: 500000,
    });
    expect(res.status).toBe(403);
  });
});

describe("CRUD — Allowances", () => {
  let allowanceId: string;

  test("TCCB can create allowance (200)", async () => {
    const res = await tccbRequest("POST", BASE(), {
      allowanceTypeId: testAllowanceTypeId,
      amount: 1500000,
      note: "Phu cap an trua",
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.allowanceTypeId).toBe(testAllowanceTypeId);
    expect(body.data.note).toBe("Phu cap an trua");
    allowanceId = body.data.id;
    createdAllowanceIds.push(allowanceId);
  });

  test("ADMIN cannot create allowance (403)", async () => {
    const res = await requestAs("admin", "admin123", "POST", BASE(), {
      allowanceTypeId: testAllowanceTypeId,
      amount: 700000,
      note: "Blocked admin allowance",
    });
    expect(res.status).toBe(403);
  });

  test("TCCB can create additional allowance (200)", async () => {
    const res = await requestAs("tccb_user", "tccb1234", "POST", BASE(), {
      allowanceTypeId: testAllowanceTypeId,
      amount: 800000,
      note: "Phu cap di lai",
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    createdAllowanceIds.push(body.data.id);
  });

  test("list returns created allowances with pagination", async () => {
    const res = await tccbRequest("GET", BASE());
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.items.length).toBeGreaterThanOrEqual(2);
    expect(body.data.total).toBeGreaterThanOrEqual(2);
  });

  test("TCCB can update allowance (200)", async () => {
    const res = await tccbRequest("PUT", `${BASE()}/${allowanceId}`, {
      amount: 2000000,
      note: "Cap nhat phu cap",
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.note).toBe("Cap nhat phu cap");
  });

  test("EMPLOYEE cannot update allowance (403)", async () => {
    const res = await requestAs(
      "employee_user",
      "employee1234",
      "PUT",
      `${BASE()}/${allowanceId}`,
      { note: "Should not work" },
    );
    expect(res.status).toBe(403);
  });

  test("EMPLOYEE cannot delete allowance (403)", async () => {
    const res = await requestAs(
      "employee_user",
      "employee1234",
      "DELETE",
      `${BASE()}/${allowanceId}`,
    );
    expect(res.status).toBe(403);
  });

  test("TCCB can delete allowance (200)", async () => {
    const res = await tccbRequest("DELETE", `${BASE()}/${allowanceId}`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.id).toBe(allowanceId);
    const idx = createdAllowanceIds.indexOf(allowanceId);
    if (idx > -1) createdAllowanceIds.splice(idx, 1);
  });
});

describe("Validation — Allowances", () => {
  test("invalid allowanceTypeId returns error", async () => {
    const res = await tccbRequest("POST", BASE(), {
      allowanceTypeId: "00000000-0000-0000-0000-000000000000",
      amount: 100000,
    });
    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  test("allowance with null amount is valid (200)", async () => {
    const res = await tccbRequest("POST", BASE(), {
      allowanceTypeId: testAllowanceTypeId,
      note: "No amount specified",
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    createdAllowanceIds.push(body.data.id);
  });
});
