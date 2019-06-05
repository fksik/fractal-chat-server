import { Controller, Get, Res, Authenticated } from '@tsed/common';
import { Response } from 'express';
import { $log as logger } from 'ts-log-debug';

@Controller('/')
export class HomeController {
	@Get('/')
	@Authenticated(['admin'])
	public async index(@Res() response: Response) {
		response.send('hello');
	}
}
