import { MongooseModule } from "@nestjs/mongoose";
import { Module, forwardRef } from "@nestjs/common";

import { MatchController } from "./match.controller";
import { MatchService } from "./match.service";

import { MatchSchema } from "./schemas/match.schema";
import { MatchResultSchema } from "./schemas/match-result.schema";

import { UserModule } from "api/user/user.module";

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: "Match", schema: MatchSchema },
			{ name: "MatchResult", schema: MatchResultSchema },
		]),
		forwardRef(() => UserModule),
	],
	controllers: [MatchController],
	providers: [MatchService],
	exports: [MatchService, MongooseModule],
})
export class MatchModule {}
