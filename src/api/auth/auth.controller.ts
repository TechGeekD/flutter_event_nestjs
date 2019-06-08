import { ExtractJwt } from "passport-jwt";
import { AuthService } from "./auth.service";
import { Controller, Post, Body, ValidationPipe, Req } from "@nestjs/common";

import { UserCredsDTO } from "./dto/user-creds.dto";

@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post("login")
	authenticateUser(@Body(new ValidationPipe()) userCreds: UserCredsDTO) {
		return this.authService.AuthenticateUser(userCreds);
	}

	@Post("register")
	signup(@Body(new ValidationPipe()) userCreds: UserCredsDTO) {
		return this.authService.RegisterUser(userCreds);
	}

	@Post("logout")
	unAuthenticateUser(@Req() req) {
		const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
		return this.authService.UnAuthenticateUser(token);
	}
}
