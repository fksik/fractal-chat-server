import { Required } from '@tsed/common';
export class NewUser {
	@Required()
	username: string;
	@Required()
	password: string;
}
