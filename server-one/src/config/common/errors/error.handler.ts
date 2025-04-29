import { HTTP_STATUS } from "../enums";


export abstract class HttpException<T = unknown> extends Error {
	public data?: T;

	public status?: string;

	constructor(
		public message: string,
		public statusCode: number,
		data?: T,
		status?: string
	) {
		super(message);
		this.data = data;
		this.status = status;
	}
}

export class InternalServerErrorException extends HttpException {
	constructor(public message: string = "Internal error server") {
		super(message, HTTP_STATUS.STATUS_500);
	}
}

export class BadRequestException extends HttpException {
	constructor(
		public message: string,
		public param?: string
	) {
		super(message, HTTP_STATUS.STATUS_400);
	}
}

export class NotFoundException<T> extends HttpException {
	constructor(
		public message: string = "not found",
		public data?: T,
		public status?: string
	) {
		super(message, HTTP_STATUS.STATUS_404, data, status);
	}
}

export class UnauthorizedException extends HttpException {
	constructor(public message: string) {
		super(message, HTTP_STATUS.STATUS_401);
	}
}

export class ForbiddenException extends HttpException {
	constructor(public message: string) {
		super(message, HTTP_STATUS.STATUS_403);
	}
}

export class ConflictException<T> extends HttpException {
	constructor(
		public message: string = "conflict",
		public data?: T,
		public status?: string
	) {
		super(message, HTTP_STATUS.STATUS_409, data, status);
	}
}

export class UnsupportedMediaTypeException extends HttpException {
	constructor(public message: string = "unsupported media type") {
		super(message, HTTP_STATUS.STATUS_415);
	}
}

export class UnprocessableEntityException extends HttpException {
	constructor(public message: string = "unprocessable entity") {
		super(message, HTTP_STATUS.STATUS_422);
	}
}

export class FailedDependencyException extends HttpException {
	constructor(
		public message: string = "failed dependency",
		public param?: string
	) {
		super(message, HTTP_STATUS.STATUS_424);
	}
}
export class TooManyRequestsException extends HttpException {
	constructor(public message: string) {
		super(message, HTTP_STATUS.STATUS_429);
	}
}

export class NotImplementedException extends HttpException {
	constructor(public message: string) {
		super(message, HTTP_STATUS.STATUS_501);
	}
}

export class ServiceUnavailableException extends HttpException {
	constructor(public message: string) {
		super(message, HTTP_STATUS.STATUS_503);
	}
}

export class GatewayTimeoutException extends HttpException {
	constructor(public message: string) {
		super(message, HTTP_STATUS.STATUS_504);
	}
}