import { ApiModelPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsOptional } from "class-validator";

export class ListAllEntities {
	@IsOptional()
	@IsNumber()
	@ApiModelPropertyOptional()
	readonly limit: number;

	@IsOptional()
	@IsNumber()
	@ApiModelPropertyOptional()
	readonly pageNumber: number;
}
