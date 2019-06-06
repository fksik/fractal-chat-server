import { LoginRequest } from '@chat/model/access/LoginRequest';
import { NewUser } from '@chat/model/access/NewUser';
import { AccessService } from '@chat/services/access/AccessService';
import { BodyParams, Controller, Post } from '@tsed/common';

@Controller('/access')
export class AccessController {
	constructor(private accessService: AccessService) {}

	@Post('/login')
	public async login(@BodyParams() credentials: LoginRequest) {
		const { password, username } = credentials;
		return await this.accessService.gainAccess(username, password);
	}

	@Post('/register')
	public async register(@BodyParams() data: NewUser) {
		await this.accessService.checkIfUserAlreadyExists(data);
		return await this.accessService.createNewUser(data.username, data.password);
	}
}
