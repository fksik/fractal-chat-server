import { Participant } from '@db-models/Participant';
import { User } from '@db-models/User';
import { Property, PropertyType } from '@tsed/common';
import { Model, Ref } from '@tsed/mongoose';

@Model()
export class Conversation {
	public _id: string;
	@Property()
	public createdAt: number;
	@Property()
	public isPrivate: boolean;
	@Property()
	public url?: string;
	@Ref(User)
	public createdBy: Ref<User>;
	@PropertyType(Participant)
	public participants: Participant[];

	public constructor(isPrivate = true, url?: string) {
		this.isPrivate = isPrivate;
		this.url = url;
	}

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
