import { Document } from "mongoose";

export interface IUser extends Document {
	token?: string;
	username: string;
	password: number;
	email: string;
	firstName?: string;
	lastName?: string;
	phoneNo?: number;
	address?: string;
	roles: string[];
	toAuthJSON: () => {};
	toProfileJSON: () => {};
	toValidateUserJSON: () => {};
	validatePassword: (password) => {};
	setPassword: () => {};
}
