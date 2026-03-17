import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { cors } from "@elysiajs/cors";
import { eq } from "drizzle-orm";
import { Elysia } from "elysia";
import { authPlugin } from "../../common/plugins/auth";
import { dbPlugin } from "../../common/plugins/db";
import { errorPlugin } from "../../common/plugins/error-handler";
import { db } from "../../db";
import { employeeDegrees, employees } from "../../db/schema";
import { authRoutes } from "../auth";
import { degreeRoutes } from "./index";

const app = new Elysia()
  .use(cors({ origin: "http://localhost:5173", credentials: true }))
  .use(errorPlugin)
  .use(dbPlugin)
  .use(authPlugin)
  .use(authRoutes)
  .use(degreeRoutes);

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
      fullName: "Test Degree Employee",
      dob: "1990-01-01",
      gender: "NAM",
      nationalId: `DG_EMP_${Date.now()}`,
      address: "123 Test St",
      email: `deg.test.${Date.now()}@example.com`,
      phone: "0901234567",
    })
    .returning({ id: employees.id });
  testEmployeeId = (inserted[0] as { id: string }).id;
});

afterAll(async () => {
  for (const id of createdIds) {
    await db.delete(employeeDegrees).where(eq(employeeDegrees.id, id));
  }
  if (testEmployeeId) {
    await db.delete(employees).where(eq(employees.id, testEmployeeId));
  }
});

const BASE = () => `/api/employees/${testEmployeeId}/degrees`;

describe("RBAC — Degrees role guards", () => {
  test("ADMIN can list degrees (200)", async () => {
    const res = await adminRequest("GET", BASE());
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.items).toBeArray();
  });

  test("EMPLOYEE can list degrees (200)", async () => {
    const res = await requestAs("employee_user", "employee1234", "GET", BASE());
    expect(res.status).toBe(200);
  });

  test("EMPLOYEE cannot create degree (403)", async () => {
    const res = await requestAs("employee_user", "employee1234", "POST", BASE(), {
      degreeName: "Blocked",
      school: "Test",
    });
    expect(res.status).toBe(403);
  });

  test("TCKT cannot create degree (403)", async () => {
    const res = await requestAs("tckt_user", "tckt1234", "POST", BASE(), {
      degreeName: "Blocked",
      school: "Test",
    });
    expect(res.status).toBe(403);
  });
});

describe("CRUD — Degrees", () => {
  let degreeId: string;

  test("ADMIN can create degree (200)", async () => {
    const res = await adminRequest("POST", BASE(), {
      degreeName: "Cử nhân CNTT",
      school: "Đại học Bách Khoa",
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.degreeName).toBe("Cử nhân CNTT");
    expect(body.data.school).toBe("Đại học Bách Khoa");
    degreeId = body.data.id;
    createdIds.push(degreeId);
  });

  test("TCCB can create degree (200)", async () => {
    const res = await requestAs("tccb_user", "tccb1234", "POST", BASE(), {
      degreeName: "Thạc sĩ Kinh tế",
      school: "Đại học Kinh tế",
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    createdIds.push(body.data.id);
  });

  test("list returns created degrees with pagination", async () => {
    const res = await adminRequest("GET", BASE());
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.items.length).toBeGreaterThanOrEqual(2);
    expect(body.data.total).toBeGreaterThanOrEqual(2);
  });

  test("ADMIN can update degree (200)", async () => {
    const res = await adminRequest("PUT", `${BASE()}/${degreeId}`, {
      degreeName: "Cử nhân CNTT Updated",
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.degreeName).toBe("Cử nhân CNTT Updated");
  });

  test("EMPLOYEE cannot update degree (403)", async () => {
    const res = await requestAs("employee_user", "employee1234", "PUT", `${BASE()}/${degreeId}`, {
      degreeName: "Should not work",
    });
    expect(res.status).toBe(403);
  });

  test("EMPLOYEE cannot delete degree (403)", async () => {
    const res = await requestAs("employee_user", "employee1234", "DELETE", `${BASE()}/${degreeId}`);
    expect(res.status).toBe(403);
  });

  test("ADMIN can delete degree (200)", async () => {
    const res = await adminRequest("DELETE", `${BASE()}/${degreeId}`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.id).toBe(degreeId);
    const idx = createdIds.indexOf(degreeId);
    if (idx > -1) createdIds.splice(idx, 1);
  });
});

describe("Validation — Degrees", () => {
  test("empty degreeName returns validation error", async () => {
    const res = await adminRequest("POST", BASE(), {
      degreeName: "",
      school: "Test",
    });
    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  test("empty school returns validation error", async () => {
    const res = await adminRequest("POST", BASE(), {
      degreeName: "Test",
      school: "",
    });
    expect(res.status).toBeGreaterThanOrEqual(400);
  });
});
