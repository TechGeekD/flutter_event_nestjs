import { ApiModelPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";
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
	setRoleAndPassword: (role) => {};
}

export class CreateUserDTO {
	@IsOptional()
	@IsString()
	@ApiModelPropertyOptional()
	readonly username: string;

	@IsOptional()
	@IsString()
	@MinLength(6)
	@ApiModelPropertyOptional()
	readonly password: string;

	@IsOptional()
	@IsEmail()
	@ApiModelPropertyOptional()
	readonly email: string;
}
