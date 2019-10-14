import { ApiModelPropertyOptional, ApiModelProperty } from "@nestjs/swagger";
import { IsString, ValidateNested, IsOptional } from "class-validator";
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

class MatchResultDTO {
	@IsString()
	@ApiModelProperty()
	displayName: string;

	@IsString()
	@ApiModelProperty()
	value: string;

	@IsOptional()
	@ApiModelPropertyOptional()
	extraValues: any;
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
	@ApiModelPropertyOptional()
	extraValues: any;
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
