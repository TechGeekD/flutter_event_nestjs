import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { EventsController } from "./events.controller";
import { EventsService } from "./events.service";

import { EventsSchema } from "./schemas/events.schema";

import { UserModule } from "api/user/user.module";

@Module({
	imports: [
		MongooseModule.forFeature([{ name: "Events", schema: EventsSchema }]),
		UserModule,
	],
	providers: [EventsService],
	controllers: [EventsController],
	exports: [EventsService],
})
export class EventsModule {}
