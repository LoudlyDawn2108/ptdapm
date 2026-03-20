import { EMPLOYEE_PROFILE_VIEW_ROLES } from "@hrms/shared";
import { Elysia } from "elysia";
import { z } from "zod";
import { authPlugin } from "../../common/plugins/auth";
import { ForbiddenError } from "../../common/utils/errors";
import { requireRole } from "../../common/utils/role-guard";
import * as fileService from "./files.service";

function asciiSafe(filename: string): string {
  return filename.replace(/[^\x20-\x7E]/g, "_");
}

const INLINE_MIME_TYPES = new Set(["application/pdf", "image/jpeg", "image/png"]);
const INLINE_EXTENSIONS = new Set([".pdf", ".jpg", ".jpeg", ".png"]);

function getExtension(filename: string): string {
  const lastDot = filename.lastIndexOf(".");
  if (lastDot === -1) return "";
  return filename.slice(lastDot).toLowerCase();
}

function inferMimeType(originalName: string, mimeType: string | null): string {
  if (mimeType) {
    return mimeType;
  }

  const ext = getExtension(originalName);
  switch (ext) {
    case ".pdf":
      return "application/pdf";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".xls":
      return "application/vnd.ms-excel";
    case ".xlsx":
      return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    default:
      return "application/octet-stream";
  }
}

export const fileRoutes = new Elysia({ prefix: "/api/files" })
  .use(authPlugin)
  .post(
    "/upload",
    async ({ body, user }) => {
      requireRole(user.role, "TCCB");
      const data = await fileService.uploadFile(body.file, user.id);
      return { data };
    },
    {
      auth: true,
      body: z.object({ file: z.instanceof(File) }),
    },
  )
  .get(
    "/:id",
    async ({ params, user }) => {
      const { fileRecord, fileContent } = await fileService.getFileById(params.id);

      if (!EMPLOYEE_PROFILE_VIEW_ROLES.includes(user.role)) {
        if (fileRecord.uploadedByUserId !== user.id) {
          throw new ForbiddenError("Không có quyền tải file này");
        }
      }

      const encoded = encodeURIComponent(fileRecord.originalName);
      const contentType = inferMimeType(fileRecord.originalName, fileRecord.mimeType);
      const extension = getExtension(fileRecord.originalName);
      const disposition =
        INLINE_MIME_TYPES.has(contentType) || INLINE_EXTENSIONS.has(extension)
          ? "inline"
          : "attachment";
      return new Response(fileContent, {
        headers: {
          "Content-Type": contentType,
          "Content-Disposition": `${disposition}; filename="${asciiSafe(fileRecord.originalName)}"; filename*=UTF-8''${encoded}`,
          "Content-Length": String(fileRecord.byteSize),
        },
      });
    },
    {
      auth: true,
      params: z.object({ id: z.string().uuid() }),
    },
  );
