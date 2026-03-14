import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { cors } from "@elysiajs/cors";
import { eq } from "drizzle-orm";
import { Elysia } from "elysia";
import { authPlugin } from "../../common/plugins/auth";
import { dbPlugin } from "../../common/plugins/db";
import { errorPlugin } from "../../common/plugins/error-handler";
import { db } from "../../db";
import { employeeFamilyMembers, employees } from "../../db/schema";
import { authRoutes } from "../auth";
import { familyMemberRoutes } from "./index";

const app = new Elysia()
  .use(cors({ origin: "http://localhost:5173", credentials: true }))
  .use(errorPlugin)
  .use(dbPlugin)
  .use(authPlugin)
  .use(authRoutes)
  .use(familyMemberRoutes);

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
      fullName: "Test FamilyMember Employee",
      dob: "1990-01-01",
      gender: "NAM",
      nationalId: `FM_EMP_${Date.now()}`,
      address: "123 Test St",
      email: `fm.test.${Date.now()}@example.com`,
      phone: "0901234567",
    })
    .returning({ id: employees.id });
  testEmployeeId = (inserted[0] as { id: string }).id;
});

afterAll(async () => {
  for (const id of createdIds) {
    await db.delete(employeeFamilyMembers).where(eq(employeeFamilyMembers.id, id));
  }
  if (testEmployeeId) {
    await db.delete(employees).where(eq(employees.id, testEmployeeId));
  }
});

const BASE = () => `/api/employees/${testEmployeeId}/family-members`;

describe("RBAC — Family Members role guards", () => {
  test("ADMIN can list family members (200)", async () => {
    const res = await adminRequest("GET", BASE());
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data).toBeDefined();
    expect(body.data.items).toBeArray();
  });

  test("TCCB can list family members (200)", async () => {
    const res = await requestAs("tccb_user", "tccb1234", "GET", BASE());
    expect(res.status).toBe(200);
  });

  test("TCKT can list family members (200)", async () => {
    const res = await requestAs("tckt_user", "tckt1234", "GET", BASE());
    expect(res.status).toBe(200);
  });

  test("EMPLOYEE can list family members (200)", async () => {
    const res = await requestAs("employee_user", "employee1234", "GET", BASE());
    expect(res.status).toBe(200);
  });

  test("EMPLOYEE cannot create family member (403)", async () => {
    const res = await requestAs("employee_user", "employee1234", "POST", BASE(), {
      relation: "CHA",
      fullName: "Blocked Parent",
    });
    expect(res.status).toBe(403);
  });

  test("TCKT cannot create family member (403)", async () => {
    const res = await requestAs("tckt_user", "tckt1234", "POST", BASE(), {
      relation: "CHA",
      fullName: "Blocked Parent",
    });
    expect(res.status).toBe(403);
  });
});

describe("CRUD — Family Members", () => {
  let memberId: string;

  test("ADMIN can create family member (200)", async () => {
    const res = await adminRequest("POST", BASE(), {
      relation: "CHA",
      fullName: "Nguyen Van Cha",
      dob: "1960-05-15",
      phone: "0901111111",
      note: "Cha ruột",
      isDependent: false,
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data).toBeDefined();
    expect(body.data.fullName).toBe("Nguyen Van Cha");
    expect(body.data.relation).toBe("CHA");
    memberId = body.data.id;
    createdIds.push(memberId);
  });

  test("TCCB can create family member (200)", async () => {
    const res = await requestAs("tccb_user", "tccb1234", "POST", BASE(), {
      relation: "ME",
      fullName: "Tran Thi Me",
      isDependent: false,
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    createdIds.push(body.data.id);
  });

  test("list returns created members with pagination", async () => {
    const res = await adminRequest("GET", BASE());
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.items.length).toBeGreaterThanOrEqual(2);
    expect(body.data.total).toBeGreaterThanOrEqual(2);
    expect(body.data.page).toBe(1);
  });

  test("ADMIN can update family member (200)", async () => {
    const res = await adminRequest("PUT", `${BASE()}/${memberId}`, {
      fullName: "Nguyen Van Cha Updated",
      isDependent: true,
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.fullName).toBe("Nguyen Van Cha Updated");
    expect(body.data.isDependent).toBe(true);
  });

  test("EMPLOYEE cannot update family member (403)", async () => {
    const res = await requestAs("employee_user", "employee1234", "PUT", `${BASE()}/${memberId}`, {
      fullName: "Should not work",
    });
    expect(res.status).toBe(403);
  });

  test("EMPLOYEE cannot delete family member (403)", async () => {
    const res = await requestAs("employee_user", "employee1234", "DELETE", `${BASE()}/${memberId}`);
    expect(res.status).toBe(403);
  });

  test("ADMIN can delete family member (200)", async () => {
    const res = await adminRequest("DELETE", `${BASE()}/${memberId}`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.id).toBe(memberId);
    // Remove from cleanup list since already deleted
    const idx = createdIds.indexOf(memberId);
    if (idx > -1) createdIds.splice(idx, 1);
  });
});
