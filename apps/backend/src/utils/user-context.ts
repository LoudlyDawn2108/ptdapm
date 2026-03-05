import type { Database } from "../db";
import { auditLogs } from "../db/schema/audit";

export function withUserContext(userId: string) {
  return {
    createdByUserId: userId,
    updatedByUserId: userId,
  };
}

export async function withAuditLog(
  database: Database,
  userId: string,
  action: string,
  entityType: string,
  entityId: string,
  oldValues?: Record<string, unknown>,
  newValues?: Record<string, unknown>,
) {
  await database.insert(auditLogs).values({
    actorUserId: userId,
    action,
    entityType,
    entityId,
    oldValues,
    newValues,
  });
}
