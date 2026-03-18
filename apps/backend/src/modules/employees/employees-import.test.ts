import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { cors } from "@elysiajs/cors";
import { eq, inArray } from "drizzle-orm";
import { Elysia } from "elysia";
import ExcelJS from "exceljs";
import { authPlugin } from "../../common/plugins/auth";
import { dbPlugin } from "../../common/plugins/db";
import { errorPlugin } from "../../common/plugins/error-handler";
import { db } from "../../db";
import { employees } from "../../db/schema";
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

async function importAs(username: string, password: string, file: File) {
  const signInRes = await signIn(username, password);
  const cookies = extractCookies(signInRes);
  const formData = new FormData();
  formData.append("file", file);
  return app.handle(
    new Request("http://localhost/api/employees/import", {
      method: "POST",
      headers: { Cookie: cookies },
      body: formData,
    }),
  );
}

async function tccbImport(file: File) {
  return importAs("tccb_user", "tccb1234", file);
}

async function buildValidExcel(rows: Record<string, string>[]): Promise<File> {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Employees");
  worksheet.addRow([
    "fullName",
    "dob",
    "gender",
    "nationalId",
    "phone",
    "email",
    "hometown",
    "address",
  ]);
  for (const row of rows) {
    worksheet.addRow([
      row.fullName,
      row.dob,
      row.gender,
      row.nationalId,
      row.phone ?? "",
      row.email ?? "",
      row.hometown ?? "",
      row.address ?? "",
    ]);
  }
  const buffer = await workbook.xlsx.writeBuffer();
  return new File([buffer], "test-import.xlsx", {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
}

const importedNationalIds: string[] = [];

let existingEmployeeNationalId: string;

beforeAll(async () => {
  existingEmployeeNationalId = `EX${Date.now()}`;
  await db.insert(employees).values({
    fullName: "Existing Employee",
    dob: "1990-01-01",
    gender: "NAM",
    nationalId: existingEmployeeNationalId,
    address: "123 Existing St",
    email: `existing.${Date.now()}@example.com`,
    phone: "0901111111",
  });
});

afterAll(async () => {
  if (importedNationalIds.length > 0) {
    await db.delete(employees).where(inArray(employees.nationalId, importedNationalIds));
  }
  await db.delete(employees).where(eq(employees.nationalId, existingEmployeeNationalId));
});

describe("POST /api/employees/import — Valid import", () => {
  test("valid Excel file imports successfully", async () => {
    const nid1 = `IMP1_${Date.now()}`;
    const nid2 = `IMP2_${Date.now()}`;
    importedNationalIds.push(nid1, nid2);

    const file = await buildValidExcel([
      { fullName: "Import One", dob: "1990-01-01", gender: "NAM", nationalId: nid1 },
      { fullName: "Import Two", dob: "1992-06-15", gender: "NU", nationalId: nid2 },
    ]);

    const res = await tccbImport(file);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.imported).toBe(2);
    expect(body.data.errors).toEqual([]);
  });
});

describe("POST /api/employees/import — Validation errors", () => {
  test("invalid row data returns errors with row numbers", async () => {
    const file = await buildValidExcel([
      { fullName: "", dob: "not-a-date", gender: "NAM", nationalId: "" },
    ]);

    const res = await tccbImport(file);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.imported).toBe(0);
    expect(body.data.errors.length).toBeGreaterThan(0);
    expect(body.data.errors[0].row).toBe(2);
    expect(body.data.errors[0].errors).toBeArray();
    expect(body.data.errors[0].errors.length).toBeGreaterThan(0);
  });

  test("duplicate nationalId within file returns error", async () => {
    const dupNid = `DUP_${Date.now()}`;
    const file = await buildValidExcel([
      { fullName: "Person A", dob: "1990-01-01", gender: "NAM", nationalId: dupNid },
      { fullName: "Person B", dob: "1991-02-02", gender: "NU", nationalId: dupNid },
    ]);

    const res = await tccbImport(file);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.imported).toBe(0);
    expect(body.data.errors.length).toBe(2);
    const allMessages = body.data.errors.flatMap((e: { errors: string[] }) => e.errors);
    expect(allMessages.some((m: string) => m.includes("trùng"))).toBe(true);
  });

  test("nationalId already in DB returns error", async () => {
    const file = await buildValidExcel([
      {
        fullName: "Duplicate DB",
        dob: "1990-01-01",
        gender: "NAM",
        nationalId: existingEmployeeNationalId,
      },
    ]);

    const res = await tccbImport(file);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.imported).toBe(0);
    expect(body.data.errors.length).toBeGreaterThan(0);
    const allMessages = body.data.errors.flatMap((e: { errors: string[] }) => e.errors);
    expect(allMessages.some((m: string) => m.includes("tồn tại"))).toBe(true);
  });
});

describe("POST /api/employees/import — File validation", () => {
  test("non-Excel file returns 400", async () => {
    const signInRes = await signIn("tccb_user", "tccb1234");
    const cookies = extractCookies(signInRes);
    const formData = new FormData();
    formData.append("file", new File(["not excel"], "data.txt", { type: "text/plain" }));
    const res = await app.handle(
      new Request("http://localhost/api/employees/import", {
        method: "POST",
        headers: { Cookie: cookies },
        body: formData,
      }),
    );
    expect(res.status).toBe(400);
  });

  test("EMPLOYEE cannot import (403)", async () => {
    const file = await buildValidExcel([
      { fullName: "No Access", dob: "1990-01-01", gender: "NAM", nationalId: `NOACC${Date.now()}` },
    ]);
    const res = await importAs("employee_user", "employee1234", file);
    expect(res.status).toBe(403);
  });
});

describe("GET /api/employees/import/template", () => {
  test("template download returns xlsx", async () => {
    const signInRes = await signIn("tccb_user", "tccb1234");
    const cookies = extractCookies(signInRes);
    const res = await app.handle(
      new Request("http://localhost/api/employees/import/template", {
        headers: { Cookie: cookies },
      }),
    );
    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toBe(
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    expect(res.headers.get("Content-Disposition")).toContain("import-template.xlsx");
  });

  test("ADMIN cannot download template (403)", async () => {
    const signInRes = await signIn("admin", "admin123");
    const cookies = extractCookies(signInRes);
    const res = await app.handle(
      new Request("http://localhost/api/employees/import/template", {
        headers: { Cookie: cookies },
      }),
    );
    expect(res.status).toBe(403);
  });
});
