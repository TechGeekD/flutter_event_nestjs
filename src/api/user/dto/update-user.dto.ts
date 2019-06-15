import { ApiModelPropertyOptional } from "@nestjs/swagger";
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
	@ApiModelPropertyOptional()
	readonly token?: string;

	@IsOptional()
	@IsString()
	@ApiModelPropertyOptional()
	readonly username?: string;

	@IsOptional()
	@IsString()
	@MinLength(6)
	@ApiModelPropertyOptional()
	readonly password?: string;

	@IsOptional()
	@IsEmail()
	@ApiModelPropertyOptional()
	readonly email?: string;

	@IsOptional()
	@IsString()
	@ApiModelPropertyOptional()
	readonly firstName?: string;

	@IsOptional()
	@IsString()
	@ApiModelPropertyOptional()
	readonly lastName?: string;

	@IsOptional()
	@IsNumber()
	@ApiModelPropertyOptional()
	readonly phoneNo?: string;

	@IsOptional()
	@IsString()
	@ApiModelPropertyOptional()
	readonly address?: string;

	@IsOptional()
	@IsString()
	@ApiModelPropertyOptional()
	readonly roles?: string[];
}
