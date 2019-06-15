import { ApiModelProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class ListAllEntities {
	@IsNumber()
	@ApiModelProperty()
	readonly limit: number;
}
