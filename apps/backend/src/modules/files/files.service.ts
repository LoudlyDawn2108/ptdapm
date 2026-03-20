import { createHash } from "node:crypto";
import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { env } from "@hrms/env";
import { eq } from "drizzle-orm";
import { BadRequestError, NotFoundError } from "../../common/utils/errors";
import { db } from "../../db";
import { files } from "../../db/schema";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Anchor relative UPLOAD_DIR to project root (not CWD) so Turborepo vs direct-run both work
const MODULE_DIR = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(MODULE_DIR, "../../../../..");
const RESOLVED_UPLOAD_DIR = path.isAbsolute(env.UPLOAD_DIR)
  ? env.UPLOAD_DIR
  : path.resolve(PROJECT_ROOT, env.UPLOAD_DIR);

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "image/jpeg",
  "image/png",
] as const;

const ALLOWED_EXTENSIONS = [".pdf", ".xlsx", ".xls", ".jpg", ".jpeg", ".png"] as const;

function getExtension(filename: string): string {
  const lastDot = filename.lastIndexOf(".");
  if (lastDot === -1) return "";
  return filename.slice(lastDot).toLowerCase();
}

export async function uploadFile(file: File, userId: string) {
  if (file.size === 0) {
    throw new BadRequestError("File không được rỗng");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new BadRequestError("File quá lớn (tối đa 10MB)");
  }

  const ext = getExtension(file.name);
  if (!ALLOWED_EXTENSIONS.includes(ext as (typeof ALLOWED_EXTENSIONS)[number])) {
    throw new BadRequestError("Loại file không được hỗ trợ. Chỉ chấp nhận PDF, Excel, JPEG, PNG");
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type as (typeof ALLOWED_MIME_TYPES)[number])) {
    throw new BadRequestError("Loại file không hợp lệ");
  }

  const uuid = crypto.randomUUID();
  const storageFilename = `${uuid}${ext}`;
  await mkdir(RESOLVED_UPLOAD_DIR, { recursive: true });

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const sha256 = createHash("sha256").update(buffer).digest("hex");

  const filePath = path.join(RESOLVED_UPLOAD_DIR, storageFilename);
  await writeFile(filePath, buffer);

  try {
    const [inserted] = await db
      .insert(files)
      .values({
        storagePath: filePath,
        originalName: file.name,
        mimeType: file.type,
        byteSize: file.size,
        sha256,
        uploadedByUserId: userId,
      })
      .returning();

    return inserted;
  } catch (error) {
    try {
      await unlink(filePath);
    } catch {
      // cleanup best-effort
    }
    throw error;
  }
}

export async function getFileById(id: string) {
  const [fileRecord] = await db.select().from(files).where(eq(files.id, id)).limit(1);

  if (!fileRecord) {
    throw new NotFoundError("Không tìm thấy file");
  }

  let filePath = fileRecord.storagePath;
  let fileContent = await readFile(filePath).catch(() => null);

  if (!fileContent) {
    const filename = path.basename(fileRecord.storagePath);
    const fallbackPath = path.join(RESOLVED_UPLOAD_DIR, filename);
    filePath = fallbackPath;
    fileContent = await readFile(fallbackPath).catch(() => null);
  }

  if (!fileContent) {
    throw new NotFoundError("File không tồn tại trên hệ thống");
  }

  return { fileRecord, fileContent, filePath };
}
