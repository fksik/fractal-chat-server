import {PropertyType} from '@tsed/common';
import {Model, Ref} from '@tsed/mongoose';

import {Account} from './Account';
import {User} from './User';

@Model()
export class Conversation {
  public _id: string;
  @Ref(User) public users: Ref<User[]>;
  @Ref(Account) public account: Ref<Account>;
}
