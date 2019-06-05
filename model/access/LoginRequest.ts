import { Required } from '@tsed/common';
export class LoginRequest {
	@Required()
	username: string;
	@Required()
	password: string;
}
