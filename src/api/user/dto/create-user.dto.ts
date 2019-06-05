import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";

export class CreateUserDTO {
	@IsOptional()
	@IsString()
	readonly username: string;

	@IsOptional()
	@IsString()
	@MinLength(6)
	readonly password: string;

	@IsOptional()
	@IsEmail()
	readonly email: string;
}
