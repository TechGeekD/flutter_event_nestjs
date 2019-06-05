import { IsString, IsEmail } from "class-validator";

export interface IJwtPayload {
	id?: string;
	username: string;
	email: string;
	roles?: string[];
}
