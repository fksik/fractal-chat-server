import {
	AuthenticatedMiddleware,
	EndpointInfo,
	EndpointMetadata,
	HeaderParams,
	IMiddleware,
	Next,
	OverrideMiddleware,
	Req
} from '@tsed/common';
import { Request } from 'express';
import { Unauthorized } from '../errors/http/access/Unauthorized';
import { AccessService } from '../services/access/AccessService';

@OverrideMiddleware(AuthenticatedMiddleware)
export class CustomAuthenticatedMiddleware implements IMiddleware {
	constructor(private accessService: AccessService) {}

	public async use(
		@EndpointInfo() endpoint: EndpointMetadata,
		@HeaderParams('authorization') bearerToken: string,
		@Req() request: Request,
		@Next() next: Express.NextFunction
	) {
		if (bearerToken.startsWith('Bearer')) {
			const jwtToken = bearerToken.slice(7, bearerToken.length);
			const accessToken = await this.accessService.verifyAndGetAccessTokenFromJWT(
				jwtToken
			);
			const user = await this.accessService.getUserUsingToken(accessToken);
			if (user) {
				request.user = user;
				next();
				return;
			}
		}
		throw new Unauthorized();
	}
}
