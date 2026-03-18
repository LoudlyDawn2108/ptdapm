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
      const { fileRecord, bunFile } = await fileService.getFileById(params.id);

      if (!EMPLOYEE_PROFILE_VIEW_ROLES.includes(user.role)) {
        if (fileRecord.uploadedByUserId !== user.id) {
          throw new ForbiddenError("Không có quyền tải file này");
        }
      }

      const encoded = encodeURIComponent(fileRecord.originalName);
      const contentType = fileRecord.mimeType || "application/octet-stream";
      const disposition = INLINE_MIME_TYPES.has(contentType) ? "inline" : "attachment";
      return new Response(bunFile.stream(), {
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
