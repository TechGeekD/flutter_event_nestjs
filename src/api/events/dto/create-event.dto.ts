import { ApiModelProperty, ApiModelPropertyOptional } from "@nestjs/swagger";
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
	@ApiModelProperty()
	readonly title: string;

	@IsString()
	@ApiModelProperty()
	readonly category: string;

	@IsOptional()
	@IsString()
	@ApiModelPropertyOptional()
	readonly description?: string;

	@IsOptional()
	@IsString()
	@ApiModelPropertyOptional()
	readonly secret?: string;

	@IsOptional()
	@IsEmail()
	@ApiModelPropertyOptional()
	readonly email?: string;

	@IsOptional()
	@IsPhoneNumber("ZZ")
	@MinLength(10)
	@ApiModelPropertyOptional()
	readonly phoneNo?: string;

	@IsOptional()
	@IsString()
	@ApiModelPropertyOptional()
	readonly address?: string;

	@IsString()
	@ApiModelProperty()
	readonly mode: string;

	@IsString()
	@ApiModelProperty()
	readonly cost: string;

	@IsString()
	@ApiModelProperty()
	readonly createdBy: string;

	@IsString()
	@IsDateString()
	@ApiModelProperty()
	readonly date: string;
}
