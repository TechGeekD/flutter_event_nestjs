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

import { CreateUserDTO } from "./dto/create-user.dto";
import { UpdateUserDTO } from "./dto/update-user.dto";
import { ListAllEntities } from "./dto/list-all-entities.dto";

import { AuthGuard } from "../../guard/auth.guard";
import { RolesGuard } from "../../guard/roles.guard";
import { Roles } from "../../guard/roles.decorator";
import { UserService } from "./user.service";

@Controller("user")
// @UseGuards(AuthGuard, RolesGuard)
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post()
	@Roles("admin")
	create(@Body() createUserDTO: CreateUserDTO) {
		return this.userService.setNewUser(createUserDTO);
	}

	@Get()
	@Roles("admin")
	findAll(@Query() query: ListAllEntities) {
		return this.userService.getAllUser();
	}

	@Get(":id")
	@Roles("admin")
	findOne(@Param("id") id: string) {
		return this.userService.getUserById(id);
	}

	@Put(":id")
	@Roles("admin")
	update(@Param("id") id: string, @Body() updateUserDTO: UpdateUserDTO) {
		return this.userService.updateUser(id, updateUserDTO);
	}

	@Delete(":id")
	@Roles("admin")
	remove(@Param("id") id: string) {
		return this.userService.deleteUser(id);
	}
}
