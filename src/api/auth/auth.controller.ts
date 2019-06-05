import { ExtractJwt } from "passport-jwt";
import { AuthService } from "./auth.service";
import {
	Controller,
	Post,
	Body,
	ValidationPipe,
	Param,
	Req,
} from "@nestjs/common";

import { UserCredsDTO } from "./dto/user-creds.dto";

@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post()
	authenticateUser(@Body(new ValidationPipe()) userCreds: UserCredsDTO) {
		return this.authService.AuthenticateUser(userCreds);
	}

	@Post()
	signup(@Body(new ValidationPipe()) userCreds: UserCredsDTO) {
		return userCreds;
	}

	@Post(":id")
	unAuthenticateUser(@Param("id") id: string, @Req() req) {
		const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
		return this.authService.UnAuthenticateUser(id, token);
	}
}
