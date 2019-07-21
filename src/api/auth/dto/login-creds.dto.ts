import { ApiModelProperty } from "@nestjs/swagger";
import {
	IsString,
	IsEmail,
	MinLength,
	ValidateIf,
	IsDefined,
} from "class-validator";

export class LoginCredsDTO {
	@ValidateIf(o => o.email === null || o.email === undefined)
	@IsDefined()
	@IsString()
	@ApiModelProperty()
	readonly username: string;

	@IsString()
	@MinLength(6)
	@ApiModelProperty()
	readonly password: string;

	@ValidateIf(o => o.username === null || o.username === undefined)
	@IsDefined()
	@IsEmail()
	@ApiModelProperty()
	readonly email: string;
}

export interface IJwtPayload {
	id?: string;
	username: string;
	email: string;
	roles?: string[];
}
