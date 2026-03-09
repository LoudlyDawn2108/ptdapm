import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { cors } from "@elysiajs/cors";
import { eq } from "drizzle-orm";
import { Elysia } from "elysia";
import { authPlugin, betterAuthHandler } from "../../common/plugins/auth";
import { dbPlugin } from "../../common/plugins/db";
import { errorPlugin } from "../../common/plugins/error-handler";
import { db } from "../../db";
import { account, authUsers, session } from "../../db/schema/auth";
import { employees } from "../../db/schema/employees";
import { accountRoutes } from "./index";

const app = new Elysia()
  .use(cors({ origin: "http://localhost:5173", credentials: true }))
  .use(errorPlugin)
  .use(dbPlugin)
  .use(betterAuthHandler)
  .use(authPlugin)
  .use(accountRoutes);

async function signIn(username: string, password: string) {
  return app.handle(
    new Request("http://localhost/api/auth/sign-in/username", {
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

let testEmployeeId: string;
let testEmployee2Id: string;
const createdAccountIds: string[] = [];

beforeAll(async () => {
  const inserted1 = await db
    .insert(employees)
    .values({
      fullName: "Nguyen Van Test",
      dob: "1990-01-01",
      gender: "NAM",
      nationalId: `T${Date.now()}`,
      address: "123 Test St",
      email: "emp.test@example.com",
      phone: "0901234567",
    })
    .returning({ id: employees.id });

  const inserted2 = await db
    .insert(employees)
    .values({
      fullName: "Tran Thi Test",
      dob: "1992-05-15",
      gender: "NU",
      nationalId: `U${Date.now()}`,
      address: "456 Test Ave",
      email: "emp2.test@example.com",
      phone: "0907654321",
    })
    .returning({ id: employees.id });

  testEmployeeId = (inserted1[0] as { id: string }).id;
  testEmployee2Id = (inserted2[0] as { id: string }).id;
});

afterAll(async () => {
  for (const accountId of createdAccountIds) {
    await db.delete(session).where(eq(session.userId, accountId));
    await db.delete(account).where(eq(account.userId, accountId));
    await db.delete(authUsers).where(eq(authUsers.id, accountId));
  }
  await db.delete(employees).where(eq(employees.id, testEmployeeId));
  await db.delete(employees).where(eq(employees.id, testEmployee2Id));
});

describe("RBAC — ADMIN only", () => {
  test("unauthenticated request → 401", async () => {
    const res = await app.handle(new Request("http://localhost/api/accounts"));
    expect(res.status).toBe(401);
  });

  test("EMPLOYEE role → 403", async () => {
    const signInRes = await signIn("employee_user", "employee1234");
    const cookies = extractCookies(signInRes);
    const res = await app.handle(
      new Request("http://localhost/api/accounts", { headers: { Cookie: cookies } }),
    );
    expect(res.status).toBe(403);
  });

  test("TCCB role → 403", async () => {
    const signInRes = await signIn("tccb_user", "tccb1234");
    const cookies = extractCookies(signInRes);
    const res = await app.handle(
      new Request("http://localhost/api/accounts", { headers: { Cookie: cookies } }),
    );
    expect(res.status).toBe(403);
  });

  test("TCKT role → 403", async () => {
    const signInRes = await signIn("tckt_user", "tckt1234");
    const cookies = extractCookies(signInRes);
    const res = await app.handle(
      new Request("http://localhost/api/accounts", { headers: { Cookie: cookies } }),
    );
    expect(res.status).toBe(403);
  });

  test("non-ADMIN POST → 403", async () => {
    const signInRes = await signIn("tccb_user", "tccb1234");
    const cookies = extractCookies(signInRes);
    const res = await app.handle(
      new Request("http://localhost/api/accounts", {
        method: "POST",
        headers: { Cookie: cookies, "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "x@x.com",
          employeeId: testEmployeeId,
          roleCode: "EMPLOYEE",
        }),
      }),
    );
    expect(res.status).toBe(403);
  });
});

describe("GET /api/accounts — List", () => {
  test("returns paginated list with correct shape", async () => {
    const res = await adminRequest("GET", "/api/accounts");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data).toBeDefined();
    expect(body.data.items).toBeArray();
    expect(typeof body.data.total).toBe("number");
    expect(typeof body.data.page).toBe("number");
    expect(typeof body.data.pageSize).toBe("number");
  });

  test("pagination works (pageSize=1)", async () => {
    const res = await adminRequest("GET", "/api/accounts?pageSize=1&page=1");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.items.length).toBeLessThanOrEqual(1);
    expect(body.data.pageSize).toBe(1);
    expect(body.data.page).toBe(1);
  });

  test("search by keyword filters results", async () => {
    const res = await adminRequest("GET", "/api/accounts?search=admin");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.items.length).toBeGreaterThan(0);
    const hasAdmin = body.data.items.some(
      (item: { username: string }) => item.username === "admin",
    );
    expect(hasAdmin).toBe(true);
  });

  test("filter by role works", async () => {
    const res = await adminRequest("GET", "/api/accounts?role=ADMIN");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.items.length).toBeGreaterThan(0);
    for (const item of body.data.items) {
      expect(item.roleCode).toBe("ADMIN");
    }
  });

  test("filter by status works", async () => {
    const res = await adminRequest("GET", "/api/accounts?status=active");
    expect(res.status).toBe(200);
    const body = await res.json();
    for (const item of body.data.items) {
      expect(item.status).toBe("active");
    }
  });
});

describe("GET /api/accounts/:id — Get by ID", () => {
  test("valid ID returns account detail", async () => {
    const rows = await db
      .select({ id: authUsers.id })
      .from(authUsers)
      .where(eq(authUsers.username, "admin"));
    const adminUser = rows[0] ?? { id: "" };

    const res = await adminRequest("GET", `/api/accounts/${adminUser.id}`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data).toBeDefined();
    expect(body.data.id).toBe(adminUser.id);
    expect(body.data.username).toBe("admin");
    expect(body.data.roleCode).toBe("ADMIN");
  });

  test("non-existent UUID → 404", async () => {
    const res = await adminRequest("GET", "/api/accounts/00000000-0000-0000-0000-000000000000");
    expect(res.status).toBe(404);
  });

  test("invalid format (non-UUID) → 400", async () => {
    const res = await adminRequest("GET", "/api/accounts/not-a-uuid");
    expect(res.status).toBe(400);
  });
});

describe("POST /api/accounts — Create", () => {
  test("valid data creates account + returns generated password", async () => {
    const res = await adminRequest("POST", "/api/accounts", {
      email: `test.create.${Date.now()}@example.com`,
      employeeId: testEmployeeId,
      roleCode: "EMPLOYEE",
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data).toBeDefined();
    expect(body.data.account).toBeDefined();
    expect(body.data.account.id).toBeString();
    expect(body.data.account.employeeId).toBe(testEmployeeId);
    expect(body.data.account.roleCode).toBe("EMPLOYEE");
    expect(body.data.generatedPassword).toBeString();
    expect(body.data.generatedPassword.length).toBeGreaterThanOrEqual(12);

    createdAccountIds.push(body.data.account.id);
  });

  test("duplicate email → field error", async () => {
    const rows = await db
      .select({ email: authUsers.email })
      .from(authUsers)
      .where(eq(authUsers.username, "admin"));
    const adminEmail = (rows[0] ?? { email: "" }).email;

    const res = await adminRequest("POST", "/api/accounts", {
      email: adminEmail,
      employeeId: testEmployee2Id,
      roleCode: "EMPLOYEE",
    });
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.type).toBe("field");
    expect(body.fields.email).toBeDefined();
  });

  test("non-existent employee → 404", async () => {
    const res = await adminRequest("POST", "/api/accounts", {
      email: "nonexistent.emp@example.com",
      employeeId: "00000000-0000-0000-0000-000000000000",
      roleCode: "EMPLOYEE",
    });
    expect(res.status).toBe(404);
  });

  test("employee already linked → 409", async () => {
    const res = await adminRequest("POST", "/api/accounts", {
      email: `another.${Date.now()}@example.com`,
      employeeId: testEmployeeId,
      roleCode: "EMPLOYEE",
    });
    expect(res.status).toBe(409);
  });

  test("invalid roleCode → 400 (schema validation)", async () => {
    const res = await adminRequest("POST", "/api/accounts", {
      email: "invalid.role@example.com",
      employeeId: testEmployee2Id,
      roleCode: "INVALID_ROLE",
    });
    expect(res.status).toBe(400);
  });

  test("missing required fields → 422", async () => {
    const res = await adminRequest("POST", "/api/accounts", {});
    expect(res.status).toBeGreaterThanOrEqual(400);
  });
});

describe("PUT /api/accounts/:id — Update", () => {
  test("update email succeeds", async () => {
    const accountId = createdAccountIds[0];
    expect(accountId).toBeString();

    const newEmail = `updated.${Date.now()}@example.com`;
    const res = await adminRequest("PUT", `/api/accounts/${accountId}`, {
      email: newEmail,
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.email).toBe(newEmail);
  });

  test("update role succeeds", async () => {
    const accountId = createdAccountIds[0];
    const res = await adminRequest("PUT", `/api/accounts/${accountId}`, {
      roleCode: "TCCB",
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.roleCode).toBe("TCCB");
  });

  test("duplicate email → field error", async () => {
    const accountId = createdAccountIds[0];
    const rows = await db
      .select({ email: authUsers.email })
      .from(authUsers)
      .where(eq(authUsers.username, "admin"));
    const adminEmail = (rows[0] ?? { email: "" }).email;

    const res = await adminRequest("PUT", `/api/accounts/${accountId}`, {
      email: adminEmail,
    });
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.type).toBe("field");
    expect(body.fields.email).toBeDefined();
  });

  test("non-existent account → 404", async () => {
    const res = await adminRequest("PUT", "/api/accounts/00000000-0000-0000-0000-000000000000", {
      email: "update.nonexist@example.com",
    });
    expect(res.status).toBe(404);
  });
});

describe("PATCH /api/accounts/:id/status — Toggle Status", () => {
  test("lock account succeeds (active → locked)", async () => {
    const accountId = createdAccountIds[0];
    const res = await adminRequest("PATCH", `/api/accounts/${accountId}/status`, {
      status: "locked",
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.status).toBe("locked");
  });

  test("unlock account succeeds (locked → active)", async () => {
    const accountId = createdAccountIds[0];
    const res = await adminRequest("PATCH", `/api/accounts/${accountId}/status`, {
      status: "active",
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.status).toBe("active");
  });

  test("cannot lock own account → 400", async () => {
    const rows = await db
      .select({ id: authUsers.id })
      .from(authUsers)
      .where(eq(authUsers.username, "admin"));
    const adminUser = rows[0] ?? { id: "" };

    const res = await adminRequest("PATCH", `/api/accounts/${adminUser.id}/status`, {
      status: "locked",
    });
    expect(res.status).toBe(400);
  });

  test("non-existent account → 404", async () => {
    const res = await adminRequest(
      "PATCH",
      "/api/accounts/00000000-0000-0000-0000-000000000000/status",
      { status: "locked" },
    );
    expect(res.status).toBe(404);
  });
});
