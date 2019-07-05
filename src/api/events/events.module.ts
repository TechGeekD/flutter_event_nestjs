import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { EventsController } from "./events.controller";
import { EventsService } from "./events.service";

import { EventsSchema } from "./schemas/events.schema";
import { EventParticipant } from "./schemas/event-participant.schema";

import { UserModule } from "api/user/user.module";

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: "Event", schema: EventsSchema },
			{ name: "EventParticipant", schema: EventParticipant },
		]),
		UserModule,
	],
	providers: [EventsService],
	controllers: [EventsController],
	exports: [EventsService],
})
export class EventsModule {}
