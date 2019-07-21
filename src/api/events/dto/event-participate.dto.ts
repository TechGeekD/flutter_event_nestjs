import { ApiModelProperty, ApiModelPropertyOptional } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { Document } from "mongoose";

export interface IEventParticipant extends Document {
	event: string;
	participant: string;
	toResponseJSON?(responseType?: {
		usersEvent?: boolean;
		eventUsers?: boolean;
	}): any;
}

export class EventParticipateDTO {
	@IsString()
	@ApiModelProperty()
	readonly eventId: string;

	@IsString()
	@ApiModelProperty()
	readonly participantId: string;
}
