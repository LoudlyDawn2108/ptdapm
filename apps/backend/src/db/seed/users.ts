import { eq } from "drizzle-orm";
import { auth } from "../../common/auth";
import { db } from "../index";
import { authRoles, authUsers } from "../schema/auth";
import { employees } from "../schema/employees";

type TestUserSeed = {
  email: string;
  password: string;
  name: string;
  username: string;
  roleCode: string;
  employeeNationalId?: string;
};

const testUsers: TestUserSeed[] = [
  {
    email: "admin@test.local",
    password: "admin123",
    name: "Admin User",
    username: "admin",
    roleCode: "ADMIN",
  },
  {
    email: "tccb@test.local",
    password: "tccb1234",
    name: "TCCB User",
    username: "tccb_user",
    roleCode: "TCCB",
  },
  {
    email: "tckt@test.local",
    password: "tckt1234",
    name: "TCKT User",
    username: "tckt_user",
    roleCode: "TCKT",
  },
  {
    email: "employee@test.local",
    password: "employee1234",
    name: "Employee User",
    username: "employee_user",
    roleCode: "EMPLOYEE",
    employeeNationalId: "001085012345",
  },
];

async function resolveEmployeeId(nationalId?: string): Promise<string | null> {
  if (!nationalId) return null;

  const [employee] = await db
    .select({ id: employees.id })
    .from(employees)
    .where(eq(employees.nationalId, nationalId))
    .limit(1);

  return employee?.id ?? null;
}

async function seedUsers() {
  const roles = await db.select().from(authRoles);
  const roleMap = new Map(roles.map((r) => [r.roleCode, r.id]));

  if (roleMap.size === 0) {
    console.error("No roles found — run seed:roles first");
    process.exit(1);
  }

  let created = 0;
  let skipped = 0;
  let linked = 0;

  for (const user of testUsers) {
    const mappedEmployeeId = await resolveEmployeeId(user.employeeNationalId);

    const existing = await db
      .select({ id: authUsers.id, employeeId: authUsers.employeeId })
      .from(authUsers)
      .where(eq(authUsers.username, user.username))
      .limit(1);

    if (existing.length > 0) {
      const existingUser = existing[0];
      if (!existingUser) {
        console.log(`  Skipping ${user.username} (already exists)`);
        skipped++;
        continue;
      }

      if (mappedEmployeeId && existingUser.employeeId !== mappedEmployeeId) {
        await db
          .update(authUsers)
          .set({ employeeId: mappedEmployeeId })
          .where(eq(authUsers.id, existingUser.id));
        console.log(
          `  Linked ${user.username} -> employee ${user.employeeNationalId}`,
        );
        linked++;
      }
      console.log(`  Skipping ${user.username} (already exists)`);
      skipped++;
      continue;
    }

    const roleId = roleMap.get(user.roleCode);
    if (!roleId) {
      console.error(`  Role ${user.roleCode} not found — run seed:roles first`);
      process.exit(1);
    }

    const result = await auth.api.signUpEmail({
      body: {
        email: user.email,
        password: user.password,
        name: user.name,
        username: user.username,
        roleId,
      },
    });

    if (!result?.user?.id) {
      console.error(`  Failed to create user ${user.username}:`, result);
      continue;
    }

    if (mappedEmployeeId) {
      await db
        .update(authUsers)
        .set({ employeeId: mappedEmployeeId })
        .where(eq(authUsers.id, result.user.id));
      console.log(
        `  Linked ${user.username} -> employee ${user.employeeNationalId}`,
      );
      linked++;
    }

    console.log(`  Created ${user.username} with role ${user.roleCode}`);
    created++;
  }

  console.log(
    `\n${created} users created, ${skipped} skipped (already exist), ${linked} linked to employees`,
  );
  process.exit(0);
}

seedUsers().catch((err) => {
  console.error("Failed to seed users:", err);
  process.exit(1);
});
