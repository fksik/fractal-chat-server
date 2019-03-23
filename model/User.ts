import { Model } from '@tsed/mongoose';

@Model()
export class User {
	constructor(
		public _id: string,
		public createdDate: number,
		public isBot = false,
		public email?: string,
		public password?: string,
		public firstName?: string,
		public lastName?: string,
		public picture?: string
	) {}
}
