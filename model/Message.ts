import { Model, Ref } from '@tsed/mongoose';

import { Conversation } from './Conversation';
import { User } from './User';
import { Property } from '@tsed/common';

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
	@Ref(Conversation) public conversation: Ref<Conversation>;
	@Property()
	public content: string;
	@Property()
	public sentOn: number;
	@Ref(User) public from: Ref<User>;
}
