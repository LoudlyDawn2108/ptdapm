import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { cors } from "@elysiajs/cors";
import { env } from "@hrms/env";
import { eq } from "drizzle-orm";
import { Elysia } from "elysia";
import { authPlugin } from "../../common/plugins/auth";
import { dbPlugin } from "../../common/plugins/db";
import { errorPlugin } from "../../common/plugins/error-handler";
import { db } from "../../db";
import { files } from "../../db/schema";
import { authRoutes } from "../auth";
import { fileRoutes } from "./index";

const app = new Elysia()
  .use(cors({ origin: "http://localhost:5173", credentials: true }))
  .use(errorPlugin)
  .use(dbPlugin)
  .use(authPlugin)
  .use(authRoutes)
  .use(fileRoutes);

let tempDir: string;
let originalUploadDir: string;
const createdFileIds: string[] = [];

beforeAll(async () => {
  tempDir = await mkdtemp(path.join(tmpdir(), "files-test-"));
  originalUploadDir = env.UPLOAD_DIR;
  (env as Record<string, unknown>).UPLOAD_DIR = tempDir;
});

afterAll(async () => {
  for (const id of createdFileIds) {
    await db.delete(files).where(eq(files.id, id));
  }
  (env as Record<string, unknown>).UPLOAD_DIR = originalUploadDir;
  await rm(tempDir, { recursive: true, force: true });
});

async function signIn(username: string, password: string) {
  return app.handle(
    new Request("http://localhost/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    }),
  );
}

function extractCookies(res: Response): string {
  return res.headers
    .getSetCookie()
    .map((c) => c.split(";")[0])
    .join("; ");
}

function createTestPdf(sizeBytes = 1024): File {
  const buffer = new Uint8Array(sizeBytes);
  buffer[0] = 0x25; // %
  buffer[1] = 0x50; // P
  buffer[2] = 0x44; // D
  buffer[3] = 0x46; // F
  return new File([buffer], "test-document.pdf", { type: "application/pdf" });
}

async function uploadAs(username: string, password: string, file: File) {
  const signInRes = await signIn(username, password);
  const cookies = extractCookies(signInRes);
  const formData = new FormData();
  formData.append("file", file);
  return app.handle(
    new Request("http://localhost/api/files/upload", {
      method: "POST",
      headers: { Cookie: cookies },
      body: formData,
    }),
  );
}

async function downloadAs(username: string, password: string, fileId: string) {
  const signInRes = await signIn(username, password);
  const cookies = extractCookies(signInRes);
  return app.handle(
    new Request(`http://localhost/api/files/${fileId}`, {
      headers: { Cookie: cookies },
    }),
  );
}

describe("POST /api/files/upload — Success", () => {
  test("TCCB uploads valid PDF with metadata successfully", async () => {
    const file = createTestPdf();
    const res = await uploadAs("tccb_user", "tccb1234", file);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.data).toBeDefined();
    expect(body.data.id).toBeString();
    expect(body.data.originalName).toBe("test-document.pdf");
    expect(body.data.mimeType).toBe("application/pdf");
    expect(body.data.byteSize).toBe(1024);
    expect(body.data.sha256).toBeString();
    expect(body.data.sha256.length).toBe(64);

    createdFileIds.push(body.data.id);

    const storagePath = body.data.storagePath;
    const diskFile = Bun.file(storagePath);
    expect(await diskFile.exists()).toBe(true);
  });

  test("TCCB uploads valid PDF successfully", async () => {
    const file = createTestPdf();
    const res = await uploadAs("tccb_user", "tccb1234", file);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.data).toBeDefined();
    expect(body.data.id).toBeString();
    createdFileIds.push(body.data.id);
  });
});

describe("POST /api/files/upload — Auth / Role", () => {
  test("unauthenticated upload returns 401", async () => {
    const formData = new FormData();
    formData.append("file", createTestPdf());
    const res = await app.handle(
      new Request("http://localhost/api/files/upload", {
        method: "POST",
        body: formData,
      }),
    );
    expect(res.status).toBe(401);
  });

  test("EMPLOYEE role upload returns 403", async () => {
    const file = createTestPdf();
    const res = await uploadAs("employee_user", "employee1234", file);
    expect(res.status).toBe(403);
  });

  test("TCKT role upload returns 403", async () => {
    const file = createTestPdf();
    const res = await uploadAs("tckt_user", "tckt1234", file);
    expect(res.status).toBe(403);
  });
});

describe("POST /api/files/upload — Validation", () => {
  test("wrong MIME type returns 400", async () => {
    const file = new File(["hello world"], "readme.txt", { type: "text/plain" });
    const res = await uploadAs("tccb_user", "tccb1234", file);
    expect(res.status).toBe(400);
  });

  test("file too large returns 400", async () => {
    const largeBuffer = new Uint8Array(11 * 1024 * 1024);
    const file = new File([largeBuffer], "huge.pdf", { type: "application/pdf" });
    const res = await uploadAs("tccb_user", "tccb1234", file);
    expect(res.status).toBe(400);
  });

  test("empty file (0 bytes) returns 400", async () => {
    const file = new File([], "empty.pdf", { type: "application/pdf" });
    const res = await uploadAs("tccb_user", "tccb1234", file);
    expect(res.status).toBe(400);
  });
});

describe("GET /api/files/:id — Download Success", () => {
  test("download uploaded file returns binary with correct headers", async () => {
    const testFile = createTestPdf(512);
    const uploadRes = await uploadAs("tccb_user", "tccb1234", testFile);
    expect(uploadRes.status).toBe(200);
    const uploadBody = await uploadRes.json();
    createdFileIds.push(uploadBody.data.id);

    const downloadRes = await downloadAs("tccb_user", "tccb1234", uploadBody.data.id);
    expect(downloadRes.status).toBe(200);
    expect(downloadRes.headers.get("Content-Type")).toBe("application/pdf");
    expect(downloadRes.headers.get("Content-Disposition")).toContain("test-document.pdf");
    expect(downloadRes.headers.get("Content-Length")).toBe("512");

    const downloadedBuffer = await downloadRes.arrayBuffer();
    expect(downloadedBuffer.byteLength).toBe(512);
  });

  test("legacy PDF without mimeType still opens inline", async () => {
    const fileBuffer = new Uint8Array(384);
    fileBuffer[0] = 0x25;
    fileBuffer[1] = 0x50;
    fileBuffer[2] = 0x44;
    fileBuffer[3] = 0x46;

    const filePath = path.join(tempDir, `legacy-inline-${Date.now()}.pdf`);
    await writeFile(filePath, fileBuffer);

    const [inserted] = await db
      .insert(files)
      .values({
        storagePath: filePath,
        originalName: "legacy-inline.pdf",
        mimeType: null,
        byteSize: fileBuffer.byteLength,
      })
      .returning();

    expect(inserted).toBeDefined();
    if (!inserted) {
      throw new Error("Failed to create legacy PDF record for test");
    }

    createdFileIds.push(inserted.id);

    const downloadRes = await downloadAs("tccb_user", "tccb1234", inserted.id);
    expect(downloadRes.status).toBe(200);
    expect(downloadRes.headers.get("Content-Type")).toBe("application/pdf");
    expect(downloadRes.headers.get("Content-Disposition")).toContain("inline;");
    expect(downloadRes.headers.get("Content-Disposition")).toContain("legacy-inline.pdf");
  });

  test("TCCB can download file uploaded by another user", async () => {
    const testFile = createTestPdf(256);
    const uploadRes = await uploadAs("tccb_user", "tccb1234", testFile);
    expect(uploadRes.status).toBe(200);
    const uploadBody = await uploadRes.json();
    createdFileIds.push(uploadBody.data.id);

    const downloadRes = await downloadAs("tccb_user", "tccb1234", uploadBody.data.id);
    expect(downloadRes.status).toBe(200);
  });

  test("TCKT can download file uploaded by another user", async () => {
    const testFile = createTestPdf(256);
    const uploadRes = await uploadAs("tccb_user", "tccb1234", testFile);
    expect(uploadRes.status).toBe(200);
    const uploadBody = await uploadRes.json();
    createdFileIds.push(uploadBody.data.id);

    const downloadRes = await downloadAs("tckt_user", "tckt1234", uploadBody.data.id);
    expect(downloadRes.status).toBe(200);
  });
});

describe("GET /api/files/:id — Access Control", () => {
  test("EMPLOYEE cannot download file uploaded by another user", async () => {
    const testFile = createTestPdf(256);
    const uploadRes = await uploadAs("tccb_user", "tccb1234", testFile);
    expect(uploadRes.status).toBe(200);
    const uploadBody = await uploadRes.json();
    createdFileIds.push(uploadBody.data.id);

    const downloadRes = await downloadAs("employee_user", "employee1234", uploadBody.data.id);
    expect(downloadRes.status).toBe(403);
  });

  test("ADMIN cannot download file uploaded by another user", async () => {
    const testFile = createTestPdf(256);
    const uploadRes = await uploadAs("tccb_user", "tccb1234", testFile);
    expect(uploadRes.status).toBe(200);
    const uploadBody = await uploadRes.json();
    createdFileIds.push(uploadBody.data.id);

    const downloadRes = await downloadAs("admin", "admin123", uploadBody.data.id);
    expect(downloadRes.status).toBe(403);
  });
});

describe("GET /api/files/:id — Errors", () => {
  test("unauthenticated download returns 401", async () => {
    const res = await app.handle(
      new Request("http://localhost/api/files/00000000-0000-0000-0000-000000000000"),
    );
    expect(res.status).toBe(401);
  });

  test("non-existent file returns 404", async () => {
    const res = await downloadAs("admin", "admin123", "00000000-0000-0000-0000-000000000000");
    expect(res.status).toBe(404);
  });
});
