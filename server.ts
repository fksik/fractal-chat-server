import {GlobalAcceptMimesMiddleware, ServerLoader, ServerSettings} from '@tsed/common';
import {Env} from '@tsed/core';
import {json, urlencoded} from 'body-parser';
import * as compress from 'compression';
// import * as cookieParser from 'cookie-parser';
import * as Express from 'express';
import {readFileSync} from 'fs';
import * as methodOverride from 'method-override';
import {resolve} from 'path';
import {$log as logger, Logger} from 'ts-log-debug';

@ServerSettings({
  acceptMimes: ['application/json'],
  debug: true,
  env: Env.DEV,
  httpPort: false,
  httpsPort: 8000,
  socketIO: {
    path: '/sock.io',
  },
  httpsOptions: {
    cert: readFileSync('./certs/server.cert'),
    key: readFileSync('./certs/server.key'),
    passphrase: '1234'
  },
  mount: {'/api/v1': '${rootDir}/controllers/**/*.ts'},
  rootDir: resolve(__dirname)
})
export class Server extends ServerLoader {
  constructor() {
    super();
    const loggerConf = new Logger('fractal');
    loggerConf.appenders
        .set('std-log', {type: 'stdout', levels: ['info', 'trace']})
        .set('error-log', {type: 'stderr', levels: ['fatal', 'error', 'warn']})
        .set('all-log-file', {
          type: 'file',
          filename: `${__dirname}/log/app.log`,
          maxLogSize: 1024 * 1024 * 5,
          backups: 2
        });
  }

  public $onMountingMiddlewares(): void|Promise<any> {
    this.use(GlobalAcceptMimesMiddleware)
        .use(compress({}))
        .use(methodOverride())
        .use(json())
        .use(urlencoded({extended: true}));
    return;
  }

  public $onReady() {
    logger.info('Server started...');
  }

  public $onServerInitError(err: any) {
    logger.error(err);
  }
}

new Server().start();
