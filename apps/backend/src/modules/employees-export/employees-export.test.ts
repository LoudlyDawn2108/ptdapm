import { describe, expect, mock, test } from "bun:test";
import { Elysia } from "elysia";
import { errorPlugin } from "../../common/plugins/error-handler";

// Mock the employee service to return fake data without hitting DB
mock.module("../employees/employee.service", () => {
  return {
    list: mock(async () => {
      return {
        items: [
          {
            id: "11111111-1111-1111-1111-111111111111",
            staffCode: "EMP001",
            fullName: "Nguyen Van A",
            gender: "NAM",
            dob: "1990-01-01",
            nationalId: "123456789",
            email: "nva@tlu.edu.vn",
            phone: "0123456789",
            workStatus: "working",
            contractStatus: "active",
          },
          {
            id: "22222222-2222-2222-2222-222222222222",
            staffCode: "EMP002",
            fullName: "Tran Thi B",
            gender: "NU",
            dob: null,
            nationalId: null,
            email: null,
            phone: null,
            workStatus: "pending",
            contractStatus: null,
          },
        ],
        total: 2,
        page: 1,
        pageSize: 500,
      };
    }),
    getAggregateById: mock(async (employeeId: string) => {
      return {
        employee: {
          id: employeeId,
          staffCode: "EMP001",
          fullName: "Nguyen Van A",
          gender: "NAM",
          dob: "1990-01-01",
          nationalId: "123456789",
          email: "nva@tlu.edu.vn",
          phone: "0123456789",
          workStatus: "working",
          contractStatus: "active",
          address: "Hanoi",
          hometown: "Hanoi",
          taxCode: "TAX123",
          socialInsuranceNo: "SOC123",
          healthInsuranceNo: "HEA123",
          currentOrgUnitId: null,
          currentPositionTitle: null,
        },
        familyMembers: [
          {
            relation: "Vo",
            fullName: "Le Thi C",
            dob: "1992-02-02",
            phone: "0987654321",
            isDependent: true,
            note: "None",
          },
        ],
        bankAccounts: [
          {
            bankName: "Techcombank",
            accountNo: "1900123456",
            isPrimary: true,
          },
        ],
        previousJobs: [],
        partyMemberships: [],
        allowances: [],
      };
    }),
  };
});

mock.module("../auth/auth.service", () => {
  return {
    getSessionFromHeaders: mock(async () => {
      return {
        user: {
          id: "admin-user",
          email: "admin@test.local",
          name: "Admin User",
          username: "admin",
          roleId: "admin-role",
          status: "active",
        },
        session: { expiresAt: new Date(Date.now() + 1000000) },
      };
    }),
    isUserLocked: mock(async () => false),
    buildAuthUser: mock(async (user: any) => ({
      id: user.id,
      username: user.username,
      fullName: user.name,
      email: user.email,
      role: "ADMIN",
      status: "active",
      employeeId: null,
    })),
  };
});

// Import MUST be after mock.module in bun:test
const { employeeExportRoutes } = await import("./index");

// Setup Elysia app for testing
const app = new Elysia().use(errorPlugin).use(employeeExportRoutes);

describe("Employee Export API", () => {
  test("GET /api/employees/export without format returns 400", async () => {
    const res = await app.handle(new Request("http://localhost/api/employees/export"));
    expect(res.status).toBe(400);

    const data = await res.json();
    expect(data.error).toBe("Định dạng không hợp lệ");
  });

  test("GET /api/employees/export?format=csv returns valid CSV", async () => {
    const res = await app.handle(
      new Request("http://localhost/api/employees/export?format=csv"),
    );
    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toBe("text/csv");
    expect(res.headers.get("Content-Disposition")).toBe('attachment; filename="employees.csv"');

    const csvText = await res.text();
    // Headers length check
    expect(csvText).toContain("staffCode,fullName,gender,dob,nationalId,email,phone,workStatus,contractStatus");
    
    // Values check
    expect(csvText).toContain("EMP001,Nguyen Van A,NAM,1990-01-01,123456789,nva@tlu.edu.vn,0123456789,working,active");
    // Handle null values rendered as empty string (4 empty fields between NU and pending)
    expect(csvText).toContain("EMP002,Tran Thi B,NU,,,,,pending,");
  });

  test("GET /api/employees/:id/export without format returns 400", async () => {
    // using a proper uuid format that zod accepts
    const validUuid = "f47ac10b-58cc-4372-a567-0e02b2c3d479";
    const res = await app.handle(
      new Request(`http://localhost/api/employees/${validUuid}/export`),
    );
    expect(res.status).toBe(400);
  });

  test("GET /api/employees/:id/export?format=csv returns multi-section CSV", async () => {
    const employeeId = "11111111-1111-1111-1111-111111111111"; // this one is used in the mock
    // if Zod blocks this 1111... we should use a proper uuid in the mock too
    // wait! the mock doesn't care about the uuid format, but the route DOES.
    const validUuid = "f47ac10b-58cc-4372-a567-0e02b2c3d479";
    const res = await app.handle(
      new Request(`http://localhost/api/employees/${validUuid}/export?format=csv`),
    );
    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toBe("text/csv");
    expect(res.headers.get("Content-Disposition")).toBe(`attachment; filename="employee-${validUuid}.csv"`);

    const csvText = await res.text();
    
    // Check Employee section
    expect(csvText).toContain("Employee");
    expect(csvText).toContain("staffCode,fullName,gender,dob,nationalId,email,phone,workStatus,contractStatus,address,hometown,taxCode,socialInsuranceNo,healthInsuranceNo,currentOrgUnitId,currentPositionTitle");
    
    // The mock always returns EMP001 regardless of ID passed
    expect(csvText).toContain("EMP001,Nguyen Van A,NAM,1990-01-01,123456789,nva@tlu.edu.vn,0123456789,working,active,Hanoi,Hanoi,TAX123,SOC123,HEA123,,");

    // Check Family section
    expect(csvText).toContain("Family Members");
    expect(csvText).toContain("Vo,Le Thi C,1992-02-02,0987654321,true,None");

    // Check Bank Accounts section
    expect(csvText).toContain("Bank Accounts");
    expect(csvText).toContain("Techcombank,1900123456,true");
  });
});
