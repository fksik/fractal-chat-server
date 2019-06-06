import { FractalResponseCodes } from '@chat/constants/FractalResponseCodes';
import { HttpBaseException } from '@chat/errors/http/HttpBaseException';
import { IResponseError } from '@tsed/common';

export class JWTGenerationException extends HttpBaseException
	implements IResponseError {
	public name: string = 'JWT Failed to generate';

	constructor(origin?: Error | string | any) {
		super(
			401,
			FractalResponseCodes.JWT_GENERATION_FAILED,
			'Failed to generate JWT token',
			origin
		);
	}
}
