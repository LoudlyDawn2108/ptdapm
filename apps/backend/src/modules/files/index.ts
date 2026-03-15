import { Elysia } from "elysia";
import { z } from "zod";
import { authPlugin } from "../../common/plugins/auth";
import { requireRole } from "../../common/utils/role-guard";
import * as fileService from "./files.service";

function asciiSafe(filename: string): string {
  return filename.replace(/[^\x20-\x7E]/g, "_");
}

export const fileRoutes = new Elysia({ prefix: "/api/files" })
  .use(authPlugin)
  .post(
    "/upload",
    async ({ body, user }) => {
      requireRole(user.role, "ADMIN", "TCCB");
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
    async ({ params }) => {
      const { fileRecord, bunFile } = await fileService.getFileById(params.id);
      const encoded = encodeURIComponent(fileRecord.originalName);
      return new Response(bunFile.stream(), {
        headers: {
          "Content-Type": fileRecord.mimeType || "application/octet-stream",
          "Content-Disposition": `attachment; filename="${asciiSafe(fileRecord.originalName)}"; filename*=UTF-8''${encoded}`,
          "Content-Length": String(fileRecord.byteSize),
        },
      });
    },
    {
      auth: true,
      params: z.object({ id: z.string().uuid() }),
    },
  );
