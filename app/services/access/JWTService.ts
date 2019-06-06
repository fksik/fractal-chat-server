import { JWTGenerationException } from '@chat/errors/http/access/JWTGenerationException';
import { LoginResponse } from '@chat/model/access/LoginResponse';
import { Service } from '@tsed/di';
import { sign } from 'jsonwebtoken';

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
}
