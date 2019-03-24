import { Model, Ref, Schema } from '@tsed/mongoose';

import { Account } from './Account';
import { User } from './User';
import { PropertyType } from '@tsed/common';

@Schema()
export class Participant {
	@Ref(User)
	user: Ref<User>
	addedAt: number;
	@Ref(User)
	addedBy: Ref<User>;
}

@Model()
export class Conversation {
	public _id: string;
	public isPrivate: boolean;
	public url: string;
	@Ref(User)
	public createdBy: Ref<User>;
	@PropertyType(Participant)
	public participants: Participant[];
	@Ref(Account) public account: Ref<Account>;
}
