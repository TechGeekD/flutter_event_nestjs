import {
	IsEmail,
	IsOptional,
	IsString,
	MinLength,
	IsPhoneNumber,
	IsDateString,
} from "class-validator";

export class CreateEventDTO {
	@IsString()
	readonly title: string;

	@IsString()
	readonly category: string;

	@IsOptional()
	@IsString()
	readonly description?: string;

	@IsOptional()
	@IsString()
	readonly secret?: string;

	@IsOptional()
	@IsEmail()
	readonly email?: string;

	@IsOptional()
	@IsPhoneNumber("ZZ")
	@MinLength(10)
	readonly phoneNo?: string;

	@IsOptional()
	@IsString()
	readonly address?: string;

	@IsString()
	readonly mode: string;

	@IsString()
	readonly cost: string;

	@IsString()
	readonly createdBy: string;

	@IsString()
	@IsDateString()
	readonly date: string;
}
