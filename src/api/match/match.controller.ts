import {
	Controller,
	Post,
	Body,
	ValidationPipe,
	UseGuards,
	Get,
	Param,
	Query,
} from "@nestjs/common";
import { ApiUseTags, ApiBearerAuth } from "@nestjs/swagger";

import { Roles, RType } from "decorators/roles.decorator";

import { CreateMatchDTO } from "./dto/create-match.dto";

import { MatchService } from "./match.service";

import { AuthGuard } from "guard/auth.guard";
import { RolesGuard } from "guard/roles.guard";
import { CreateMatchResultDTO } from "./dto/create-match-result.dto";
import { ListAllEntities } from "api/user/dto/list-all-entities.dto";

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

	@Get("result/:id")
	@Roles(RType.ADMIN, RType.USER)
	getAllMatchResultById(@Param("id") matchId: string) {
		return this.matchService.getAllMatchResultById(matchId);
	}

	@Get("leaderBoard")
	@Roles(RType.ADMIN, RType.USER)
	getGlobalLeaderBoard(@Query() query: ListAllEntities) {
		return this.matchService.getGlobalLeaderBoard();
	}

	@Get("leaderBoard/:eventId")
	@Roles(RType.ADMIN, RType.USER)
	getLeaderBoardOfEvent(
		@Param("eventId") eventId: string,
		@Query() query: ListAllEntities,
	) {
		return this.matchService.getLeaderBoardOfEvent(eventId);
	}

	@Get()
	@Roles(RType.ADMIN, RType.USER)
	getAllMatch() {
		return this.matchService.getAllMatch();
	}

	@Get("/event/:id")
	@Roles(RType.ADMIN, RType.USER)
	getAllMatchByEventId(@Param("id") eventId: string) {
		return this.matchService.getAllMatchByEventId(eventId);
	}

	@Get(":id")
	@Roles(RType.ADMIN, RType.USER)
	getMatchDetails(@Param("id") matchId: string) {
		return this.matchService.getMatchDetails(matchId);
	}
}
