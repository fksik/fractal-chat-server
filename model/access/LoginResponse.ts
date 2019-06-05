import { Property } from '@tsed/common';

export class LoginResponse {
	@Property()
	firstName?: string;
	@Property()
	lastName?: string;
	@Property()
	email?: string;
	@Property()
	token: string;
	@Property()
	refreshToken: string;
	@Property()
	expiresAt: number;
	@Property()
	picture?: string;
}
