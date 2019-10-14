import { ApiModelPropertyOptional, ApiModelProperty } from "@nestjs/swagger";
import { IsOptional, IsString, MinLength, IsDateString } from "class-validator";
import { Document } from "mongoose";

export interface IMatch extends Document {
	eventId: string;
	match: string;
	note?: string;
	participantId: string[];
	date: string;
	matchType: string;
	result: any;
	toResponseJSON?(): any;
}

export class CreateMatchDTO {
	@IsString()
	@ApiModelProperty()
	readonly eventId: string;

	@IsString()
	@MinLength(3)
	@ApiModelProperty()
	readonly match: string;

	@IsDateString()
	@ApiModelProperty()
	readonly date: string;

	@IsOptional()
	@IsString()
	@MinLength(3)
	@ApiModelPropertyOptional()
	readonly note: string;

	@IsString({ each: true })
	@ApiModelProperty()
	readonly participantId: string[];

	@IsString()
	@MinLength(3)
	@ApiModelProperty()
	readonly matchType: string;
}

// tslint:disable-next-line:max-classes-per-file
export class UpdateMatchDTO {
	@IsOptional()
	@IsString()
	@ApiModelPropertyOptional()
	readonly eventId: string;

	@IsOptional()
	@IsString()
	@MinLength(3)
	@ApiModelPropertyOptional()
	readonly match: string;

	@IsOptional()
	@IsDateString()
	@ApiModelPropertyOptional()
	readonly date: string;

	@IsOptional()
	@IsString()
	@MinLength(3)
	@ApiModelPropertyOptional()
	readonly note: string;

	@IsOptional()
	@IsString({ each: true })
	@ApiModelPropertyOptional()
	readonly participantId: string[];

	@IsOptional()
	@IsString()
	@MinLength(3)
	@ApiModelPropertyOptional()
	readonly matchType: string;
}
