import { ApiModelProperty, ApiModelPropertyOptional } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class EventParticipateDTO {
	@IsString()
	@ApiModelProperty()
	readonly eventId: string;

	@IsString()
	@ApiModelProperty()
	readonly participantId: string;
}
