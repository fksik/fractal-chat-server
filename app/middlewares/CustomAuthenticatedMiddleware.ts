import {
	IMiddleware,
	EndpointMetadata,
	EndpointInfo,
	Next,
	AuthenticatedMiddleware,
	OverrideMiddleware,
	HeaderParams,
	Req
} from '@tsed/common';
import { Response, Request } from 'express';
import { AccessService } from '../services/AccessService';
import { Unauthorized } from '../errors/http/access/Unauthorized';

@OverrideMiddleware(AuthenticatedMiddleware)
export class CustomAuthenticatedMiddleware implements IMiddleware {
	constructor(private accessService: AccessService) {}

	public async use(
		@EndpointInfo() endpoint: EndpointMetadata,
		@HeaderParams('authorization') token: string,
		@Req() request: Request,
		@Next() next: Express.NextFunction
	) {
		if (token.startsWith('Bearer')) {
			token = token.slice(7, token.length);
			const options = endpoint.get(AuthenticatedMiddleware) || {};
			request.user = await this.accessService.getUserUsingToken(token);
			if (request.user) {
				next();
				return;
			}
		}
		throw new Unauthorized();
	}
}
