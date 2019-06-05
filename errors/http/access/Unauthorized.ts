import { IResponseError } from '@tsed/common';
import { HttpBaseException } from '../HttpBaseException';
import { FractalResponseCodes } from '../../../constants/FractalResponseCodes';

export class Unauthorized extends HttpBaseException implements IResponseError {
	name: string = 'UNAUTHORIZED';

	constructor(origin?: Error | string | any) {
		super(401, FractalResponseCodes.UNAUTHORIZED, 'Invalid Token', origin);
	}
}
