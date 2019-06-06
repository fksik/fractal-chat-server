import { Request, Response } from 'express';
import {
	OverrideMiddleware,
	GlobalErrorHandlerMiddleware,
	Err,
	Req,
	Res
} from '@tsed/common';
import { Exception } from 'ts-httpexceptions';
import { HttpBaseException } from '../errors/http/HttpBaseException';

@OverrideMiddleware(GlobalErrorHandlerMiddleware)
export class CustomGlobalErrorHandlerMiddleware {
	use(@Err() error: any, @Req() request: Request, @Res() response: Response) {
		if (error instanceof HttpBaseException) {
			request.log.error({
				error: {
					message: error.message,
					stack: error.stack,
					status: error.status
				}
			});
			response
				.status(error.status)
				.json({ message: error.message, code: error.code });
			return;
		}
		if (error instanceof Exception) {
			request.log.error({
				error: {
					message: error.message,
					stack: error.stack,
					status: error.status
				}
			});
			response.status(error.status).json({ message: error.message });
			return;
		}

		if (typeof error === 'string') {
			response.status(404).json({ message: error });
			return;
		}

		request.log.error({
			error: {
				status: 500,
				message: error.message,
				stack: error.stack
			}
		});
		response.status(error.status || 500).json({ message: 'Internal Error' });

		return;
	}
}
