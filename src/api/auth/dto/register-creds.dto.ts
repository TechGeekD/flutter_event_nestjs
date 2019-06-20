import { ApiModelProperty } from "@nestjs/swagger";
import { IsString, IsEmail, MinLength, IsDefined } from "class-validator";

export class RegisterCredsDTO {
	@IsDefined()
	@IsString()
	@ApiModelProperty()
	readonly username: string;

	@IsString()
	@MinLength(6)
	@ApiModelProperty()
	readonly password: string;

	@IsDefined()
	@IsEmail()
	@ApiModelProperty()
	readonly email: string;
}
