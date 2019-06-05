import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";

import { AuthService } from "./auth.service";

import { IJwtPayload } from "./interfaces/jwt-payload.interface";
import config from "../../config";

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
