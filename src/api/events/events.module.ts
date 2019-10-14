import { Module, forwardRef } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { EventsController } from "./events.controller";
import { EventsService } from "./events.service";

import { EventsSchema } from "./schemas/events.schema";
import { EventParticipantSchema } from "./schemas/event-participant.schema";
import { EventResultSchema } from "./schemas/event-result.schema";
import { EventCategorySchema } from "./schemas/event-category.schema";

import { UserModule } from "api/user/user.module";
import { MatchModule } from "api/match/match.module";

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: "Event", schema: EventsSchema },
			{ name: "EventParticipant", schema: EventParticipantSchema },
			{ name: "EventResult", schema: EventResultSchema },
			{ name: "EventCategory", schema: EventCategorySchema },
		]),
		forwardRef(() => UserModule),
		forwardRef(() => MatchModule),
	],
	providers: [EventsService],
	controllers: [EventsController],
	exports: [EventsService],
})
export class EventsModule {}
