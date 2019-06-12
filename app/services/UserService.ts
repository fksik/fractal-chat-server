import { User } from '@chat/model/database/User';
import { Inject, Service } from '@tsed/di';
import { MongooseModel } from '@tsed/mongoose';

@Service()
export class UserService {
	constructor(@Inject(User) private userModel: MongooseModel<User>) {}

	public async getUserById(userId: string) {
		return this.userModel.findById(userId);
	}

	public async createNewAnonymousUser() {
		const user = new User(new Date().getTime());
		const model = new this.userModel(user);
		await model.save();
		return model;
	}
}
