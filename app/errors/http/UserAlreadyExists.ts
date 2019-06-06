import { BadRequest } from 'ts-httpexceptions';
import { IResponseError } from '@tsed/common';

export class UserAlreadyExists extends BadRequest implements IResponseError {
	errors = [];
	constructor() {
		super('user already exists');
		this.errors.push()
	}
}
