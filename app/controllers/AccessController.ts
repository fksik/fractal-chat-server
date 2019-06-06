import {
	Controller,
	Post,
	BodyParams
} from '@tsed/common';
import {NewUser} from '@chat/model/access/NewUser';
import { AccessService } from '@chat/services/AccessService';
import { LoginRequest } from '@chat/model/access/LoginRequest';

@Controller('/access')
export class AccessController {
	constructor(private accessService: AccessService) {}

	@Post('/login')
	async login(@BodyParams() credentials: LoginRequest) {
		const { password, username } = credentials;
		return await this.accessService.gainAccess(username, password);
	}

	@Post('/register')
	async register(@BodyParams() data: NewUser) {
		await this.accessService.checkIfUserAlreadyExists(data);
		return await this.accessService.createNewUser(data.username, data.password);
	}
}
