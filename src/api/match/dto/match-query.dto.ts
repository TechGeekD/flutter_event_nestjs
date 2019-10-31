import { ApiModelPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsDateString, IsString } from "class-validator";

export class MatchQuery {
	@IsOptional()
	@IsDateString()
	@ApiModelPropertyOptional()
	readonly startDate: string;

	@IsOptional()
	@IsDateString()
	@ApiModelPropertyOptional()
	readonly endDate: string;

	@IsOptional()
	@IsString()
	@ApiModelPropertyOptional()
	readonly teamId: string;
}
