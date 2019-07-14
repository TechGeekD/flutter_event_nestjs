import { MongooseModule } from "@nestjs/mongoose";
import { Module } from "@nestjs/common";

import { MatchController } from "./match.controller";
import { MatchService } from "./match.service";

import { MatchSchema } from "./schemas/match.schema";
import { MatchResultSchema } from "./schemas/match-result.schema";

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: "Match", schema: MatchSchema },
			{ name: "MatchResult", schema: MatchResultSchema },
		]),
	],
	controllers: [MatchController],
	providers: [MatchService],
})
export class MatchModule {}
