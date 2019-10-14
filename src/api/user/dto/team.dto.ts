import { ApiModelProperty, ApiModelPropertyOptional } from "@nestjs/swagger";
import { IsString, IsOptional, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { Document } from "mongoose";

export interface ITeam extends Document {
	user: string;
	teamName: string;
	teamDesc: string;
	teamMembers: [
		{
			member: string;
			role: string;
		},
	];
	toResponseJSON?(): any;
}

export class TeamMembersDTO {
	@IsString()
	@ApiModelProperty()
	readonly member: string;

	@IsString()
	@ApiModelProperty()
	readonly role: string;
}

// tslint:disable-next-line:max-classes-per-file
export class CreateTeamDTO {
	@IsOptional()
	@IsString()
	readonly user: string;

	@IsString()
	@ApiModelProperty()
	readonly teamName: string;

	@IsOptional()
	@IsString()
	@ApiModelPropertyOptional()
	readonly teamDesc: string;

	@ValidateNested({ each: true })
	@ApiModelProperty({ type: [TeamMembersDTO] })
	@Type(() => TeamMembersDTO)
	readonly teamMembers: TeamMembersDTO[];
}

// tslint:disable-next-line:max-classes-per-file
export class UpdateTeamDTO {
	@IsOptional()
	@IsString()
	readonly user: string;

	@IsOptional()
	@IsString()
	@ApiModelPropertyOptional()
	readonly teamName: string;

	@IsOptional()
	@IsString()
	@ApiModelPropertyOptional()
	readonly teamDesc: string;

	@IsOptional()
	@ValidateNested({ each: true })
	@ApiModelPropertyOptional({ type: [TeamMembersDTO] })
	@Type(() => TeamMembersDTO)
	readonly teamMembers: TeamMembersDTO[];
}
