import { Service, Inject } from '@tsed/di';
import { MongooseModel } from '@tsed/mongoose';
import { randomBytes, pbkdf2 } from 'crypto';
import { User } from '../model/User';
import { SimpleToken } from '../model/SimpleToken';
import { InvalidPasswordException } from '../errors/http/access/InvalidPasswordException';
import { UserNotFoundException } from '../errors/http/access/UserNotFoundException';
import { NewUser } from '../model/access/NewUser';
import { UserAlreadyExists } from '../errors/http/UserAlreadyExists';
import { UUID_V4 } from '../utils/UUID_V4';
import { LoginResponse } from '../model/access/LoginResponse';
const expiryTime: number = 3.6e6;

@Service()
export class AccessService {
	constructor(
		@Inject(User) private userModel: MongooseModel<User>,
		@Inject(SimpleToken) private simpleTokenModel: MongooseModel<SimpleToken>
	) {}

	public async gainAccess(userName: string, password: string) {
		const user = (await this.userModel
			.findOne({ email: userName })
			.exec()) as User;
		if (user) {
			if (await this.verifyPassword(user, password)) {
				const simpleToken = await this.createSimpleAccessTokenForUser(user);
				return this.buildLoginResponse(user, simpleToken);
			} else {
				throw new InvalidPasswordException();
			}
		} else {
			throw new UserNotFoundException();
		}
	}

	public async createNewUser(username: string, password: string) {
		const user = new User();
		user.email = username;
		const hashRes = await this.generateHash(password);
		user.password = hashRes.hash;
		user.salt = hashRes.salt;
		const model = new this.userModel(user);
		const savedModel = (await model.save()) as User;
		const accessToken = await this.createSimpleAccessTokenForUser(savedModel);
		return this.buildLoginResponse(savedModel, accessToken);
	}

	public async checkIfUserAlreadyExists(data: NewUser) {
		const user = (await this.userModel
			.findOne({ email: data.username })
			.exec()) as User;
		if (user) {
			throw new UserAlreadyExists();
		}
	}

	private generateHash(password: string) {
		const salt = randomBytes(16).toString('hex');
		return new Promise<{ hash: string; salt: string }>(resolve => {
			pbkdf2(password, salt, 1000, 64, 'sha512', (err, derivedKey) => {
				if (err) {
					throw err;
				}
				resolve({ hash: derivedKey.toString('hex'), salt });
			});
		});
	}

	private async createSimpleAccessTokenForUser(user: User) {
		const simpleAccessToken = new SimpleToken();
		simpleAccessToken.token = UUID_V4();
		simpleAccessToken.refreshToken = UUID_V4();
		simpleAccessToken.user = user;
		const now = Date.now();
		simpleAccessToken.createdAt = now;
		simpleAccessToken.expiresAt = now + expiryTime;
		const model = new this.simpleTokenModel(simpleAccessToken);
		return (await model.save()) as SimpleToken;
	}

	private buildLoginResponse(user: User, token: SimpleToken) {
		const result = new LoginResponse();
		result.email = user.email;
		result.firstName = user.firstName;
		result.lastName = user.lastName;
		result.picture = user.picture;
		result.token = token.token;
		result.refreshToken = token.refreshToken;
		result.expiresAt = token.expiresAt;
		return result;
	}

	private async verifyPassword(user: User, check: string) {
		const salt = user.salt as string;
		return new Promise<boolean>(resolve => {
			pbkdf2(check, salt, 1000, 64, 'sha512', (err, derivedKey) => {
				if (err) {
					throw err;
				}
				resolve(derivedKey.toString('hex') === user.password);
			});
		});
	}

	async getUserUsingToken(token: string) {
		const tokenDoc = await this.simpleTokenModel.findOne({ token });
		if (tokenDoc) {
			const userDoc = await this.userModel.findOne({ user: tokenDoc.user });
			if (userDoc) {
				return userDoc;
			}
		}
		return undefined;
	}
}
