import { Conversation } from '@db-models/Conversation';
import { User } from '@db-models/User';
import { Property, Required } from '@tsed/common';
import { Indexed, Model, Ref } from '@tsed/mongoose';

@Model()
export class Message {
	public _id: string;
	@Required()
	@Ref(Conversation)
	@Indexed()
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
	@Required()
	@Property()
	public type: 'file' | 'text';
	@Property()
	public filePath: string;
	@Property()
	public isURL:	boolean;

	constructor(
		conversation: Conversation,
		from: User,
		content: string,
		sentOn: number,
		isURL = false
	) {
		this.conversation = conversation;
		this.content = content;
		this.from = from;
		this.sentOn = sentOn;
		this.isURL = isURL;
	}
}
