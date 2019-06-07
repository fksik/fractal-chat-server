import { InvalidPasswordException } from '@chat/errors/http/access/InvalidPasswordException';
import { UserAlreadyExists } from '@chat/errors/http/access/UserAlreadyExists';
import { UserNotFoundException } from '@chat/errors/http/access/UserNotFoundException';
import { JWTToken } from '@chat/model/access/JWTToken';
import { LoginResponse } from '@chat/model/access/LoginResponse';
import { NewUser } from '@chat/model/access/NewUser';
import { Token } from '@chat/model/database/Token';
import { User } from '@chat/model/database/User';
import { JWTService } from '@chat/services/access/JWTService';
import { UUID_V4 } from '@chat/utils/UUID_V4';
import { Inject, Service } from '@tsed/di';
import { MongooseModel } from '@tsed/mongoose';
import { pbkdf2, randomBytes } from 'crypto';
import { $log } from '@tsed/common';

const expiryTime: number = 3.6e6;

@Service()
export class AccessService {
	constructor(
		@Inject(User) private userModel: MongooseModel<User>,
		@Inject(Token) private tokenModel: MongooseModel<Token>,
		private jwtService: JWTService
	) {}

	public async gainAccess(userName: string, password: string) {
		const user = (await this.userModel
			.findOne({ email: userName })
			.exec()) as User;
		if (user) {
			if (await this.verifyPassword(user, password)) {
				const simpleToken = await this.createSimpleAccessTokenForUser(user);
				const login = this.buildLoginResponse(user, simpleToken);
				const token = await this.jwtService.buildJWTToken(login);
				return new JWTToken(token);
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

	public async getUserUsingToken(token: string) {
		const tokenDoc = await this.tokenModel.findOne({ token });
		if (tokenDoc) {
			const userDoc = await this.userModel.findById(tokenDoc.user);
			if (userDoc) {
				return userDoc;
			}
		}
		return undefined;
	}

	public async verifyAndGetAccessTokenFromJWT(
		jwtToken: string
	): Promise<string> {
		const user = await this.jwtService.verifyAndGetJWTPayload(jwtToken);
		return user.token;
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
		const simpleAccessToken = new Token();
		simpleAccessToken.token = UUID_V4();
		simpleAccessToken.refreshToken = UUID_V4();
		simpleAccessToken.user = user;
		const now = Date.now();
		simpleAccessToken.createdAt = now;
		simpleAccessToken.expiresAt = now + expiryTime;
		const model = new this.tokenModel(simpleAccessToken);
		return (await model.save()) as Token;
	}

	private buildLoginResponse(user: User, token: Token) {
		const result: LoginResponse = {
			email: user.email,
			firstName: user.firstName,
			lastName: user.lastName,
			picture: user.picture,
			token: token.token,
			refreshToken: token.refreshToken,
			expiresAt: token.expiresAt
		};
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
}
