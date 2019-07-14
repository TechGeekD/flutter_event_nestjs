import { ApiModelPropertyOptional, ApiModelProperty } from "@nestjs/swagger";
import { IsOptional, IsString, MinLength, IsDateString } from "class-validator";

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
