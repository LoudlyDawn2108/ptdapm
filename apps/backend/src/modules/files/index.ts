import { access, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { eq } from "drizzle-orm";
import { Elysia } from "elysia";
import { z } from "zod";
import { authPlugin } from "../../common/plugins/auth";
import { BadRequestError, NotFoundError } from "../../common/utils/errors";
import { requireRole } from "../../common/utils/role-guard";
import { db } from "../../db";
import { files } from "../../db/schema";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const ALLOWED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);
const MODULE_DIR = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(MODULE_DIR, "../../../../../");
const UPLOADS_DIR = path.join(PROJECT_ROOT, "uploads");

type BunApi = {
  write(target: string, data: Blob): Promise<number>;
  file(path: string): Blob;
};

const bunApi = (globalThis as typeof globalThis & { Bun: BunApi }).Bun;

function getFileExtension(file: File) {
  const originalExtension = path.extname(file.name).toLowerCase();

  if (ALLOWED_EXTENSIONS.has(originalExtension)) {
    return originalExtension;
  }

  switch (file.type) {
    case "image/jpeg":
      return ".jpg";
    case "image/png":
      return ".png";
    case "image/webp":
      return ".webp";
    case "image/gif":
      return ".gif";
    default:
      return "";
  }
}

function resolveStoredFilePath(storagePath: string) {
  const absolutePath = path.resolve(PROJECT_ROOT, storagePath);
  const uploadsPrefix = `${UPLOADS_DIR}${path.sep}`;

  if (absolutePath !== UPLOADS_DIR && !absolutePath.startsWith(uploadsPrefix)) {
    throw new NotFoundError("Tệp không hợp lệ");
  }

  return absolutePath;
}

export const fileRoutes = new Elysia({ prefix: "/api/files" })
  .use(authPlugin)
  .post(
    "/",
    async ({ body, user }) => {
      requireRole(user.role, "ADMIN", "TCCB");

      const file = body.file;

      if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
        throw new BadRequestError("Chỉ hỗ trợ ảnh JPEG, PNG, WEBP hoặc GIF");
      }

      if (file.size > MAX_FILE_SIZE) {
        throw new BadRequestError("Ảnh quá lớn (tối đa 5MB)");
      }

      await mkdir(UPLOADS_DIR, { recursive: true });

      const fileName = `${crypto.randomUUID()}${getFileExtension(file)}`;
      const storagePath = path.posix.join("uploads", fileName);
      const absolutePath = path.join(UPLOADS_DIR, fileName);

      await bunApi.write(absolutePath, file);

      const [createdFile] = await db
        .insert(files)
        .values({
          storagePath,
          originalName: file.name,
          mimeType: file.type || null,
          byteSize: file.size,
          uploadedByUserId: user.id,
        })
        .returning({
          id: files.id,
          originalName: files.originalName,
          mimeType: files.mimeType,
        });

      return { data: createdFile };
    },
    {
      auth: true,
      body: z.object({ file: z.instanceof(File) }),
    },
  )
  .get(
    "/:id",
    async ({ params, user }) => {
      requireRole(user.role, "ADMIN", "TCCB");

      const [storedFile] = await db
        .select({
          storagePath: files.storagePath,
          originalName: files.originalName,
          mimeType: files.mimeType,
        })
        .from(files)
        .where(eq(files.id, params.id))
        .limit(1);

      if (!storedFile) {
        throw new NotFoundError("Không tìm thấy tệp");
      }

      const absolutePath = resolveStoredFilePath(storedFile.storagePath);

      try {
        await access(absolutePath);
      } catch {
        throw new NotFoundError("Tệp không tồn tại");
      }

      return new Response(bunApi.file(absolutePath), {
        headers: {
          "Content-Type": storedFile.mimeType ?? "application/octet-stream",
          "Content-Disposition": `inline; filename*=UTF-8''${encodeURIComponent(storedFile.originalName)}`,
        },
      });
    },
    {
      auth: true,
      params: z.object({ id: z.string().uuid() }),
    },
  );
