import { Required } from '@tsed/common';
export class LoginRequest {
	@Required()
	public username: string;
	@Required()
	public password: string;
}
