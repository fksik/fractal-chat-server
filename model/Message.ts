import { Model, Ref } from '@tsed/mongoose';

import { Conversation } from './Conversation';
import { User } from './User';
import { Property, Required } from '@tsed/common';

@Model()
export class Message {
	constructor(
		conversation: Conversation,
		from: User,
		content: string,
		sentOn: number
	) {
		this.conversation = conversation;
		this.content = content;
		this.from = from;
		this.sentOn = sentOn;
	}
	public _id: string;
	@Required()
	@Ref(Conversation)
	public conversation: Ref<Conversation>;
	@Property()
	@Required()
	public content: string;
	@Required()
	@Property()
	public sentOn: number;
	@Required()
	@Ref(User)
	public from: Ref<User>;
}
