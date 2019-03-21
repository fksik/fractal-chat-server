import {Model, Ref} from '@tsed/mongoose';
import {User} from './User';

@Model()
export class Account {
  public _id: string;
  public token: string;
  public name: string;
  @Ref(User) public users: Ref<User[]>;
}
