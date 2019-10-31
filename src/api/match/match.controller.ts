import {
	Controller,
	Post,
	Body,
	ValidationPipe,
	UseGuards,
	Get,
	Param,
	Query,
	Put,
} from "@nestjs/common";
import { ApiUseTags, ApiBearerAuth } from "@nestjs/swagger";

import { Roles, RType } from "decorators/roles.decorator";

import { CreateMatchDTO, UpdateMatchDTO } from "./dto/create-match.dto";

import { MatchService } from "./match.service";

import { AuthGuard } from "guard/auth.guard";
import { RolesGuard } from "guard/roles.guard";
import {
	CreateMatchResultDTO,
	UpdateMatchResultDTO,
} from "./dto/create-match-result.dto";
import { ListAllEntities } from "api/user/dto/list-all-entities.dto";
import { MatchQuery } from "./dto/match-query.dto";

@ApiUseTags("Match")
@ApiBearerAuth()
@Controller("match")
@UseGuards(AuthGuard, RolesGuard)
export class MatchController {
	constructor(private readonly matchService: MatchService) {}

	@Post("result")
	@Roles(RType.ADMIN, RType.USER)
	createMatchResult(
		@Body(new ValidationPipe())
		createMatchResultDTO: CreateMatchResultDTO,
	) {
		return this.matchService.createNewMatchResult(createMatchResultDTO);
	}

	@Put("result/:resultId")
	@Roles(RType.ADMIN, RType.USER)
	updateMatchResult(
		@Param("resultId") resultId: string,
		@Body(new ValidationPipe())
		createMatchResultDTO: UpdateMatchResultDTO,
	) {
		return this.matchService.updateMatchResult(resultId, createMatchResultDTO);
	}

	@Get("result")
	@Roles(RType.ADMIN, RType.USER)
	getAllMatchResult() {
		return this.matchService.getAllMatchResult();
	}

	@Get("result/:resultId")
	@Roles(RType.ADMIN, RType.USER)
	getAllMatchResultById(@Param("resultId") resultId: string) {
		return this.matchService.getAllMatchResultById(resultId);
	}

	@Get("result/matchId/:matchId")
	@Roles(RType.ADMIN, RType.USER)
	getMatchResultByMatchId(@Param("matchId") matchId: string) {
		return this.matchService.getMatchResultByMatchId(matchId);
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

	@Get("event/:eventId")
	@Roles(RType.ADMIN, RType.USER)
	getAllMatchByEventId(@Query() query: MatchQuery, @Param("eventId") eventId: string) {
		return this.matchService.getAllMatchByEventId(eventId, query);
	}

	@Post()
	@Roles(RType.ADMIN, RType.USER)
	createMatch(
		@Body(new ValidationPipe())
		createMatchDTO: CreateMatchDTO,
	) {
		return this.matchService.createNewMatch(createMatchDTO);
	}

	@Put(":matchId")
	@Roles(RType.ADMIN, RType.USER)
	updateMatch(
		@Param("matchId") matchId: string,
		@Body(new ValidationPipe())
		updateMatchDTO: UpdateMatchDTO,
	) {
		return this.matchService.updateMatch(matchId, updateMatchDTO);
	}

	@Get()
	@Roles(RType.ADMIN, RType.USER)
	getAllMatch(@Query() query: MatchQuery) {
		return this.matchService.getAllMatch(query);
	}

	@Get(":matchId")
	@Roles(RType.ADMIN, RType.USER)
	getMatchDetails(@Param("matchId") matchId: string) {
		return this.matchService.getMatchDetails(matchId);
	}
}
