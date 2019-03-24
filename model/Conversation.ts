import { Model, Ref, Schema } from '@tsed/mongoose';

import { Account } from './Account';
import { User } from './User';
import { PropertyType, Property } from '@tsed/common';

@Schema()
export class Participant {
	constructor(user: User, addedBy: User) {
		this.addedAt = new Date().getTime();
		this.user = user;
		this.addedBy = user;
	}
	@Ref(User)
	public user: Ref<User>;
	@Property()
	public addedAt: number;
	@Ref(User)
	public addedBy: Ref<User>;
}

@Model()
export class Conversation {
	public _id: string;
	public constructor(isPrivate = true, url?: string) {
		this.isPrivate = isPrivate;
		this.url = url;
	}
	public createdAt: number;
	@Property()
	public isPrivate: boolean;
	@Property()
	public url?: string;
	@Ref(User)
	public createdBy: Ref<User>;
	@PropertyType(Participant)
	public participants: Participant[];
	@Ref(Account) public account: Ref<Account>;

	public addParticipant(user: User, addedBy: User) {
		const participant = new Participant(user, addedBy);
		if (!Array.isArray(this.participants)) {
			this.participants = [];
		}
		this.participants.push(participant);
	}

	public markAsNew(createdBy: User) {
		this.createdAt = new Date().getTime();
		this.addParticipant(createdBy, createdBy);
	}
}
