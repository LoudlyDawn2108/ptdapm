import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { cors } from "@elysiajs/cors";
import { eq } from "drizzle-orm";
import { Elysia } from "elysia";
import { authPlugin } from "../../common/plugins/auth";
import { dbPlugin } from "../../common/plugins/db";
import { errorPlugin } from "../../common/plugins/error-handler";
import { db } from "../../db";
import { employeePartyMemberships, employees } from "../../db/schema";
import { authRoutes } from "../auth";
import { partyMembershipRoutes } from "./index";

const app = new Elysia()
  .use(cors({ origin: "http://localhost:5173", credentials: true }))
  .use(errorPlugin)
  .use(dbPlugin)
  .use(authPlugin)
  .use(authRoutes)
  .use(partyMembershipRoutes);

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
      fullName: "Test PartyMembership Employee",
      dob: "1990-01-01",
      gender: "NAM",
      nationalId: `PM_EMP_${Date.now()}`,
      address: "123 Test St",
      email: `pm.test.${Date.now()}@example.com`,
      phone: "0901234567",
    })
    .returning({ id: employees.id });
  testEmployeeId = (inserted[0] as { id: string }).id;
});

afterAll(async () => {
  for (const id of createdIds) {
    await db.delete(employeePartyMemberships).where(eq(employeePartyMemberships.id, id));
  }
  if (testEmployeeId) {
    await db.delete(employees).where(eq(employees.id, testEmployeeId));
  }
});

const BASE = () => `/api/employees/${testEmployeeId}/party-memberships`;

describe("RBAC — Party Memberships role guards", () => {
  test("ADMIN can list party memberships (200)", async () => {
    const res = await adminRequest("GET", BASE());
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.items).toBeArray();
  });

  test("EMPLOYEE can list party memberships (200)", async () => {
    const res = await requestAs("employee_user", "employee1234", "GET", BASE());
    expect(res.status).toBe(200);
  });

  test("EMPLOYEE cannot create party membership (403)", async () => {
    const res = await requestAs("employee_user", "employee1234", "POST", BASE(), {
      organizationType: "DOAN",
      joinedOn: "2010-03-26",
      details: "Blocked",
    });
    expect(res.status).toBe(403);
  });

  test("TCKT cannot create party membership (403)", async () => {
    const res = await requestAs("tckt_user", "tckt1234", "POST", BASE(), {
      organizationType: "DOAN",
      joinedOn: "2010-03-26",
      details: "Blocked",
    });
    expect(res.status).toBe(403);
  });
});

describe("CRUD — Party Memberships", () => {
  let membershipId: string;

  test("ADMIN can create DOAN membership (200)", async () => {
    const res = await adminRequest("POST", BASE(), {
      organizationType: "DOAN",
      joinedOn: "2010-03-26",
      details: "Gia nhap Doan thanh nien",
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.organizationType).toBe("DOAN");
    expect(body.data.joinedOn).toBe("2010-03-26");
    membershipId = body.data.id;
    createdIds.push(membershipId);
  });

  test("TCCB can create DANG membership (200)", async () => {
    const res = await requestAs("tccb_user", "tccb1234", "POST", BASE(), {
      organizationType: "DANG",
      joinedOn: "2015-07-01",
      details: "Ket nap Dang vien",
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.organizationType).toBe("DANG");
    createdIds.push(body.data.id);
  });

  test("list returns created memberships with pagination", async () => {
    const res = await adminRequest("GET", BASE());
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.items.length).toBeGreaterThanOrEqual(2);
    expect(body.data.total).toBeGreaterThanOrEqual(2);
  });

  test("ADMIN can update party membership (200)", async () => {
    const res = await adminRequest("PUT", `${BASE()}/${membershipId}`, {
      details: "Cap nhat chi tiet Doan",
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.details).toBe("Cap nhat chi tiet Doan");
  });

  test("EMPLOYEE cannot update party membership (403)", async () => {
    const res = await requestAs(
      "employee_user",
      "employee1234",
      "PUT",
      `${BASE()}/${membershipId}`,
      { details: "Should not work" },
    );
    expect(res.status).toBe(403);
  });

  test("EMPLOYEE cannot delete party membership (403)", async () => {
    const res = await requestAs(
      "employee_user",
      "employee1234",
      "DELETE",
      `${BASE()}/${membershipId}`,
    );
    expect(res.status).toBe(403);
  });

  test("ADMIN can delete party membership (200)", async () => {
    const res = await adminRequest("DELETE", `${BASE()}/${membershipId}`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.id).toBe(membershipId);
    const idx = createdIds.indexOf(membershipId);
    if (idx > -1) createdIds.splice(idx, 1);
  });
});
