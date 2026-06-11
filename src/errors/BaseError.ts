interface BaseErrorProps {
  name: string;
  message: string;
  cause?: string;
  statusCode?: number;
}

export class BaseError extends Error {
  public statusCode?: number;
  constructor({ message, name, cause, statusCode }: BaseErrorProps) {
    super(message);
    this.name = name;
    this.cause = cause;
    this.statusCode = statusCode || 500;
  }
}
