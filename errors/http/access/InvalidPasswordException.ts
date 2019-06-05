import { IResponseError } from '@tsed/common';
import { HttpBaseException } from '../HttpBaseException';
import { FractalResponseCodes } from '../../../constants/FractalResponseCodes';

export class InvalidPasswordException extends HttpBaseException
	implements IResponseError {
	name: string = 'UNAUTHORIZED';

	constructor(origin?: Error | string | any) {
		super(
			401,
			FractalResponseCodes.INVALID_PASSWORD,
			'Invalid Password',
			origin
		);
	}
}
