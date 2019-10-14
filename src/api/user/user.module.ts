import { Module, MiddlewareConsumer, forwardRef } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { UserController } from "./user.controller";
import { UserService } from "./user.service";

import { RolesSchema } from "./schemas/roles.schema";
import { UserSchema } from "./schemas/user.schema";
import { TeamsSchema } from "./schemas/team.schema";
import { MatchModule } from "api/match/match.module";

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: "Role", schema: RolesSchema },
			{ name: "User", schema: UserSchema },
			{ name: "Team", schema: TeamsSchema },
		]),
		forwardRef(() => MatchModule),
	],
	controllers: [UserController],
	providers: [UserService],
	exports: [UserService, MongooseModule],
})
export class UserModule {}
