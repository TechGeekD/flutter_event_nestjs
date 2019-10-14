import { Module, forwardRef } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";

import config from "config";

import { AuthController } from "./auth.controller";

import { AuthService } from "./auth.service";
import { JwtStrategy } from "./jwt.strategy";

import { UserModule } from "api/user/user.module";
import { EventsModule } from "api/events/events.module";

@Module({
	imports: [
		PassportModule.register({ defaultStrategy: "jwt" }),
		JwtModule.register({
			secret: config.jwtSecret,
			signOptions: {
				expiresIn: 3600,
			},
		}),
		forwardRef(() => UserModule),
		forwardRef(() => EventsModule),
	],
	controllers: [AuthController],
	providers: [AuthService, JwtStrategy],
	exports: [UserModule, EventsModule, PassportModule, AuthService],
})
export class AuthModule {}
