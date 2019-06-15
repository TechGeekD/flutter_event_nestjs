import { ApiModelProperty } from "@nestjs/swagger";
import { IsString, IsEmail, IsArray, IsOptional, MinLength } from "class-validator";

export class UserCredsDTO {
	@IsString()
	@ApiModelProperty()
	readonly username: string;

	@IsString()
	@MinLength(6)
	@ApiModelProperty()
	readonly password: string;

	@IsOptional()
	@IsEmail()
	@ApiModelProperty()
	readonly email: string;
}
