import { Property, Required } from '@tsed/common';
import { Indexed, Model } from '@tsed/mongoose';

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
	@Indexed()
	public email?: string;
	@Property()
	public password?: string;
	@Property()
	public salt?: string;
	@Property()
	public firstName?: string;
	@Property()
	public lastName?: string;
	@Property()
	public picture?: string;
	constructor(createdDate?: number, isBot: boolean = false) {
		this.createdDate = createdDate || new Date().getTime();
		this.isBot = isBot;
	}
}
