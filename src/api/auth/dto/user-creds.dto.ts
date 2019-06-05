import { IsString, IsEmail, IsArray, IsOptional, MinLength } from "class-validator";

export class UserCredsDTO {
	@IsString()
	readonly username: string;

	@IsString()
	@MinLength(6)
	readonly password: string;

	@IsEmail()
	readonly email: string;

	@IsOptional()
	@IsString({ each: true })
	readonly roles: string[];
}
