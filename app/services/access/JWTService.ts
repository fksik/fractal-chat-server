import { InvalidJWTTokenException } from '@chat/errors/http/access/InvalidJWTTokenException';
import { JWTGenerationException } from '@chat/errors/http/access/JWTGenerationException';
import { LoginResponse } from '@chat/model/access/LoginResponse';
import { Service } from '@tsed/di';
import { sign, verify } from 'jsonwebtoken';

const JWT_MAX_AGE = '1d';
@Service()
export class JWTService {
	public buildJWTToken(loginResponse: LoginResponse) {
		return new Promise<string>(resolve => {
			sign(
				loginResponse,
				'123',	// TODO move to .env
				{ algorithm: 'HS256', issuer: 'FRACTAL' },	// TODO move to .env
				(err, token) => {
					if (err) {
						throw new JWTGenerationException(err);
					} else {
						resolve(token);
					}
				}
			);
		});
	}

	public verifyAndGetJWTPayload(jwtToken: string) {
		return new Promise<LoginResponse>(resolve => {
			verify(
				jwtToken,
				'123',	// TODO move to .env
				{
					algorithms: ['HS256'],	// TODO move to .env
					issuer: 'FRACTAL',	// TODO move to .env
					maxAge: JWT_MAX_AGE
				},
				(err, decoded) => {
					if (err) {
						throw new InvalidJWTTokenException(err);
					} else {
						resolve(decoded as LoginResponse);
					}
				}
			);
		});
	}
}
