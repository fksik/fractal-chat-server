import { Authenticated, Controller, Get, Res } from '@tsed/common';
import { Response } from 'express';

@Controller('/')
export class HomeController {
	@Get('/')
	@Authenticated(['admin'])
	public async index(@Res() response: Response) {
		response.send('hello');
	}
}
