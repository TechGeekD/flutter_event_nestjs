import {
	Controller,
	Get,
	Post,
	Body,
	ValidationPipe,
	Headers,
	UseGuards,
} from "@nestjs/common";
import { ApiUseTags, ApiBearerAuth } from "@nestjs/swagger";

import { Roles, RType } from "../../decorators/roles.decorator";
import { CurrentUser } from "../../decorators/user.decorator";
import { BodyExcludes } from "../../decorators/body-excludes.decorator";

import { LoginCredsDTO } from "./dto/login-creds.dto";
import { RegisterCredsDTO } from "./dto/register-creds.dto";

import { AuthService } from "./auth.service";

import { AuthGuard } from "../../guard/auth.guard";
import { RolesGuard } from "../../guard/roles.guard";

@ApiUseTags("Auth")
@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post("login")
	authenticateUser(@Body(new ValidationPipe()) userCreds: LoginCredsDTO) {
		return this.authService.AuthenticateUser(userCreds);
	}

	@Post("register")
	signup(
		@Body(new ValidationPipe())
		@BodyExcludes(["token", "roles"])
		userCreds: RegisterCredsDTO,
	) {
		return this.authService.RegisterUser(userCreds);
	}

	@Get("logout")
	@ApiBearerAuth()
	@UseGuards(AuthGuard, RolesGuard)
	@Roles(RType.ADMIN, RType.USER)
	unAuthenticateUser(@CurrentUser("id") id, @Headers() headers) {
		const token = headers.authorization.split(" ")[1];
		return this.authService.UnAuthenticateUser(id, token);
	}
}
