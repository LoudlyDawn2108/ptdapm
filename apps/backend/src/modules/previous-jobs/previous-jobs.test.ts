import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { cors } from "@elysiajs/cors";
import { eq } from "drizzle-orm";
import { Elysia } from "elysia";
import { authPlugin } from "../../common/plugins/auth";
import { dbPlugin } from "../../common/plugins/db";
import { errorPlugin } from "../../common/plugins/error-handler";
import { db } from "../../db";
import { employeePreviousJobs, employees } from "../../db/schema";
import { authRoutes } from "../auth";
import { previousJobRoutes } from "./index";

const app = new Elysia()
  .use(cors({ origin: "http://localhost:5173", credentials: true }))
  .use(errorPlugin)
  .use(dbPlugin)
  .use(authPlugin)
  .use(authRoutes)
  .use(previousJobRoutes);

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

async function adminRequest(method: string, path: string, body?: unknown) {
  return requestAs("admin", "admin123", method, path, body);
}

let testEmployeeId: string;
const createdIds: string[] = [];

beforeAll(async () => {
  const inserted = await db
    .insert(employees)
    .values({
      fullName: "Test PreviousJob Employee",
      dob: "1990-01-01",
      gender: "NAM",
      nationalId: `PJ_EMP_${Date.now()}`,
      address: "123 Test St",
      email: `pj.test.${Date.now()}@example.com`,
      phone: "0901234567",
    })
    .returning({ id: employees.id });
  testEmployeeId = (inserted[0] as { id: string }).id;
});

afterAll(async () => {
  for (const id of createdIds) {
    await db.delete(employeePreviousJobs).where(eq(employeePreviousJobs.id, id));
  }
  if (testEmployeeId) {
    await db.delete(employees).where(eq(employees.id, testEmployeeId));
  }
});

const BASE = () => `/api/employees/${testEmployeeId}/previous-jobs`;

describe("RBAC — Previous Jobs role guards", () => {
  test("ADMIN can list previous jobs (200)", async () => {
    const res = await adminRequest("GET", BASE());
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.items).toBeArray();
  });

  test("EMPLOYEE can list previous jobs (200)", async () => {
    const res = await requestAs("employee_user", "employee1234", "GET", BASE());
    expect(res.status).toBe(200);
  });

  test("EMPLOYEE cannot create previous job (403)", async () => {
    const res = await requestAs("employee_user", "employee1234", "POST", BASE(), {
      workplace: "Blocked Corp",
      startedOn: "2015-01-01",
      endedOn: "2018-12-31",
    });
    expect(res.status).toBe(403);
  });

  test("TCKT cannot create previous job (403)", async () => {
    const res = await requestAs("tckt_user", "tckt1234", "POST", BASE(), {
      workplace: "Blocked Corp",
      startedOn: "2015-01-01",
      endedOn: "2018-12-31",
    });
    expect(res.status).toBe(403);
  });
});

describe("CRUD — Previous Jobs", () => {
  let jobId: string;

  test("ADMIN can create previous job (200)", async () => {
    const res = await adminRequest("POST", BASE(), {
      workplace: "Cong ty ABC",
      startedOn: "2015-01-01",
      endedOn: "2018-12-31",
      note: "Lam viec tai phong IT",
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.workplace).toBe("Cong ty ABC");
    expect(body.data.startedOn).toBe("2015-01-01");
    expect(body.data.endedOn).toBe("2018-12-31");
    jobId = body.data.id;
    createdIds.push(jobId);
  });

  test("TCCB can create previous job (200)", async () => {
    const res = await requestAs("tccb_user", "tccb1234", "POST", BASE(), {
      workplace: "Dai hoc XYZ",
      startedOn: "2019-01-01",
      endedOn: "2022-06-30",
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    createdIds.push(body.data.id);
  });

  test("list returns created jobs with pagination", async () => {
    const res = await adminRequest("GET", BASE());
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.items.length).toBeGreaterThanOrEqual(2);
    expect(body.data.total).toBeGreaterThanOrEqual(2);
  });

  test("ADMIN can update previous job (200)", async () => {
    const res = await adminRequest("PUT", `${BASE()}/${jobId}`, {
      workplace: "Cong ty ABC Updated",
      note: "Cap nhat ghi chu",
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.workplace).toBe("Cong ty ABC Updated");
  });

  test("EMPLOYEE cannot update previous job (403)", async () => {
    const res = await requestAs("employee_user", "employee1234", "PUT", `${BASE()}/${jobId}`, {
      workplace: "Should not work",
    });
    expect(res.status).toBe(403);
  });

  test("EMPLOYEE cannot delete previous job (403)", async () => {
    const res = await requestAs("employee_user", "employee1234", "DELETE", `${BASE()}/${jobId}`);
    expect(res.status).toBe(403);
  });

  test("ADMIN can delete previous job (200)", async () => {
    const res = await adminRequest("DELETE", `${BASE()}/${jobId}`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.id).toBe(jobId);
    const idx = createdIds.indexOf(jobId);
    if (idx > -1) createdIds.splice(idx, 1);
  });
});

describe("Validation — Previous Jobs", () => {
  test("endedOn before startedOn returns validation error", async () => {
    const res = await adminRequest("POST", BASE(), {
      workplace: "Invalid dates",
      startedOn: "2020-01-01",
      endedOn: "2019-01-01",
    });
    // Elysia validates via Zod — should return 422 or 400
    expect(res.status).toBeGreaterThanOrEqual(400);
  });
});
