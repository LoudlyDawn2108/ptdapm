import type {
    CreateAccountInput,
    PaginatedResponse,
    UpdateAccountInput,
} from "@hrms/shared";
import {type SQL, and, eq, ilike, or, sql} from "drizzle-orm";
import {auth} from "../../common/auth";
import {sendNewAccountEmail} from "../../common/utils/email";
import {
    BadRequestError,
    ConflictError,
    FieldValidationError,
    NotFoundError,
} from "../../common/utils/errors";
import {buildPaginatedResponse} from "../../common/utils/pagination";
import {generateRandomPassword} from "../../common/utils/password";
import {withAuditLog} from "../../common/utils/user-context";
import {db} from "../../db";
import {authRoles, authUsers, session} from "../../db/schema/auth";
import {employees} from "../../db/schema/employees";

type AccountListItem = {
    id: string;
    username: string;
    name: string;
    email: string | null;
    roleCode: string;
    roleName: string;
    status: string;
    employeeId: string | null;
    staffCode: string | null;
    createdAt: Date;
    updatedAt: Date;
};

type AccountDetail = {
    id: string;
    username: string;
    name: string;
    email: string | null;
    roleCode: string;
    roleName: string;
    status: string;
    employeeId: string | null;
    staffCode: string | null;
    createdAt: Date;
    updatedAt: Date;
};

export async function list(
    page: number,
    pageSize: number,
    search?: string,
    role?: string,
    status?: string,
): Promise<PaginatedResponse<AccountListItem>> {
    const conditions: SQL[] = [];

    if (search) {
        const pattern = `%${search}%`;
        const searchCondition = or(
            ilike(authUsers.username, pattern),
            ilike(authUsers.name, pattern),
            ilike(authUsers.email, pattern),
            ilike(employees.staffCode, pattern),
        );
        if (searchCondition) conditions.push(searchCondition);
    }

    if (role) {
        conditions.push(eq(authRoles.roleCode, role));
    }

    if (status) {
        conditions.push(eq(authUsers.status, status));
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const baseQuery = db
        .select({
            id: authUsers.id,
            username: authUsers.username,
            name: authUsers.name,
            email: authUsers.email,
            roleCode: authRoles.roleCode,
            roleName: authRoles.roleName,
            status: authUsers.status,
            employeeId: authUsers.employeeId,
            staffCode: employees.staffCode,
            createdAt: authUsers.createdAt,
            updatedAt: authUsers.updatedAt,
        })
        .from(authUsers)
        .innerJoin(authRoles, eq(authUsers.roleId, authRoles.id))
        .leftJoin(employees, eq(authUsers.employeeId, employees.id));

    const [items, countResult] = await Promise.all([
        baseQuery
            .where(where)
            .orderBy(sql`${authUsers.createdAt} desc`)
            .limit(pageSize)
            .offset((page - 1) * pageSize),
        db
            .select({count: sql<number>`count(*)`})
            .from(authUsers)
            .innerJoin(authRoles, eq(authUsers.roleId, authRoles.id))
            .leftJoin(employees, eq(authUsers.employeeId, employees.id))
            .where(where),
    ]);

    const total = Number(countResult[0]?.count ?? 0);
    return buildPaginatedResponse(items, total, page, pageSize);
}

export async function getById(id: string): Promise<AccountDetail> {
    const [item] = await db
        .select({
            id: authUsers.id,
            username: authUsers.username,
            name: authUsers.name,
            email: authUsers.email,
            roleCode: authRoles.roleCode,
            roleName: authRoles.roleName,
            status: authUsers.status,
            employeeId: authUsers.employeeId,
            staffCode: employees.staffCode,
            createdAt: authUsers.createdAt,
            updatedAt: authUsers.updatedAt,
        })
        .from(authUsers)
        .innerJoin(authRoles, eq(authUsers.roleId, authRoles.id))
        .leftJoin(employees, eq(authUsers.employeeId, employees.id))
        .where(eq(authUsers.id, id));

    if (!item) throw new NotFoundError("Không tìm thấy tài khoản");
    return item;
}

export async function create(
    data: CreateAccountInput,
    actorUserId: string,
): Promise<{account: AccountDetail; generatedPassword: string}> {
    const [employee] = await db
        .select({
            id: employees.id,
            staffCode: employees.staffCode,
            fullName: employees.fullName,
        })
        .from(employees)
        .where(eq(employees.id, data.employeeId));

    if (!employee) throw new NotFoundError("Nhân sự không tồn tại");

    const [existingLink] = await db
        .select({id: authUsers.id})
        .from(authUsers)
        .where(eq(authUsers.employeeId, data.employeeId));

    if (existingLink)
        throw new ConflictError(
            "Nhân sự đã được liên kết với một tài khoản khác",
        );

    const [existingEmail] = await db
        .select({id: authUsers.id})
        .from(authUsers)
        .where(eq(authUsers.email, data.email));

    if (existingEmail) {
        throw new FieldValidationError<CreateAccountInput>({
            email: "Email đã được sử dụng",
        });
    }

    const [roleRow] = await db
        .select({id: authRoles.id})
        .from(authRoles)
        .where(eq(authRoles.roleCode, data.roleCode));

    if (!roleRow) throw new BadRequestError("Vai trò không hợp lệ");

    const username = data.email.split("@")[0] ?? employee.staffCode;
    const name = employee.fullName;
    const password = generateRandomPassword(12);

    const result = await auth.api.signUpEmail({
        body: {
            email: data.email,
            password,
            name,
            username,
            roleId: roleRow.id,
        },
    });

    if (!result?.user?.id) {
        throw new BadRequestError("Không thể tạo tài khoản");
    }

    await db
        .update(authUsers)
        .set({employeeId: data.employeeId})
        .where(eq(authUsers.id, result.user.id));

    await sendNewAccountEmail(data.email, username, password).catch(() => {
        /* Email delivery is best-effort; do not fail account creation */
    });

    await withAuditLog(
        db,
        actorUserId,
        "CREATE",
        "auth_user",
        result.user.id,
        undefined,
        {
            username,
            email: data.email,
            roleCode: data.roleCode,
        },
    );

    const account = await getById(result.user.id);
    return {account, generatedPassword: password};
}

export async function update(
    id: string,
    data: UpdateAccountInput,
    actorUserId: string,
): Promise<AccountDetail> {
    const existing = await getById(id);

    if (data.email && data.email !== existing.email) {
        const [emailConflict] = await db
            .select({id: authUsers.id})
            .from(authUsers)
            .where(eq(authUsers.email, data.email));

        if (emailConflict) {
            throw new FieldValidationError<UpdateAccountInput>({
                email: "Email đã được sử dụng",
            });
        }
    }

    let roleId: string | undefined;
    if (data.roleCode) {
        const [roleRow] = await db
            .select({id: authRoles.id})
            .from(authRoles)
            .where(eq(authRoles.roleCode, data.roleCode));

        if (!roleRow) throw new BadRequestError("Vai trò không hợp lệ");
        roleId = roleRow.id;
    }

    const updateSet: Record<string, unknown> = {updatedAt: new Date()};
    const oldValues: Record<string, unknown> = {};
    const newValues: Record<string, unknown> = {};

    if (data.email && data.email !== existing.email) {
        updateSet.email = data.email;
        oldValues.email = existing.email;
        newValues.email = data.email;
    }

    if (roleId) {
        updateSet.roleId = roleId;
        oldValues.roleCode = existing.roleCode;
        newValues.roleCode = data.roleCode;
    }

    await db.update(authUsers).set(updateSet).where(eq(authUsers.id, id));

    await withAuditLog(
        db,
        actorUserId,
        "UPDATE",
        "auth_user",
        id,
        oldValues,
        newValues,
    );

    return getById(id);
}

export async function setStatus(
    id: string,
    status: string,
    actorUserId: string,
): Promise<AccountDetail> {
    if (id === actorUserId && status === "locked") {
        throw new BadRequestError("Không thể khóa tài khoản đang sử dụng");
    }

    const existing = await getById(id);

    if (existing.status === status) {
        return existing;
    }

    const oldStatus = existing.status;

    await db
        .update(authUsers)
        .set({status, updatedAt: new Date()})
        .where(eq(authUsers.id, id));

    if (status === "locked") {
        await db.delete(session).where(eq(session.userId, id));
    }

    await withAuditLog(
        db,
        actorUserId,
        status === "locked" ? "LOCK" : "UNLOCK",
        "auth_user",
        id,
        {status: oldStatus},
        {status},
    );

    return getById(id);
}
