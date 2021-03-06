import { ApiModelProperty, ApiModelPropertyOptional } from "@nestjs/swagger";
import {
	IsEmail,
	IsOptional,
	IsString,
	MinLength,
	IsPhoneNumber,
	IsDateString,
	ValidateNested,
} from "class-validator";
import { Document } from "mongoose";
import { Type } from "class-transformer";

export interface IEvents extends Document {
	title: string;
	category: string;
	description?: string;
	secret?: string;
	email?: string;
	phoneNo?: string;
	address?: string;
	mode: string;
	cost: string;
	createdBy?: string;
	date: string;
	toResponseJSON?(id?): any;
}

export class EventDateDTO {
	@IsString()
	@IsDateString()
	@ApiModelProperty()
	start: string;

	@IsString()
	@IsDateString()
	@ApiModelProperty()
	end: string;
}

// tslint:disable-next-line:max-classes-per-file
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

	@IsOptional()
	@IsString()
	readonly createdBy: string;

	@ValidateNested()
	@ApiModelProperty()
	@Type(() => EventDateDTO)
	readonly date: EventDateDTO;
}
