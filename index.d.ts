import { User } from '@chat/model/database/User';

declare global {
	namespace Express {
		interface Request {
			user?: User;
		}
	}
}
