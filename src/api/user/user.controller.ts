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
} from "@nestjs/common";
import { ApiUseTags, ApiBearerAuth } from "@nestjs/swagger";

import { RType, Roles } from "decorators/roles.decorator";
import { BodyExcludes } from "decorators/body-excludes.decorator";

import { CreateUserDTO } from "./dto/create-user.dto";
import { UpdateUserDTO } from "./dto/update-user.dto";
import { ListAllEntities } from "./dto/list-all-entities.dto";

import { AuthGuard } from "guard/auth.guard";
import { RolesGuard } from "guard/roles.guard";

import { UserService } from "./user.service";

@ApiUseTags("Users")
@ApiBearerAuth()
@Controller("user")
@UseGuards(AuthGuard, RolesGuard)
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post()
	@Roles(RType.ADMIN)
	create(@Body() createUserDTO: CreateUserDTO) {
		return this.userService.setNewUser(createUserDTO);
	}

	@Get()
	@Roles(RType.ADMIN, RType.USER)
	findAll(@Query() query: ListAllEntities) {
		return this.userService.getAllUser();
	}

	@Get(":id")
	@Roles(RType.ADMIN, RType.USER)
	findOne(@Param("id") id: string) {
		return this.userService.getUserById(id);
	}

	@Put(":id")
	@Roles(RType.ADMIN)
	update(
		@Param("id") id: string,
		@BodyExcludes(["token", "roles", "username", "password", "email"])
		updateUserDTO: UpdateUserDTO,
	) {
		return this.userService.updateUser(id, updateUserDTO);
	}

	@Delete(":id")
	@Roles(RType.ADMIN)
	remove(@Param("id") id: string) {
		return this.userService.deleteUser(id);
	}
}
