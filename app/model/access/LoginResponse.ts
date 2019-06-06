export interface LoginResponse {
	firstName?: string;
	lastName?: string;
	email?: string;
	token: string;
	refreshToken: string;
	picture?: string;
	expiresAt: number;
}
