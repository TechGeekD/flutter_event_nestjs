import { ApiModelPropertyOptional, ApiModelProperty } from "@nestjs/swagger";
import { IsOptional, IsString, MinLength, IsDateString } from "class-validator";
import { Document } from "mongoose";

export interface IMatch extends Document {
	eventId: string;
	match: string;
	note?: string;
	participantId: string[];
	date: string;
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
}
