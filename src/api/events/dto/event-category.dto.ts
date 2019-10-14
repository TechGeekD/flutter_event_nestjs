import { ApiModelProperty, ApiModelPropertyOptional } from "@nestjs/swagger";
import { IsString, ValidateNested, IsOptional } from "class-validator";
import { Document } from "mongoose";
import { Type } from "class-transformer";

export interface IEventCategory extends Document {
	category: string;
	metadata: {
		score: {
			displayName: string;
		};
	};
	createdBy: string;
	toResponseJSON?(): any;
}

class ScoreDTO {
	@IsString()
	@ApiModelProperty()
	displayName: string;
}

// tslint:disable: max-classes-per-file
class MetaDataDTO {
	@ValidateNested()
	@ApiModelProperty()
	@Type(() => ScoreDTO)
	readonly score: ScoreDTO;
}

export class EventCategoryDTO {
	@IsString()
	@ApiModelProperty()
	readonly category: string;

	@IsString()
	@ApiModelProperty()
	readonly displayName: string;

	@ValidateNested()
	@ApiModelProperty()
	@Type(() => MetaDataDTO)
	readonly metadata: MetaDataDTO;

	@IsOptional()
	@IsString()
	readonly createdBy: string;
}
