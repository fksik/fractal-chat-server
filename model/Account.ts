import { Enum, PropertyType, Schema } from '@tsed/common';
import { Model, Ref } from '@tsed/mongoose';

import { User } from './User';

export enum Role {
	ADMIN = 1,
	OPERATOR = 2
}

@Schema({})
export class LinkedUser {
	addDate: number;
	@Enum(Role) roles: Role;
	@Ref(User) public user: Ref<User>;
}
@Model()
export class Account {
	public _id: string;
	public token: string;
	public name: string;
	@PropertyType(LinkedUser) linkedUser: LinkedUser[];
}
