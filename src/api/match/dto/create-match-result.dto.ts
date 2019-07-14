import { ApiModelPropertyOptional, ApiModelProperty } from "@nestjs/swagger";
import { IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

class MatchResultDTO {
	@IsString()
	@ApiModelProperty()
	displayName: string;

	@IsString()
	@ApiModelProperty()
	value: string;
}

// tslint:disable-next-line:max-classes-per-file
export class CreateMatchResultDTO {
	@IsString()
	@ApiModelProperty()
	readonly participantId: string;

	@IsString()
	@ApiModelProperty()
	readonly eventId: string;

	@IsString()
	@ApiModelProperty()
	readonly matchId: string;

	@ValidateNested()
	@ApiModelProperty()
	@Type(() => MatchResultDTO)
	readonly result: MatchResultDTO;

	@IsString()
	@ApiModelProperty()
	readonly status: string;
}
