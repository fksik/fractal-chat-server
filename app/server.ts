import { GlobalAcceptMimesMiddleware, ServerLoader, ServerSettings } from '@tsed/common';
import { Env } from '@tsed/core';
import { json, urlencoded } from 'body-parser';
import * as compress from 'compression';
import * as cors from 'cors';
// import * as cookieParser from 'cookie-parser';
import * as methodOverride from 'method-override';
import { resolve } from 'path';
import { $log as logger, Logger } from 'ts-log-debug';
import './middlewares/CustomAuthenticatedMiddleware';
import './middlewares/CustomGolbalErrorHandlerMiddleware';

@ServerSettings({
	acceptMimes: ['application/json'],
	debug: true,
	mongoose: {
		urls: {
			'fractal-messages': {
				url: 'mongodb+srv://fractal-chat-qsvvo.mongodb.net?retryWrites=true',
				connectionOptions: {
					useNewUrlParser: true,
					user: 'admin',
					pass: 'admin@123',
					dbName: 'fractal-messages',
					reconnectInterval: 500,
					poolSize: 5
				}
			}
		}
	},
	env: Env.DEV,
	httpsPort: false,
	httpPort: 8001,
	socketIO: {
		path: '/sock.io'
	},
	mount: { '/api': '${rootDir}/controllers/**/*.ts' },
	rootDir: resolve(__dirname)
})
export class Server extends ServerLoader {
	constructor() {
		super();
		const loggerConf = new Logger('fractal');
		loggerConf.appenders
			.set('std-log', { type: 'stdout', levels: ['info', 'trace'] })
			.set('error-log', { type: 'stderr', levels: ['fatal', 'error', 'warn'] })
			.set('all-log-file', {
				type: 'file',
				filename: `${__dirname}/log/app.log`,
				maxLogSize: 1024 * 1024 * 5,
				backups: 2
			});
	}

	public $onMountingMiddlewares(): void | Promise<any> {
		this.use(GlobalAcceptMimesMiddleware)
			.use(cors())
			.use(compress({}))
			.use(methodOverride())
			.use(json())
			.use(urlencoded({ extended: true }));
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
