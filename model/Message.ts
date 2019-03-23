import { Model, Ref } from '@tsed/mongoose';

import { Conversation } from './Conversation';
import { User } from './User';

@Model()
export class Message {
	public _id: string;
	@Ref(Conversation) public conversation: Ref<Conversation>;
	public content: string;
	public sentOn: number;
	@Ref(User) public from: Ref<User>;
}
