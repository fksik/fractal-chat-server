import { Enum, PropertyType, Schema, Property } from '@tsed/common';
import { Model, Ref } from '@tsed/mongoose';

import { User } from './User';

export enum Role {
	ADMIN = 1,
	OPERATOR = 2
}

@Schema({})
export class LinkedUser {
	@Property()
	addDate: number;
	@Enum(Role) roles: Role;
	@Ref(User) public user: Ref<User>;
}
@Model()
export class Account {
	public _id: string;
	@Property()
	public token: string;
	@Property()
	public name: string;
	@PropertyType(LinkedUser) linkedUser: LinkedUser[];
}
