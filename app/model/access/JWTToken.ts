import { Property } from '@tsed/common';

export class JWTToken {
	@Property()
	public token: string;
	constructor(token: string) {
		this.token = token;
	}
}
