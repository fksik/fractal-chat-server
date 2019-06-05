import { IResponseError } from '@tsed/common';
import { HttpBaseException } from '../HttpBaseException';
import { FractalResponseCodes } from '../../../constants/FractalResponseCodes';

export class UserNotFoundException extends HttpBaseException
	implements IResponseError {
	name: string = 'UNAUTHORIZED';

	constructor(origin?: Error | string | any) {
		super(401, FractalResponseCodes.USER_NOT_FOUND, 'user not found', origin);
	}
}
