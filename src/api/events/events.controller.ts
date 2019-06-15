import {
	Controller,
	Body,
	Get,
	Post,
	Put,
	Delete,
	Query,
	Param,
	UseGuards,
	ValidationPipe,
} from "@nestjs/common";
import { ApiUseTags, ApiBearerAuth } from "@nestjs/swagger";

import { CurrentUser } from "decorators/user.decorator";
import { Roles, RType } from "decorators/roles.decorator";
import { BodyExcludes } from "decorators/body-excludes.decorator";

import { ListAllEntities } from "api/user/dto/list-all-entities.dto";
import { CreateEventDTO } from "./dto/create-event.dto";

import { EventsService } from "./events.service";

import { RolesGuard } from "guard/roles.guard";
import { AuthGuard } from "guard/auth.guard";

@ApiUseTags("Events")
@ApiBearerAuth()
@Controller("events")
@UseGuards(AuthGuard, RolesGuard)
export class EventsController {
	constructor(private readonly eventsService: EventsService) {}

	@Post()
	@Roles(RType.ADMIN, RType.USER)
	create(
		@Body(new ValidationPipe())
		@BodyExcludes(["createdBy"])
		createEventDTO: CreateEventDTO,
		@CurrentUser("id") id: string,
	) {
		return this.eventsService.createNewEvent(id, createEventDTO);
	}

	@Get()
	@Roles(RType.ADMIN, RType.USER)
	findAll(@Query() query: ListAllEntities) {
		return this.eventsService.getAllEvent();
	}

	@Get("user/:id")
	@Roles(RType.ADMIN, RType.USER)
	findAllEventsByUser(
		@Param("id") id: string,
		@Query() query: ListAllEntities,
	) {
		return this.eventsService.getAllEventsByUser(id);
	}

	@Get(":id")
	@Roles(RType.ADMIN, RType.USER)
	findOne(@Param("id") id: string) {
		return this.eventsService.getEventById(id);
	}

	@Put(":id")
	@Roles(RType.ADMIN, RType.USER)
	update(
		@Param("id") id: string,
		@BodyExcludes(["createdBy"]) updateEventDTO: CreateEventDTO,
		@CurrentUser("id") createdBy,
	) {
		return this.eventsService.updateEvent(id, updateEventDTO, createdBy);
	}

	@Delete(":id")
	@Roles(RType.ADMIN, RType.USER)
	remove(@Param("id") id: string, @CurrentUser("id") createdBy: string) {
		return this.eventsService.deleteEvent(id, createdBy);
	}
}
