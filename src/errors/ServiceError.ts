import { BaseError } from "./BaseError";

export class ServiceError extends BaseError {
  constructor(message: string, statusCode: number = 500) {
    super({
      message: message || "Service unvailable",
      name: "ServiceError",
      statusCode,
    });
  }
}
