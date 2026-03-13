import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { cors } from "@elysiajs/cors";
import { eq } from "drizzle-orm";
import { Elysia } from "elysia";
import { authPlugin } from "../../common/plugins/auth";
import { dbPlugin } from "../../common/plugins/db";
import { errorPlugin } from "../../common/plugins/error-handler";
import { db } from "../../db";
import { employeeBankAccounts, employees } from "../../db/schema";
import { authRoutes } from "../auth";
import { bankAccountRoutes } from "./index";

const app = new Elysia()
  .use(cors({ origin: "http://localhost:5173", credentials: true }))
  .use(errorPlugin)
  .use(dbPlugin)
  .use(authPlugin)
  .use(authRoutes)
  .use(bankAccountRoutes);

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
      fullName: "Test BankAccount Employee",
      dob: "1990-01-01",
      gender: "NAM",
      nationalId: `BA_EMP_${Date.now()}`,
      address: "123 Test St",
      email: `ba.test.${Date.now()}@example.com`,
      phone: "0901234567",
    })
    .returning({ id: employees.id });
  testEmployeeId = (inserted[0] as { id: string }).id;
});

afterAll(async () => {
  for (const id of createdIds) {
    await db.delete(employeeBankAccounts).where(eq(employeeBankAccounts.id, id));
  }
  if (testEmployeeId) {
    await db.delete(employees).where(eq(employees.id, testEmployeeId));
  }
});

const BASE = () => `/api/employees/${testEmployeeId}/bank-accounts`;

describe("RBAC — Bank Accounts role guards", () => {
  test("ADMIN can list bank accounts (200)", async () => {
    const res = await adminRequest("GET", BASE());
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.items).toBeArray();
  });

  test("EMPLOYEE can list bank accounts (200)", async () => {
    const res = await requestAs("employee_user", "employee1234", "GET", BASE());
    expect(res.status).toBe(200);
  });

  test("EMPLOYEE cannot create bank account (403)", async () => {
    const res = await requestAs("employee_user", "employee1234", "POST", BASE(), {
      bankName: "Blocked Bank",
      accountNo: "000000",
      isPrimary: true,
    });
    expect(res.status).toBe(403);
  });

  test("TCKT cannot create bank account (403)", async () => {
    const res = await requestAs("tckt_user", "tckt1234", "POST", BASE(), {
      bankName: "Blocked Bank",
      accountNo: "000000",
      isPrimary: true,
    });
    expect(res.status).toBe(403);
  });
});

describe("CRUD — Bank Accounts", () => {
  let accountId: string;

  test("ADMIN can create bank account (200)", async () => {
    const res = await adminRequest("POST", BASE(), {
      bankName: "Techcombank",
      accountNo: "19001234567890",
      isPrimary: true,
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.bankName).toBe("Techcombank");
    expect(body.data.accountNo).toBe("19001234567890");
    expect(body.data.isPrimary).toBe(true);
    accountId = body.data.id;
    createdIds.push(accountId);
  });

  test("TCCB can create bank account (200)", async () => {
    const res = await requestAs("tccb_user", "tccb1234", "POST", BASE(), {
      bankName: "Vietcombank",
      accountNo: "00112233445566",
      isPrimary: false,
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.isPrimary).toBe(false);
    createdIds.push(body.data.id);
  });

  test("list returns created accounts with pagination", async () => {
    const res = await adminRequest("GET", BASE());
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.items.length).toBeGreaterThanOrEqual(2);
    expect(body.data.total).toBeGreaterThanOrEqual(2);
  });

  test("creating isPrimary=true demotes existing primary", async () => {
    const res = await adminRequest("POST", BASE(), {
      bankName: "BIDV",
      accountNo: "99887766554433",
      isPrimary: true,
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.isPrimary).toBe(true);
    createdIds.push(body.data.id);

    // The first account should no longer be primary
    const listRes = await adminRequest("GET", BASE());
    const listBody = await listRes.json();
    const firstAccount = listBody.data.items.find((a: { id: string }) => a.id === accountId);
    expect(firstAccount.isPrimary).toBe(false);
  });

  test("ADMIN can update bank account (200)", async () => {
    const res = await adminRequest("PUT", `${BASE()}/${accountId}`, {
      bankName: "Techcombank Updated",
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.bankName).toBe("Techcombank Updated");
  });

  test("EMPLOYEE cannot delete bank account (403)", async () => {
    const res = await requestAs(
      "employee_user",
      "employee1234",
      "DELETE",
      `${BASE()}/${accountId}`,
    );
    expect(res.status).toBe(403);
  });

  test("ADMIN can delete bank account (200)", async () => {
    const res = await adminRequest("DELETE", `${BASE()}/${accountId}`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.id).toBe(accountId);
    const idx = createdIds.indexOf(accountId);
    if (idx > -1) createdIds.splice(idx, 1);
  });
});
