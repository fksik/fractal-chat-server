import { FractalResponseCodes } from '@chat/constants/FractalResponseCodes';
import { HttpBaseException } from '@chat/errors/http/HttpBaseException';
import { IResponseError } from '@tsed/common';

export class InvalidJWTTokenException extends HttpBaseException
	implements IResponseError {
	public name: string = 'Invalid JWT Token';

	constructor(origin?: Error | string | any) {
		super(
			401,
			FractalResponseCodes.INVALID_JWT_TOKEN,
			'Invalid JWT Token',
			origin
		);
	}
}
