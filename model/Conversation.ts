import { Model, Ref } from '@tsed/mongoose';

import { Account } from './Account';

@Model()
export class Conversation {
	public _id: string;
	@Ref(Account) public account: Ref<Account>;
}
