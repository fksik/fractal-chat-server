import { Model } from '@tsed/mongoose';
import { Required, Property } from '@tsed/common';

@Model()
export class User {
	public _id: string;
	@Property()
	@Required()
	public createdDate: number;
	@Property()
	@Required()
	public isBot = false;
	@Property()
	public email?: string;
	@Property()
	public password?: string;
	@Property()
	public firstName?: string;
	@Property()
	public lastName?: string;
	@Property()
	public picture?: string;
	constructor(createdDate: number, isBot: boolean = false) {
		this.createdDate = createdDate;
		this.isBot = isBot;
	}
}
