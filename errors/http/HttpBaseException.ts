import { Exception } from 'ts-httpexceptions';

export class HttpBaseException extends Exception {
	code: number;
	constructor(
		status: number,
		code: number,
		message: string,
		origin?: Error | string | any
	) {
		super(status, message, origin);
		this.code = code;
	}
}
