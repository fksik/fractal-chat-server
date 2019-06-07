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
				'123',
				{ algorithm: 'HS256', issuer: 'FRACTAL' },
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
				'123',
				{
					algorithms: ['HS256'],
					issuer: 'FRACTAL',
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
