import {
	IsEmail,
	IsNumber,
	IsOptional,
	IsString,
	MinLength,
} from "class-validator";

export class UpdateUserDTO {
	@IsOptional()
	@IsString()
	readonly token?: string;

	@IsOptional()
	@IsString()
	readonly username?: string;

	@IsOptional()
	@IsString()
	@MinLength(6)
	readonly password?: string;

	@IsOptional()
	@IsEmail()
	readonly email?: string;

	@IsOptional()
	@IsString()
	readonly firstName?: string;

	@IsOptional()
	@IsString()
	readonly lastName?: string;

	@IsOptional()
	@IsNumber()
	readonly phoneNo?: number;

	@IsOptional()
	@IsString()
	readonly address?: string;

	@IsOptional()
	@IsString()
	readonly roles?: string[];
}
