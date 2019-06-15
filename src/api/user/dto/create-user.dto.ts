import { ApiModelPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";

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
