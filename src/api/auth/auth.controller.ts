import {
	Controller,
	Get,
	Post,
	Body,
	ValidationPipe,
	Headers,
	UseGuards,
} from "@nestjs/common";

import { Roles, RType } from "decorators/roles.decorator";
import { CurrentUser } from "decorators/user.decorator";

import { UserCredsDTO } from "./dto/user-creds.dto";

import { AuthService } from "./auth.service";

import { AuthGuard } from "guard/auth.guard";
import { RolesGuard } from "guard/roles.guard";

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

	@Get("logout")
	@UseGuards(AuthGuard, RolesGuard)
	@Roles(RType.ADMIN, RType.USER)
	unAuthenticateUser(@CurrentUser("id") id, @Headers() headers) {
		const token = headers.authorization.split(" ")[1];
		return this.authService.UnAuthenticateUser(id, token);
	}
}
