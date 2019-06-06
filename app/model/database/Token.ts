import { User } from '@chat/model/database/User';
import { Property, Required } from '@tsed/common';
import { Indexed, Model, Ref } from '@tsed/mongoose';

@Model()
export class Token {
	public _id: string;

	@Required()
	@Indexed()
	@Property()
	public token: string;

	@Required()
	@Indexed()
	@Property()
	public refreshToken: string;

	@Required()
	@Property()
	public createdAt: number;

	@Required()
	@Property()
	public expiresAt: number;

	@Required()
	@Ref(User)
	public user: Ref<User>;
}
