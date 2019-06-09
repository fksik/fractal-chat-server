import { Property } from '@tsed/common';
import { Ref, Schema } from '@tsed/mongoose';
import { User } from './User';

@Schema()
export class Participant {
	@Ref(User)
	public user: Ref<User>;
	@Property()
	public addedAt: number;
	@Ref(User)
	public addedBy: Ref<User>;
	constructor(user: User, addedBy: User) {
		this.addedAt = new Date().getTime();
		this.user = user;
		this.addedBy = addedBy;
	}
}
