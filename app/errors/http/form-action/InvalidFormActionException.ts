import { FractalResponseCodes } from '@chat/constants/FractalResponseCodes';
import { IResponseError } from '@tsed/common';
import { HttpBaseException } from '../HttpBaseException';

export class InvalidFormActionException extends HttpBaseException
	implements IResponseError {
	public name: string = 'Invalid form action';

	constructor(origin?: Error | string | any) {
		super(
			200,
			FractalResponseCodes.FORM_KEY_GENERATION_FAILED,
			'invalid form action provided',
			origin
		);
	}
}
