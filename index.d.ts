import { User } from '@chat/model/User';

declare global {
	namespace Express {
		interface Request {
			user?: User;
		}
	}
}
