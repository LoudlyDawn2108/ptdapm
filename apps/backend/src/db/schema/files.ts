import { bigint, char, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const files = pgTable("files", {
  id: uuid("id").primaryKey().defaultRandom(),
  storagePath: text("storage_path").notNull(),
  originalName: text("original_name").notNull(),
  mimeType: text("mime_type"),
  byteSize: bigint("byte_size", { mode: "number" }),
  sha256: char("sha256", { length: 64 }),
  uploadedByUserId: uuid("uploaded_by_user_id"),
  uploadedAt: timestamp("uploaded_at", { withTimezone: true }).notNull().defaultNow(),
});
