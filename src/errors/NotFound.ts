import { BaseError } from "./BaseError";

export class NotFound extends BaseError {
  constructor(message: string, cause?: string) {
    super({
      message: message || "Not Found",
      name: "NotFound",
      statusCode: 404,
      cause: cause || "Resource Not Found",
    });
  }
}
