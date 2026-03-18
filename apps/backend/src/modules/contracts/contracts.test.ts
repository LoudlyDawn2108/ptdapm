import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { cors } from "@elysiajs/cors";
import { eq } from "drizzle-orm";
import { Elysia } from "elysia";
import { authPlugin } from "../../common/plugins/auth";
import { dbPlugin } from "../../common/plugins/db";
import { errorPlugin } from "../../common/plugins/error-handler";
import { db } from "../../db";
import { campuses } from "../../db/schema/campuses";
import { contractAppendices, contractTypes, employmentContracts } from "../../db/schema/contracts";
import { employees } from "../../db/schema/employees";
import { orgUnits } from "../../db/schema/organization";
import { authRoutes } from "../auth";
import { contractAppendixRoutes, contractRoutes } from "./index";

const app = new Elysia()
  .use(cors({ origin: "http://localhost:5173", credentials: true }))
  .use(errorPlugin)
  .use(dbPlugin)
  .use(authPlugin)
  .use(authRoutes)
  .use(contractRoutes)
  .use(contractAppendixRoutes);

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

async function requestWithCookies(method: string, path: string, cookies: string, body?: unknown) {
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

let tccbCookies: string;
let tcktCookies: string;
let employeeCookies: string;

let testEmployeeId: string;
let testContractTypeId: string;
let testOrgUnitId: string;
let testCampusId: string;

let createdContractId: string;
let createdAppendixId: string;

const uniqueSuffix = Date.now();

beforeAll(async () => {
  const tccbRes = await signIn("tccb_user", "tccb1234");
  tccbCookies = extractCookies(tccbRes);

  const tcktRes = await signIn("tckt_user", "tckt1234");
  tcktCookies = extractCookies(tcktRes);

  const employeeRes = await signIn("employee_user", "employee1234");
  employeeCookies = extractCookies(employeeRes);

  const [campus] = await db
    .insert(campuses)
    .values({
      campusCode: `CAMP_${uniqueSuffix}`,
      campusName: `Test Campus ${uniqueSuffix}`,
    })
    .returning({ id: campuses.id });
  testCampusId = (campus as { id: string }).id;

  const [emp] = await db
    .insert(employees)
    .values({
      fullName: "Contract Test Employee",
      dob: "1990-01-01",
      gender: "NAM",
      nationalId: `CT${uniqueSuffix}`,
      address: "123 Test St",
      email: `contract.test.${uniqueSuffix}@example.com`,
      phone: "0901234567",
    })
    .returning({ id: employees.id });
  testEmployeeId = (emp as { id: string }).id;

  const [ct] = await db
    .insert(contractTypes)
    .values({
      contractTypeName: `Test Type ${uniqueSuffix}`,
      minMonths: 12,
      maxMonths: 36,
      maxRenewals: 2,
      renewalGraceDays: 30,
    })
    .returning({ id: contractTypes.id });
  testContractTypeId = (ct as { id: string }).id;

  const [ou] = await db
    .insert(orgUnits)
    .values({
      campusId: testCampusId,
      unitCode: `OU_${uniqueSuffix}`,
      unitName: `Test Org Unit ${uniqueSuffix}`,
      unitType: "PHONG",
    })
    .returning({ id: orgUnits.id });
  testOrgUnitId = (ou as { id: string }).id;
});

afterAll(async () => {
  await db
    .delete(contractAppendices)
    .where(eq(contractAppendices.contractId, createdContractId))
    .catch(() => {});
  await db.delete(employmentContracts).where(eq(employmentContracts.employeeId, testEmployeeId));
  await db.delete(employees).where(eq(employees.id, testEmployeeId));
  await db.delete(contractTypes).where(eq(contractTypes.id, testContractTypeId));
  await db.delete(orgUnits).where(eq(orgUnits.id, testOrgUnitId));
  await db.delete(campuses).where(eq(campuses.id, testCampusId));
});

const basePath = (eid: string) => `/api/employees/${eid}/contracts`;

function contractPayload(overrides: Record<string, unknown> = {}) {
  return {
    contractTypeId: testContractTypeId,
    contractNo: `HD-${uniqueSuffix}-${Math.random().toString(36).slice(2, 8)}`,
    signedOn: "2024-01-15",
    effectiveFrom: "2024-02-01",
    effectiveTo: "2025-02-01",
    orgUnitId: testOrgUnitId,
    ...overrides,
  };
}

describe("Contracts CRUD", () => {
  test("unauthenticated request returns 401", async () => {
    const res = await app.handle(new Request(`http://localhost${basePath(testEmployeeId)}`));
    expect(res.status).toBe(401);
  });

  test("TCCB can create contract", async () => {
    const payload = contractPayload({ contractNo: `HD-TCCB-${uniqueSuffix}` });
    const res = await requestWithCookies("POST", basePath(testEmployeeId), tccbCookies, payload);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data).toBeDefined();
    expect(body.data.id).toBeString();
    expect(body.data.employeeId).toBe(testEmployeeId);
    expect(body.data.contractNo).toBe(payload.contractNo);
    expect(body.data.createdByUserId).toBeString();
    createdContractId = body.data.id;
  });

  test("TCCB can list contracts with paginated response", async () => {
    const res = await requestWithCookies("GET", basePath(testEmployeeId), tccbCookies);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.items).toBeArray();
    expect(typeof body.data.total).toBe("number");
    expect(typeof body.data.page).toBe("number");
    expect(typeof body.data.pageSize).toBe("number");
    expect(body.data.items.length).toBeGreaterThan(0);
  });

  test("TCKT can get contract by id", async () => {
    const res = await requestWithCookies(
      "GET",
      `${basePath(testEmployeeId)}/${createdContractId}`,
      tcktCookies,
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.id).toBe(createdContractId);
  });

  test("TCCB can update contract", async () => {
    const res = await requestWithCookies(
      "PUT",
      `${basePath(testEmployeeId)}/${createdContractId}`,
      tccbCookies,
      { status: "draft" },
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.status).toBe("draft");
  });

  test("List with ?status=draft filter returns only matching contracts", async () => {
    const res = await requestWithCookies(
      "GET",
      `${basePath(testEmployeeId)}?status=draft`,
      tcktCookies,
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    for (const item of body.data.items) {
      expect(item.status).toBe("draft");
    }
  });

  test("ADMIN cannot create contract (403)", async () => {
    const payload = contractPayload({ contractNo: `HD-ADMIN-${uniqueSuffix}` });
    const res = await requestWithCookies(
      "POST",
      basePath(testEmployeeId),
      extractCookies(await signIn("admin", "admin123")),
      payload,
    );
    expect(res.status).toBe(403);
  });

  test("TCKT can list contracts (200)", async () => {
    const res = await requestWithCookies("GET", basePath(testEmployeeId), tcktCookies);
    expect(res.status).toBe(200);
  });

  test("EMPLOYEE cannot create contract (403)", async () => {
    const payload = contractPayload({ contractNo: `HD-EMP-${uniqueSuffix}` });
    const res = await requestWithCookies(
      "POST",
      basePath(testEmployeeId),
      employeeCookies,
      payload,
    );
    expect(res.status).toBe(403);
  });

  test("TCKT cannot create contract (403)", async () => {
    const payload = contractPayload({ contractNo: `HD-TCKT-${uniqueSuffix}` });
    const res = await requestWithCookies("POST", basePath(testEmployeeId), tcktCookies, payload);
    expect(res.status).toBe(403);
  });

  test("EMPLOYEE cannot update contract (403)", async () => {
    const res = await requestWithCookies(
      "PUT",
      `${basePath(testEmployeeId)}/${createdContractId}`,
      employeeCookies,
      { status: "valid" },
    );
    expect(res.status).toBe(403);
  });

  test("TCKT cannot update contract (403)", async () => {
    const res = await requestWithCookies(
      "PUT",
      `${basePath(testEmployeeId)}/${createdContractId}`,
      tcktCookies,
      { status: "valid" },
    );
    expect(res.status).toBe(403);
  });

  test("EMPLOYEE cannot delete contract (403)", async () => {
    const res = await requestWithCookies(
      "DELETE",
      `${basePath(testEmployeeId)}/${createdContractId}`,
      employeeCookies,
    );
    expect(res.status).toBe(403);
  });

  test("TCKT cannot delete contract (403)", async () => {
    const res = await requestWithCookies(
      "DELETE",
      `${basePath(testEmployeeId)}/${createdContractId}`,
      tcktCookies,
    );
    expect(res.status).toBe(403);
  });

  test("Create with effectiveTo < effectiveFrom returns validation error", async () => {
    const payload = contractPayload({
      contractNo: `HD-DATE-${uniqueSuffix}`,
      effectiveFrom: "2025-06-01",
      effectiveTo: "2024-01-01",
    });
    const res = await requestWithCookies("POST", basePath(testEmployeeId), tccbCookies, payload);
    expect(res.status).toBe(400);
  });

  test("Create with future signedOn returns validation error", async () => {
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 5);
    const futureDateStr = futureDate.toISOString().split("T")[0];

    const payload = contractPayload({
      contractNo: `HD-FUTURE-${uniqueSuffix}`,
      signedOn: futureDateStr,
    });
    const res = await requestWithCookies("POST", basePath(testEmployeeId), tccbCookies, payload);
    expect(res.status).toBe(400);
  });

  test("Create with duplicate contractNo returns 409 conflict", async () => {
    const payload = contractPayload({ contractNo: `HD-TCCB-${uniqueSuffix}` });
    const res = await requestWithCookies("POST", basePath(testEmployeeId), tccbCookies, payload);
    expect(res.status).toBe(409);
  });

  test("Get non-existent contract returns 404", async () => {
    const res = await requestWithCookies(
      "GET",
      `${basePath(testEmployeeId)}/00000000-0000-0000-0000-000000000000`,
      tcktCookies,
    );
    expect(res.status).toBe(404);
  });

  test("TCCB can delete contract", async () => {
    const deletePayload = contractPayload({ contractNo: `HD-DEL-${uniqueSuffix}` });
    const createRes = await requestWithCookies(
      "POST",
      basePath(testEmployeeId),
      tccbCookies,
      deletePayload,
    );
    const createBody = await createRes.json();
    const deleteId = createBody.data.id;

    const res = await requestWithCookies(
      "DELETE",
      `${basePath(testEmployeeId)}/${deleteId}`,
      tccbCookies,
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.id).toBe(deleteId);
  });
});

describe("Contract Appendices CRUD", () => {
  const appendixBasePath = () => `${basePath(testEmployeeId)}/${createdContractId}/appendices`;

  test("TCCB can create appendix", async () => {
    const res = await requestWithCookies("POST", appendixBasePath(), tccbCookies, {
      effectiveOn: "2024-06-01",
      terms: "Appendix terms content",
      notes: "Some notes",
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data).toBeDefined();
    expect(body.data.id).toBeString();
    expect(body.data.contractId).toBe(createdContractId);
    expect(body.data.createdByUserId).toBeString();
    createdAppendixId = body.data.id;
  });

  test("TCKT can list appendices with paginated response", async () => {
    const res = await requestWithCookies("GET", appendixBasePath(), tcktCookies);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.items).toBeArray();
    expect(typeof body.data.total).toBe("number");
    expect(body.data.items.length).toBeGreaterThan(0);
  });

  test("TCKT can get appendix by id", async () => {
    const res = await requestWithCookies(
      "GET",
      `${appendixBasePath()}/${createdAppendixId}`,
      tcktCookies,
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.id).toBe(createdAppendixId);
  });

  test("TCCB can update appendix", async () => {
    const res = await requestWithCookies(
      "PUT",
      `${appendixBasePath()}/${createdAppendixId}`,
      tccbCookies,
      { terms: "Updated appendix terms" },
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.terms).toBe("Updated appendix terms");
  });

  test("TCKT cannot create appendix (403)", async () => {
    const res = await requestWithCookies("POST", appendixBasePath(), tcktCookies, {
      effectiveOn: "2024-07-01",
      terms: "Unauthorized appendix by TCKT",
    });
    expect(res.status).toBe(403);
  });

  test("EMPLOYEE cannot create appendix (403)", async () => {
    const res = await requestWithCookies("POST", appendixBasePath(), employeeCookies, {
      effectiveOn: "2024-07-01",
      terms: "Unauthorized appendix",
    });
    expect(res.status).toBe(403);
  });

  test("Cannot create appendix for contract belonging to different employee (404)", async () => {
    const fakeEmployeeId = "00000000-0000-0000-0000-000000000000";
    const path = `${basePath(fakeEmployeeId)}/${createdContractId}/appendices`;
    const res = await requestWithCookies("POST", path, tccbCookies, {
      effectiveOn: "2024-08-01",
      terms: "Wrong employee appendix",
    });
    expect(res.status).toBe(404);
  });

  test("TCCB can delete appendix", async () => {
    const createRes = await requestWithCookies("POST", appendixBasePath(), tccbCookies, {
      effectiveOn: "2024-09-01",
      terms: "Appendix to delete",
    });
    const createBody = await createRes.json();
    const deleteId = createBody.data.id;

    const res = await requestWithCookies(
      "DELETE",
      `${appendixBasePath()}/${deleteId}`,
      tccbCookies,
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.id).toBe(deleteId);
  });

  test("Deleting parent contract cascades to appendices", async () => {
    const cascadePayload = contractPayload({ contractNo: `HD-CASCADE-${uniqueSuffix}` });
    const contractRes = await requestWithCookies(
      "POST",
      basePath(testEmployeeId),
      tccbCookies,
      cascadePayload,
    );
    const contractBody = await contractRes.json();
    const cascadeContractId = contractBody.data.id;

    const appendixRes = await requestWithCookies(
      "POST",
      `${basePath(testEmployeeId)}/${cascadeContractId}/appendices`,
      tccbCookies,
      {
        effectiveOn: "2024-10-01",
        terms: "Cascade test appendix",
      },
    );
    const appendixBody = await appendixRes.json();
    const cascadeAppendixId = appendixBody.data.id;

    await requestWithCookies(
      "DELETE",
      `${basePath(testEmployeeId)}/${cascadeContractId}`,
      tccbCookies,
    );

    const [remaining] = await db
      .select({ id: contractAppendices.id })
      .from(contractAppendices)
      .where(eq(contractAppendices.id, cascadeAppendixId));

    expect(remaining).toBeUndefined();
  });
});
