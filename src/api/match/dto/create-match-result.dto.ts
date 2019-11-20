import { ApiModelPropertyOptional, ApiModelProperty } from "@nestjs/swagger";
import {
	IsString,
	ValidateNested,
	IsOptional,
	IsNumber,
} from "class-validator";
import { Type } from "class-transformer";
import { Document } from "mongoose";

export interface IMatchResult extends Document {
	eventId: string;
	matchId: string;
	result: {
		displayName: string;
		value: string;
		extraValues: any;
	};
	status: string;
	participantId: string;
	teamMemberResult: [
		{
			displayName: string;
			member: string;
			memberType: string;
			value: string;
			extraValues: any;
		},
	];
	toResponseJSON?(): any;
}

class MatchResultExtraValues {
	@IsString()
	@ApiModelProperty()
	extra: string;

	@IsString()
	@ApiModelProperty()
	ball: string;

	@IsString()
	@ApiModelProperty()
	wicket: string;
}

// tslint:disable-next-line: max-classes-per-file
class MatchResultDTO {
	@IsString()
	@ApiModelProperty()
	displayName: string;

	@IsString()
	@ApiModelProperty()
	value: string;

	@IsOptional()
	@ValidateNested()
	@Type(() => MatchResultExtraValues)
	@ApiModelPropertyOptional({ type: MatchResultExtraValues })
	extraValues: MatchResultExtraValues;
}

// tslint:disable-next-line: max-classes-per-file
class TeamMemberExtraValues {
	@IsString()
	@ApiModelProperty()
	ball: string;

	@IsString()
	@ApiModelProperty()
	eco: string;

	@IsString()
	@ApiModelProperty()
	sr: string;

	@IsString()
	@ApiModelProperty()
	wickets: string;

	@IsString()
	@ApiModelProperty()
	maiden: string;

	@IsString()
	@ApiModelProperty()
	the6s: string;

	@IsString()
	@ApiModelProperty()
	the4s: string;
}

// tslint:disable-next-line:max-classes-per-file
class TeamMemberResultDTO {
	@IsString()
	@ApiModelProperty()
	readonly displayName: string;

	@IsString()
	@ApiModelProperty()
	readonly member: string;

	@IsString()
	@ApiModelProperty()
	readonly memberType: string;

	@IsString()
	@ApiModelProperty()
	readonly value: string;

	@IsOptional()
	@ValidateNested()
	@Type(() => TeamMemberExtraValues)
	@ApiModelPropertyOptional({ type: TeamMemberExtraValues })
	extraValues: TeamMemberExtraValues;
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
	@ApiModelProperty({ type: MatchResultDTO })
	@Type(() => MatchResultDTO)
	readonly result: MatchResultDTO;

	@ValidateNested()
	@ApiModelProperty({ type: [TeamMemberResultDTO] })
	@Type(() => TeamMemberResultDTO)
	readonly teamMemberResult: TeamMemberResultDTO[];

	@IsString()
	@ApiModelProperty()
	readonly status: string;
}

// tslint:disable-next-line:max-classes-per-file
export class UpdateMatchResultDTO {
	@IsOptional()
	@IsString()
	@ApiModelPropertyOptional()
	readonly participantId: string;

	@IsOptional()
	@IsString()
	@ApiModelPropertyOptional()
	readonly eventId: string;

	@IsOptional()
	@IsString()
	@ApiModelPropertyOptional()
	readonly matchId: string;

	@IsOptional()
	@ValidateNested()
	@ApiModelPropertyOptional({ type: MatchResultDTO })
	@Type(() => MatchResultDTO)
	readonly result: MatchResultDTO;

	@IsOptional()
	@ValidateNested()
	@ApiModelPropertyOptional({ type: [TeamMemberResultDTO] })
	@Type(() => TeamMemberResultDTO)
	readonly teamMemberResult: TeamMemberResultDTO[];

	@IsOptional()
	@IsString()
	@ApiModelPropertyOptional()
	readonly status: string;
}
