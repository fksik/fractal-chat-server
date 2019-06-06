import { Required, Property } from '@tsed/common';
import { Ref, Model, Indexed } from '@tsed/mongoose';
import { User } from './User';

@Model()
export class SimpleToken {
	_id: string;
	
	@Required()
	@Indexed()
	@Property()
	token: string;

	@Required()
	@Indexed()
	@Property()
	refreshToken: string;

	@Required()
	@Property()
	createdAt: number;

	@Required()
	@Property()
	expiresAt: number;
	
	@Required()
	@Ref(User)
	user: Ref<User>;
}
