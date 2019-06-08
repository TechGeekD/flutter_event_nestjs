import { Module, MiddlewareConsumer } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { UserController } from "./user.controller";
import { UserService } from "./user.service";

import { RolesSchema } from "./schemas/roles.schema";
import { UserSchema } from "./schemas/user.schema";

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: "Roles", schema: RolesSchema },
			{ name: "User", schema: UserSchema },
		]),
	],
	controllers: [UserController],
	providers: [UserService],
	exports: [UserService],
})
export class UserModule {}
