import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";

import config from "../../config";

import { AuthService } from "./auth.service";

import { IJwtPayload } from "./dto/login-creds.dto";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly authService: AuthService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: config.jwtSecret,
		});
	}

	async validate(payload: IJwtPayload) {
		const user = await this.authService.ValidateUser(payload);

		if (!user) {
			throw new UnauthorizedException();
		}

		return user;
	}
}
