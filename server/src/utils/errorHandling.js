class HttpError extends Error{
    constructor(message,statusCode){
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this,this.constructor);
    }
}

class BadRequestError extends HttpError{
    constructor(message="Bad Request"){
        super(message,400);
    }
}

class UnauthorizedError extends HttpError{
    constructor(message="Unauthorized"){
        super(message,401);
    }
}

class ForbiddenError extends HttpError{
    constructor(message="Forbidden"){
        super(message,403);
    }
}
class NotFoundError extends HttpError {
  constructor(message = "Resource not found") {
    super(message, 404);
  }
}
class ConflictError extends HttpError {
  constructor(message = "Conflict") {
    super(message, 409);
  }
}
module.exports = {
  HttpError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError
};