import {
	Controller,
	Post,
	Body,
	ValidationPipe,
	UseGuards,
	Get,
	Param,
} from "@nestjs/common";
import { ApiUseTags, ApiBearerAuth } from "@nestjs/swagger";

import { Roles, RType } from "decorators/roles.decorator";

import { CreateMatchDTO } from "./dto/create-match.dto";

import { MatchService } from "./match.service";

import { AuthGuard } from "guard/auth.guard";
import { RolesGuard } from "guard/roles.guard";
import { CreateMatchResultDTO } from "./dto/create-match-result.dto";

@ApiUseTags("Match")
@ApiBearerAuth()
@Controller("match")
@UseGuards(AuthGuard, RolesGuard)
export class MatchController {
	constructor(private readonly matchService: MatchService) {}

	@Post()
	@Roles(RType.ADMIN, RType.USER)
	createMatch(
		@Body(new ValidationPipe())
		createMatchDTO: CreateMatchDTO,
	) {
		return this.matchService.createNewMatch(createMatchDTO);
	}

	@Get()
	@Roles(RType.ADMIN, RType.USER)
	getAllMatch() {
		return this.matchService.getAllMatch();
	}
	@Get(":id")
	@Roles(RType.ADMIN, RType.USER)
	getAllAllMatchById(@Param("id") eventId: string) {
		return this.matchService.getAllMatchById(eventId);
	}

	@Post("result")
	@Roles(RType.ADMIN, RType.USER)
	createMatchResult(
		@Body(new ValidationPipe())
		createMatchResultDTO: CreateMatchResultDTO,
	) {
		return this.matchService.createNewMatchResult(createMatchResultDTO);
	}

	@Get("result")
	@Roles(RType.ADMIN, RType.USER)
	getAllMatchResult() {
		return this.matchService.getAllMatchResult();
	}
}
