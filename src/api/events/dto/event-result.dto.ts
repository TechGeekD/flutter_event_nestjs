import { ApiModelProperty, ApiModelPropertyOptional } from "@nestjs/swagger";
import { IsString, ValidateNested } from "class-validator";
import { Document } from "mongoose";
import { Type } from "class-transformer";

export interface IEventResult extends Document {
	eventId: string;
	tournamentResultDetail: [
		{
			displayName: string;
			value: string;
		},
	];
	toResponseJSON?(): any;
}

export class TournamentResultDetails {
	@IsString()
	@ApiModelProperty()
	displayName: string;

	@IsString()
	@ApiModelProperty()
	value: string;
}

// tslint:disable-next-line:max-classes-per-file
export class EventResultDTO {
	@IsString()
	@ApiModelProperty()
	readonly eventId: string;

	@ValidateNested({ each: true })
	@ApiModelProperty({ type: [TournamentResultDetails] })
	@Type(() => TournamentResultDetails)
	readonly tournamentResultDetails: TournamentResultDetails[];
}
