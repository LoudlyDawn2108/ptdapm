export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Dữ liệu không hợp lệ") {
    super(400, message);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Chưa đăng nhập") {
    super(401, message);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Không có quyền truy cập") {
    super(403, message);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Không tìm thấy dữ liệu") {
    super(404, message);
  }
}

export class ConflictError extends AppError {
  constructor(message = "Dữ liệu đã tồn tại") {
    super(409, message);
  }
}

export class FieldValidationError<
  T extends Record<string, unknown> = Record<string, unknown>,
> extends AppError {
  constructor(
    public fields: Partial<Record<keyof T & string, string>>,
    message = "Dữ liệu không hợp lệ",
  ) {
    super(400, message);
  }
}
