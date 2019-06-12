import { Required } from '@tsed/common';

export class RequestRefreshToken {
	@Required()
	public refreshToken: string;
}
