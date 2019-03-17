import {Controller, Get, Res} from '@tsed/common';
import {Response} from 'express';
import { $log as logger } from 'ts-log-debug';

@Controller('/')
export class HomeController {
  @Get('/')
  public async index(@Res() response: Response) {
    response.send('hello');
  }
}
