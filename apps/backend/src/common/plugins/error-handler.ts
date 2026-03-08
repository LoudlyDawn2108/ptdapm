import type {
    ErrorResponse,
    FieldErrorResponse,
    ToastErrorResponse,
} from "@hrms/shared";
import {Elysia} from "elysia";
import {AppError, FieldValidationError} from "../utils/errors";

function toastError(statusCode: number, error: string) {
    const body: ToastErrorResponse = {type: "toast", error};
    return new Response(JSON.stringify(body), {
        status: statusCode,
        headers: {"Content-Type": "application/json"},
    });
}

function fieldError(
    statusCode: number,
    error: string,
    fields: Record<string, string>,
) {
    const body: FieldErrorResponse = {type: "field", error, fields};
    return new Response(JSON.stringify(body), {
        status: statusCode,
        headers: {"Content-Type": "application/json"},
    });
}

function extractFieldErrors(
    validationError: Error,
): Record<string, string> | null {
    const all = (
        validationError as unknown as {all: {path: string; message: string}[]}
    ).all;
    if (!Array.isArray(all) || all.length === 0) return null;

    const fields: Record<string, string> = {};
    for (const entry of all) {
        if (entry.path && !fields[entry.path]) {
            fields[entry.path] = entry.message;
        }
    }
    return fields;
}

export const errorPlugin = new Elysia({name: "error-handler"}).onError(
    {as: "global"},
    ({code, error}) => {
        if (error instanceof FieldValidationError) {
            const fields = Object.fromEntries(
                Object.entries(error.fields).filter(
                    (entry): entry is [string, string] =>
                        entry[1] !== undefined,
                ),
            );
            return fieldError(error.statusCode, error.message, fields);
        }
        if (error instanceof AppError) {
            return toastError(error.statusCode, error.message);
        }
        if (code === "PARSE") {
            return toastError(400, "Dữ liệu gửi lên không hợp lệ");
        }
        if (code === "VALIDATION") {
            const fields = extractFieldErrors(error);
            if (fields) return fieldError(400, "Dữ liệu không hợp lệ", fields);
            return toastError(400, error.message);
        }
        if (code === "NOT_FOUND") {
            return toastError(404, "Không tìm thấy route");
        }
        console.error("Unhandled error:", error);
        return toastError(500, "Lỗi hệ thống");
    },
);
