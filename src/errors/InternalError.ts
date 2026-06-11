import { BaseError } from "./BaseError";

export class InternalError extends BaseError {
  constructor(message: string, cause ?: string) {
    super({
      message: message || "Internal Server Error",
      name: "InternalError",
      cause: cause || "An Unspected Error Occured",
      statusCode: 500,
    });
  }
}
