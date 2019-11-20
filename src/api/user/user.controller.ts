import {
	Controller,
	Body,
	Get,
	Post,
	Put,
	Delete,
	Param,
	Query,
	UseGuards,
	ValidationPipe,
} from "@nestjs/common";
import { ApiUseTags, ApiBearerAuth } from "@nestjs/swagger";

import { RType, Roles } from "../../decorators/roles.decorator";
import { CurrentUser } from "../../decorators/user.decorator";
import { BodyExcludes } from "../../decorators/body-excludes.decorator";

import { CreateUserDTO } from "./dto/create-user.dto";
import { UpdateUserDTO } from "./dto/update-user.dto";
import { ListAllEntities } from "./dto/list-all-entities.dto";

import { AuthGuard } from "../../guard/auth.guard";
import { RolesGuard } from "../../guard/roles.guard";

import { UserService } from "./user.service";
import { CreateTeamDTO, UpdateTeamDTO } from "./dto/team.dto";

@ApiUseTags("Users")
@ApiBearerAuth()
@Controller("user")
@UseGuards(AuthGuard, RolesGuard)
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get("team/userId/:userId")
	@Roles(RType.ADMIN, RType.USER)
	findTeamByUserId(@Param("userId") id: string) {
		return this.userService.getTeamByUserId(id);
	}

	@Get("team/:teamId")
	@Roles(RType.ADMIN, RType.USER)
	findOneTeam(@Param("teamId") id: string) {
		return this.userService.getTeamById(id);
	}

	@Get("team")
	@Roles(RType.ADMIN, RType.USER)
	findAllTeam() {
		return this.userService.getAllTeam();
	}

	@Post("team")
	@Roles(RType.ADMIN, RType.USER)
	createTeam(
		@Body(new ValidationPipe()) createTeamDTO: CreateTeamDTO,
		@CurrentUser("id") user: string,
	) {
		const createTeam: CreateTeamDTO = {
			...createTeamDTO,
			user,
			teamMembers: [
				...createTeamDTO.teamMembers,
				{
					member: user,
					role: "captain",
				},
			],
		};
		return this.userService.createTeam(createTeam);
	}

	@Put("team/:teamId")
	@Roles(RType.ADMIN, RType.USER)
	updateTeam(
		@Param("teamId") teamId: string,
		@Body(new ValidationPipe()) updateTeamDTO: UpdateTeamDTO,
		@CurrentUser("id") currentUserId: string,
	) {
		return this.userService.updateTeam(teamId, updateTeamDTO, currentUserId);
	}

	@Post()
	@Roles(RType.ADMIN)
	create(@Body(new ValidationPipe()) createUserDTO: CreateUserDTO) {
		return this.userService.setNewUser(createUserDTO);
	}

	@Get()
	@Roles(RType.ADMIN, RType.USER)
	findAll(@Query() query: ListAllEntities, @CurrentUser("id") id: string) {
		return this.userService.getAllUser(id);
	}

	@Get(":userId")
	@Roles(RType.ADMIN, RType.USER)
	findOne(@Param("userId") userId: string) {
		return this.userService.getUserById(userId);
	}

	@Put(":userId")
	@Roles(RType.ADMIN)
	update(
		@Param("userId") userId: string,
		@Body(new ValidationPipe({ skipMissingProperties: true }))
		@BodyExcludes(["token", "roles", "username", "password", "email"])
		updateUserDTO: UpdateUserDTO,
	) {
		return this.userService.updateUser(userId, updateUserDTO);
	}

	@Delete(":userId")
	@Roles(RType.ADMIN)
	remove(@Param("userId") userId: string) {
		return this.userService.deleteUser(userId);
	}
}
